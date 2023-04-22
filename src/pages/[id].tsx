import { useAutoAnimate } from '@formkit/auto-animate/react';
import NextError from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { type NextPage } from "next/types";
import { useState, type FunctionComponent, type MouseEvent } from "react";
import NavBar from "~/components/NavBar";
import QuestionNotFound from "~/components/QuestionNotFound";
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
  
  const router = useRouter();

  const questionMutation = api.questions.percentageUpdate.useMutation();
  const [answered, setAnswered] = useState(false);

  const [leftParent] = useAutoAnimate();
  const [rightParent] = useAutoAnimate();

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

    setAnswered(false);

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
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-3xl md:text-5xl">Would You Rather?</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <div ref={leftParent} onClick={submitLeftOption} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
          {leftOption}
          </div>
          {answered ? <div>{leftPercentage} %</div> : null}
        </div>
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-xl md:text-3xl">OR</div>
        <div ref={rightParent} onClick={submitRightOption} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
          {rightOption}
          </div>
          {answered ? <div>{rightPercentage} %</div> : null}
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

  const numQuestions = api.questions.numQuestions.useQuery(undefined, {
    staleTime: 10 * (60 * 1000), // 10 mins 
    cacheTime: 15 * (60 * 1000), // 15 mins 
  });

  if (typeof pageId === "undefined" || typeof numQuestions.data == "undefined") {
    return (
      <NextError 
        title={"Could not find the question"}
        statusCode={404}
      />
    )
  }

  const id: number = +pageId

  const questionQuery = api.questions.getByID.useQuery({id}, {retry: false})

  if (id > numQuestions.data || id <= 0 || questionQuery.error) {
    return (
      <>
        <Head>
          <title>Would you rather?</title>
        </Head>
        <QuestionNotFound />
      </>
    )
  }

  const data = questionQuery.data

  let leftPercentage;
  let rightPercentage;
  
  if (typeof data == "undefined") {
    leftPercentage = 50
    rightPercentage = 50
  } else {
    leftPercentage = Math.round((data.leftChosen / data.totalChosen) * 100 );
    rightPercentage =  100 - leftPercentage;
  }

  return (
    <>
      <Head>
        <title>Would you rather?</title>
      </Head>
      <Question
        leftOption={data?.leftQuestion || ""} 
        rightOption={data?.rightQuestion || ""} 
        leftPercentage={leftPercentage}
        rightPercentage={rightPercentage}
        pageId={id}
      />
    </>
  )
}

export default QuestionPage