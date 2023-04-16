import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";

export const QuestionsRouter = createTRPCRouter({
  numQuestions: publicProcedure
    .query(async ({ctx}) => {
      const largestQuestionPageId = await ctx.prisma.question.findFirst({
        orderBy: {
          questionPageId: "desc"
        }
      })

      if (!largestQuestionPageId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Found no questions'
        })
      }

      return largestQuestionPageId.questionPageId
    }),
  
  getByID: publicProcedure
    .input(z.object({id: z.number()}))
    .query(async ({input, ctx}) => {

      const {id} = input;

      if (id < 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Not allowed to access question which is not active'
        })
      }

      const question = await ctx.prisma.question.findFirst({
        where: {
          questionPageId: id,
        }
      })

      if (!question) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No question free with '${id}'`
        })
      }

      return question
    }),

  percentageUpdate: publicProcedure
    .input(z.object({
      pageId: z.number(),
      leftClicked: z.boolean() // call the procedure if this is false then right option is clicked
    }))
    .mutation(async ({input, ctx}) => {

      if (input.pageId < 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Not allowed to access question which is not active'
        })
      }
  
      const leftChosenIncrease = (input.leftClicked) ? 1 : 0;
  
      try {
        await ctx.prisma.question.updateMany({
          where: {
            questionPageId: input.pageId
          },
          data: {
            leftChosen: {increment: leftChosenIncrease},
            totalChosen: {increment: 1}
          },
        });
      } catch(error) {
        throw new TRPCError({
          code:'NOT_FOUND',
          message:'error'
        })
      }

      return {message:"Success"};
    }),

  createQuestion: publicProcedure
    .input(z.object({
      leftQuestion: z.string().max(190),
      rightQuestion: z.string().max(190)
    }))
    .mutation(async ({input, ctx}) => {
      await ctx.prisma.question.create({
        data: {
          leftQuestion: input.leftQuestion,
          rightQuestion: input.rightQuestion
        }
      })

      return {message: 'success'}
    }),
  
    list: publicProcedure
    .input(z.object({
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(100).default(10)
    }))
    .query(async ({ctx, input}) => {
      const {cursor, limit} = input;


      const questions = await ctx.prisma.question.findMany({
        take: input.limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          {questionPageId: 'asc'},
          {createdAt: 'desc'}
        ],
        where: { 
          NOT: {
            questionPageId: -1
          }
        }
      })

      let nextCursor: typeof cursor | undefined = undefined;

      if (questions.length > limit) {
        const nextItem = questions.pop() as typeof questions[number];

        nextCursor = nextItem.id;
      }

      return {
        questions,
        nextCursor,
      };
    }),

  listUnaccepted:  protectedProcedure
    .input(z.object({
      where: z.object({
        unacceptedQuestions: z.boolean().default(false),
      }),
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(100).default(10)
    }))
    .query(async ({ctx, input}) => {
      const {cursor, limit} = input;
      const {unacceptedQuestions} = input.where

      const questions = await ctx.prisma.question.findMany({
        take: input.limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          {questionPageId: 'asc'},
          {createdAt: 'desc'}
        ],
        where: unacceptedQuestions ? {questionPageId: -1} : undefined
      })

      let nextCursor: typeof cursor | undefined = undefined;

      if (questions.length > limit) {
        const nextItem = questions.pop() as typeof questions[number];

        nextCursor = nextItem.id;
      }

      return {
        questions,
        nextCursor,
      };
    }),

  setQuestionPageId:  protectedProcedure
    .input(z.object({
        id: z.string().cuid(),
        questionPageId: z.number()
      })
    )
    .mutation( async ({ctx, input}) => {
      const questionWithPageId = await ctx.prisma.question.findMany({
        where: {
          questionPageId: input.questionPageId
        }
      })

      if (questionWithPageId.length != 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'questionPageId already in use'
        })
      }

      await ctx.prisma.question.update({
        where: {id: input.id},
        data: { questionPageId: input.questionPageId},
      })

      return {message: 'success'}
    }),

  acceptQuestion:  protectedProcedure
    .input(z.object({
      id: z.string().cuid()
    }))
    .mutation(async ({ctx, input}) => {
      const largestQuestionPageId = await ctx.prisma.question.findFirst({
        orderBy: {
          questionPageId: "desc"
        }
      })

      let pageId = 1
      if (largestQuestionPageId) {
        pageId = largestQuestionPageId.questionPageId + 1
      } 
    
      await ctx.prisma.question.update({
        where: {id: input.id},
        data: { questionPageId: pageId},
      })

      return {questionPageId: pageId}
    }),

  deleteQuestion: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({input, ctx}) => {
      try {
        await ctx.prisma.question.delete({
          where: {
            id: input.id
          }
        })
      } catch(error) {
        if (error instanceof Prisma.NotFoundError)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Did not find the question"
        })
      }

      return {message: "successful"}
    })
});
