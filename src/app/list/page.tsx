import List from "~/components/List";
import { db } from "~/db/db";

export default async function Page() {
  const questions = await db.selectFrom("Question").selectAll().orderBy("questionPageId", "asc").offset(0).limit(10).execute();


  return (
    <List initialData={questions} />
  )
}