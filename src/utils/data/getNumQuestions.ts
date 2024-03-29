import { cache } from "react";
import { db } from "~/db/db";

/**
 * Gets the number of would you rather questions in the database
 */
export const getNumQuestion = cache(async () => {
  const numQuestions = await db.selectFrom("Question").select("questionPageId").orderBy("questionPageId", "desc").executeTakeFirst();
  if (numQuestions == undefined) {
    return 0
  } else {
    return numQuestions.questionPageId
  }
});
