export const runtime = 'edge'; export const preferredRegion = 'dub1'

import { NextResponse } from 'next/server';
import { z } from "zod";
import { db } from '~/db/db';

const suggestInputSchema = z.object({
  leftQuestion: z.string().max(190),
  rightQuestion: z.string().max(190)
})

export async function POST(req: Request) {
  const body = await req.json();
  const parsedData = await suggestInputSchema.safeParseAsync(body);
  let data;

  if (!parsedData.success) {
    return NextResponse.json(null, {status: 400})
  } else {
    data = parsedData.data
  }

  try {
    await db.insertInto("Question").values({
      leftQuestion: data.leftQuestion,
      rightQuestion: data.rightQuestion
    }).executeTakeFirstOrThrow();
  } catch(err){
    return NextResponse.json(null, {status: 500})
  }
  
  return NextResponse.json("succesful", {status: 200})
}