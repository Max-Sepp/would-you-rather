export const config = {
  runtime: 'edge', 
  regions: ['dub1'], 
};

import { NextResponse } from "next/server";
import { db } from "~/db/db";

/**
 * Infinite query for list page 
 *
 */
export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const pageParam = searchParams.get("page");
  let page;
  if (pageParam == null) {
    page = 0;
  } else {
    page = Number(pageParam);
  }

  const questions = await db.selectFrom("Question").selectAll().where("questionPageId", ">", 0).orderBy("questionPageId", "asc").offset(10 * page + 1).limit(10).execute();

  return NextResponse.json({data: questions, hasNextPage: (questions.length == 10)}, {status: 200});
}