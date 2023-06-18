export const runtime = 'edge';

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/db/db";
import { env } from "~/env.mjs";


// change the questionPageId to whatever is sent in the body of the query
const setQuestionPageIdInputSchema = z.object({
  id: z.number(),
  questionPageId: z.number()
})

export async function POST(req: Request) {
  if (req.headers.get("Authorization") != env.ADMIN_KEY) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const body = await req.json();
  const parsedData = await setQuestionPageIdInputSchema.safeParseAsync(body);
  let data;

  if (!parsedData.success) {
    return NextResponse.json({ success: false }, { status: 400 })
  } else {
    data = parsedData.data
  }

  const result = await db
    .updateTable("Question")
    .set({
      questionPageId: data.questionPageId
    })
    .where("id", "=", data.id)
    .executeTakeFirst()

  if (result.numUpdatedRows > 0) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  return NextResponse.json({ success: false }, { status: 500 })
}


const deleteQuestionInputSchema = z.object({
  id: z.number()
})

export async function DELETE(req: Request) {
  if (req.headers.get("Authorization") != env.ADMIN_KEY) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("id");
  let id;
  if (pageParam == null) {
    id = 0;
  } else {
    id = Number(pageParam);
  }

  const result = await db.deleteFrom("Question").where("id", "=", id).execute();

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

  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");
  let page;
  if (pageParam == null) {
    page = 0;
  } else {
    page = Number(pageParam);
  }

  const questions = await db.selectFrom("Question").selectAll().orderBy("questionPageId", "asc").offset(10 * page + 1).limit(10).execute();

  return NextResponse.json({ data: questions, hasNextPage: (questions.length == 10) }, { status: 200 });
}