import { NextResponse } from 'next/server';
import { z } from "zod";
import { db } from '~/db/db';

const pollInputSchema = z.object({
  leftChosen: z.boolean(),
  questionId: z.number()
})

export async function POST(req: Request) {
  const body = await req.json();
  const parsedData = await pollInputSchema.safeParseAsync(body);
  let data;

  if (!parsedData.success) {
    return NextResponse.json(null, {status: 400})
  } else {
    data = parsedData.data
  }

  const leftChosen: number = (data.leftChosen) ? 1 : 0;

  const result = await db.updateTable("question").set(({bxp}) => ({
    leftChosen: bxp("leftChosen", "+", leftChosen),
    totalChosen: bxp("totalChosen", "+", 1)
  })).executeTakeFirst();

  if (Number(result.numUpdatedRows) == 0) {
    return NextResponse.json(null, {status: 400})
  }

  return NextResponse.json(null, {status: 200});
}