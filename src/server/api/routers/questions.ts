import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter, publicProcedure
} from "~/server/api/trpc";

export const QuestionsRouter = createTRPCRouter({
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
});
