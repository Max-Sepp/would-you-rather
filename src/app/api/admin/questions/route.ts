export const runtime = 'edge'; 
export const preferredRegion = 'dub1';

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/db/db";
import { env } from "~/env.mjs";
import { getBodyData, getNumSearchParam } from "~/utils/parseData";


// change the questionPageId to whatever is sent in the body of the query
const setQuestionPageIdInputSchema = z.object({
  id: z.number(),
  questionPageId: z.number()
})

/**
 *  changes the questionPageId of the given would you rather question
 */
export async function POST(req: Request) {
  if (req.headers.get("Authorization") != env.ADMIN_KEY) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const data = await getBodyData(req, setQuestionPageIdInputSchema);

  if (data == null) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const result = await db
    .updateTable("Question")
    .set({
      questionPageId: data.questionPageId
    })
    .where("questionId", "=", data.id)
    .executeTakeFirst()

  if (result.numUpdatedRows > 0) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  return NextResponse.json({ success: false }, { status: 500 })
}

/**
 * deletes the given would you rather question
 */
export async function DELETE(req: Request) {
  if (req.headers.get("Authorization") != env.ADMIN_KEY) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const id = getNumSearchParam(req, "id")

  const result = await db.deleteFrom("Question").where("questionId", "=", id).execute();

  if (result.length = 1) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  return NextResponse.json({ success: false, message: "Did not find the question" }, { status: 404 })
}

/**
 * Infinite query for list page 
 *
 */
export async function GET(req: Request) {
  if (req.headers.get("Authorization") != env.ADMIN_KEY) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const page = getNumSearchParam(req, "page")

  const questions = await db.selectFrom("Question").selectAll().orderBy("questionPageId", "asc").offset(10 * page + 1).limit(10).execute();

  return NextResponse.json({ data: questions, hasNextPage: (questions.length == 10) }, { status: 200 });
}