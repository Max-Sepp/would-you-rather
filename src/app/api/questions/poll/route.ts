export const runtime = 'edge'; 
export const preferredRegion = 'dub1';

import { NextResponse } from 'next/server';
import { z } from "zod";
import { db } from '~/db/db';
import { getBodyData } from '~/utils/parseData';

const pollInputSchema = z.object({
  leftChosen: z.boolean(),
  questionId: z.number()
})

/** 
 * the endpoint used to poll when a user clicks one answer of the question
 */
export async function POST(req: Request) {
  const data = await getBodyData(req, pollInputSchema)

  if (data == null) {
    return NextResponse.json(null, {status: 400})
  }

  const leftChosen: number = (data.leftChosen) ? 1 : 0;

  const result = await db.updateTable("Question").where("questionId", "=", data.questionId).set(({bxp}) => ({
    leftChosen: bxp("leftChosen", "+", leftChosen),
    totalChosen: bxp("totalChosen", "+", 1)
  })).executeTakeFirst();

  if (Number(result.numUpdatedRows) == 0) {
    return NextResponse.json(null, {status: 400})
  }

  return NextResponse.json(null, {status: 200});
}