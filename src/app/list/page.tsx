export const runtime = 'edge';
export const preferredRegion = 'dub1';

import List from "~/components/List";
import { db } from "~/db/db";

export default async function Page() {
  const questions = await db.selectFrom("Question").selectAll().where("questionPageId", ">", 0).orderBy("questionPageId", "asc").offset(0).limit(10).execute();


  return (
    <List initialData={questions} />
  )
}