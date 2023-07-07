export const runtime = 'edge'; 
export const preferredRegion = 'dub1';

import { NextResponse } from "next/server";
import { db } from "~/db/db";
import { getNumSearchParam } from "~/utils/parseData";

/**
 * Infinite query for list page 
 *
 */
export async function GET(req: Request) {
  const page = getNumSearchParam(req, "page")

  const questions = await db.selectFrom("Question").selectAll().where("questionPageId", ">", 0).orderBy("questionPageId", "asc").offset(10 * page + 1).limit(10).execute();

  return NextResponse.json({data: questions, hasNextPage: (questions.length == 10)}, {status: 200});
}