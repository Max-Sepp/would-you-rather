import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";

export const QuestionsRouter = createTRPCRouter({
  percentageUpdate: publicProcedure
    .input(z.object({
      pageId: z.number(),
      leftClicked: z.boolean() // call the procedure if this is false then right option is clicked
    }))
    .mutation(async ({input, ctx}) => {

    }),

  createQuestion: publicProcedure
    .input(z.object({
      leftQuestion: z.string().max(190),
      rightQuestion: z.string().max(190)
    }))
    .mutation(async ({input, ctx}) => {
      
    }),

  setQuestionPageId:  protectedProcedure
    .input(z.object({
        id: z.number(),
        questionPageId: z.number()
      })
    )
    .mutation( async ({ctx, input}) => {
      
    }),

  acceptQuestion:  protectedProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ctx, input}) => {
      
    }),

  deleteQuestion: protectedProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({input, ctx}) => {
      
    })
});
