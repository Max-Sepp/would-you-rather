import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/db/db";
import { env } from "~/env.mjs";

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

  const body = await req.json();
  const parsedData = await acceptInputSchema.safeParseAsync(body);
  let data;

  if (!parsedData.success) {
    return NextResponse.json({ success: false }, { status: 400 })
  } else {
    data = parsedData.data
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
    .where("id", "=", data.id)
    .executeTakeFirst()

  if (result.numUpdatedRows > 0) {
    return NextResponse.json({ questionPageId: largestQuestionPageId.questionPageId + 1 }, { status: 200 })
  }

  return NextResponse.json({ success: false }, { status: 500 })
}