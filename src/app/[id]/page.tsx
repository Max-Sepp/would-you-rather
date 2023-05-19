export const revalidate = 600;

import { getNumQuestion } from "~/utils/data/getNumQuestions";
import { getQuestion } from "~/utils/data/getQuestion";
import Question from "./Question";

export default async function Page({ params }: { params: { id: string } }) {

  const pageId = params.id as unknown as number

  // get the question
  const question = await getQuestion(pageId);

  if (question == undefined) {
    return (
      <h1>Question could not be found</h1>
    )
  }

  const leftPercentage = Math.round((question.leftChosen / question.totalChosen) * 100);
  const rightPercentage = 100 - leftPercentage;

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