import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter, publicProcedure
} from "~/server/api/trpc";

export const QuestionsRouter = createTRPCRouter({
  numQuestions: publicProcedure
    .query(async ({ctx}) => {
      const numQuestions = await ctx.prisma.questionBank.findMany();

      if (!numQuestions) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Question bank not found'
        })
      }

      return numQuestions[0]?.numQuestions;
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updatedQuestion = await ctx.prisma.question.updateMany({
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
    })
});
