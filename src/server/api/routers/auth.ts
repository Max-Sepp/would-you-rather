import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const AuthRouter = createTRPCRouter({
  checkSignUpKey: publicProcedure
    .input(z.object({
      key: z.string()
    }))
    .mutation(({input}) => {
      if (input.key === env.SIGN_UP_KEY) {
        return {correct: true}
      } 

      return {correct: false}
    })
})