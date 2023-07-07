export const runtime = 'edge'; 
export const preferredRegion = 'dub1';

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/db/db";
import { env } from "~/env.mjs";
import { getBodyData } from "~/utils/parseData";

const acceptInputSchema = z.object({
  id: z.number()
})

/**
 * accepts a question to be made publicly available
 */
export async function POST(req: Request) {
  if (req.headers.get("Authorization") != env.ADMIN_KEY) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const data = await getBodyData(req, acceptInputSchema)

  if (data == null) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const largestQuestionPageId = await db.selectFrom("Question").select("questionPageId").orderBy("questionPageId", "desc").limit(1).executeTakeFirst();

  if (largestQuestionPageId == undefined) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const result = await db
    .updateTable("Question")
    .set({
      questionPageId: largestQuestionPageId.questionPageId + 1
    })
    .where("questionId", "=", data.id)
    .executeTakeFirst()

  if (result.numUpdatedRows > 0) {
    return NextResponse.json({ questionPageId: largestQuestionPageId.questionPageId + 1 }, { status: 200 })
  }

  return NextResponse.json({ success: false }, { status: 500 })
}