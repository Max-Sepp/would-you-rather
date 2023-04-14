import { AuthRouter } from "~/server/api/routers/auth";
import { QuestionsRouter } from "~/server/api/routers/questions";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  questions: QuestionsRouter,
  Auth: AuthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
