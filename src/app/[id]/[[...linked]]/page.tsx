export const revalidate = 600;
export const runtime = 'edge';

import { redirect } from "next/navigation";
import { getNumQuestion } from "~/utils/data/getNumQuestions";
import { getQuestion } from "~/utils/data/getQuestion";
import Question from "./Question";

export default async function Page({ params }: { params: { id: string, linked: string[] | undefined } }) {

  const pageId = params.id as unknown as number;
  const linked = params.linked;

  // get the question
  const question = await getQuestion(pageId);

  if (question == undefined && linked != undefined && linked[0] == "linked") {
    redirect("/list")
  }

  if (question == undefined) {
    return (
      <h1 className="text-slate-900 dark:text-white text-center text-xl">Question could not be found</h1>
    )
  }

  const leftPercentage = question.totalChosen == 0 ? 0 : Math.round((question.leftChosen / question.totalChosen) * 100);
  const rightPercentage = question.totalChosen == 0 ? 0 : (100 - leftPercentage);

  // get num questions
  const numQuestions = await getNumQuestion();

  return (
    <>
      <Question
        leftOption={question.leftQuestion}
        rightOption={question.rightQuestion}
        leftPercentage={leftPercentage}
        rightPercentage={rightPercentage}
        pageId={pageId}
        numQuestions={numQuestions}
      />
    </>
  )
}