"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { questions, useFetchInfiniteQuestion } from "~/utils/fetchInfiniteQuestion";

import { useScrollPosition } from "~/utils/useScrollPosition";

function QuestionCard({ leftQuestion, rightQuestion, questionPageId }: { leftQuestion: string, rightQuestion: string, questionPageId: number }) {
  return (

    <div className="rounded-xl m-2 p-1 dark:bg-slate-900 bg-slate-100 max-w-4xl mx-auto">
      <Link href={`/${encodeURIComponent(questionPageId)}`}>
        <div className="flex flex-col md:flex-row justify-center items-center gap-1">
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 w-96 text-center flex flex-col items-center justify-center gap-4">
            <div className="text-base">
              {leftQuestion}
            </div>
          </div>
          <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-xl">OR</div>
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 w-96 text-center flex flex-col items-center justify-center gap-4">
            <div className="text-base">
              {rightQuestion}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function List({ initialData }: { initialData: questions }) {

  const scrollPosition = useScrollPosition();

  const { isFetching, hasNextPage, fetchNextPage, data } = useFetchInfiniteQuestion(initialData)

  useEffect(() => {
    if (scrollPosition > 0.9 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  const questions = data?.flatMap((page) => page) ?? [];

  return (
    <>
      {questions.map((question) => {
        return (
          <QuestionCard
            key={question.questionId}
            leftQuestion={question.leftQuestion}
            rightQuestion={question.rightQuestion}
            questionPageId={question.questionPageId}
          />
        )
      })}
    </>
  )
}