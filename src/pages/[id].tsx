import NextError from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { type NextPage } from "next/types";
import { useState, type FunctionComponent, type MouseEvent } from "react";
import NavBar from "~/components/NavBar";
import { api } from "~/utils/api";
import { nextQuestion } from "~/utils/nextQuestion";

type QuestionProps = {
  leftOption: string,
  rightOption: string,
  leftPercentage: number,
  rightPercentage: number,
  pageId: number
}

const Question: FunctionComponent<QuestionProps> = ({leftOption, rightOption, leftPercentage, rightPercentage, pageId}) => {
  
  const router = useRouter()

  const questionMutation = api.questions.percentageUpdate.useMutation();
  const [answered, setAnswered] = useState(false)

  const numQuestions = api.questions.numQuestions.useQuery(undefined, {
    staleTime: 10 * (60 * 1000), // 10 mins 
    cacheTime: 15 * (60 * 1000), // 15 mins 
  });

  const nextPage = async () => {
    if (numQuestions.error || typeof numQuestions.data === "undefined") {
      return <NextError 
        statusCode={404}
        message={'The server could not find any more questions'}
      />
    }

    const nextPageId: number = nextQuestion(numQuestions.data);

    await router.push(encodeURIComponent(nextPageId))
  }

  function submitLeftOption(e: MouseEvent) {
    e.preventDefault();
    if (!answered) {
      setAnswered(true);
      questionMutation.mutate({
        pageId,
        leftClicked: true
      })
    }
  }

  function submitRightOption(e: MouseEvent) {
    e.preventDefault();
    if (!answered){
      setAnswered(true);
      questionMutation.mutate({
        pageId,
        leftClicked: false
      })
    }
  }

  return (
    <>
      <Head>
        <title>Would you rather?</title>
      </Head>
      <NavBar />
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-5xl">Would You Rather?</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <div onClick={submitLeftOption} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
          {leftOption}
          </div>
          <div className={`transition-all duration-300 ${answered ? "opacity-100" : "opacity-0"}`}>
          {leftPercentage} %
          </div>
        </div>
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
        <div onClick={submitRightOption} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
          {rightOption}
          </div>
          <div className={`transition-all duration-300 ${answered ? "opacity-100" : "opacity-0"}`}>
          {rightPercentage} %
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <div onClick={nextPage} className="bg-slate-50 dark:bg-slate-700 my-2 mx-auto w-64 p-2 rounded-xl text-slate-600 dark:text-slate-300 text-center">
        Next Would You Rather?
      </div>
    </>
  )
  
}

const QuestionPage: NextPage = () => {
  const pageId = useRouter().query.id;

  if (typeof pageId === "undefined") {
    return (
      <NextError 
        title={"Could not find the question"}
        statusCode={404}
      />
    )
  }

  const id: number = +pageId

  const questionQuery = api.questions.getByID.useQuery({id})

  if (questionQuery.error || typeof questionQuery.data === "undefined") {
    return (
      <NextError 
        title={"Could not find the question"}
        statusCode={404}
      />
    )
  }
  const data = questionQuery.data

  const leftPercentage = Math.round((data.leftChosen / data.totalChosen) * 100 )
  const rightPercentage =  100 - leftPercentage

  return (
    < Question
      leftOption={data.leftQuestion} 
      rightOption={data.rightQuestion} 
      leftPercentage={leftPercentage}
      rightPercentage={rightPercentage}
      pageId={id}
    />
  )
}

export default QuestionPage