import { cache } from "react";
import { db } from "~/db/db";

export const getQuestion = cache(async (pageId: number) => {
  return await db.selectFrom("Question").select(['questionPageId', 'leftQuestion', 'rightQuestion', 'leftChosen', 'totalChosen']).where('questionPageId', '=', pageId).executeTakeFirst();
})