'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from "react";
import { nextQuestion } from "~/utils/nextQuestion";

type QuestionProps = {
  leftOption: string,
  rightOption: string,
  leftPercentage: number,
  rightPercentage: number,
  pageId: number,
  numQuestions: number
}

async function poll({ leftClicked, pageId }: { leftClicked: boolean, pageId: number }) {
  await fetch("/api/questions/poll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      leftChosen: leftClicked,
      questionId: pageId
    })
  })
}

export default function Question({ leftOption, rightOption, leftPercentage, rightPercentage, pageId, numQuestions }: QuestionProps) {


  const [answered, setAnswered] = useState(false);

  const [leftParent] = useAutoAnimate();
  const [rightParent] = useAutoAnimate();

  const [nextPageId, setNextPageId] = useState(nextQuestion(numQuestions));

  const handleSessionStorage = () => {
    let questionsVisited: number[] = []
    const sessionQuestions = sessionStorage.getItem('ms-questions-visited');
    if (sessionQuestions != null) {
      questionsVisited = JSON.parse(sessionQuestions) as number[]
    }
    questionsVisited.push(nextPageId);
    sessionStorage.setItem('ms-questions-visited', JSON.stringify(questionsVisited));
  }

  const nextPage = () => {
    setAnswered(false);

    handleSessionStorage();
  }

  function submitLeftOption(e: MouseEvent) {
    e.preventDefault();
    if (!answered) {
      setAnswered(true);
      poll({ leftClicked: true, pageId })
    }
  }

  function submitRightOption(e: MouseEvent) {
    e.preventDefault();
    if (!answered) {
      setAnswered(true);
      poll({ leftClicked: false, pageId })
    }
  }

  return (
    <>
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-3xl md:text-5xl">Would You Rather?</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <div onClick={submitLeftOption} ref={leftParent} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
            {leftOption}
          </div>
          {answered ? <div>{leftPercentage} %</div> : null}
        </div>
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-xl md:text-3xl">OR</div>
        <div onClick={submitRightOption} ref={rightParent} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
            {rightOption}
          </div>
          {answered ? <div>{rightPercentage} %</div> : null}
        </div>
      </div>
      <Link href={`/${encodeURIComponent(nextPageId)}`}>
        <div onClick={nextPage} className="bg-slate-50 dark:bg-slate-700 my-2 mx-auto w-64 p-2 rounded-xl text-slate-600 dark:text-slate-300 text-center">
          Next Would You Rather?
        </div>
      </Link>
    </>
  )

}

