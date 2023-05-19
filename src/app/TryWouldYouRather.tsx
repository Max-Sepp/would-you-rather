'use client';

import Link from "next/link";
import { nextQuestion } from "~/utils/nextQuestion";

export default function TryWouldYouRather({ numQuestions }: { numQuestions: number }) {

  const nextPageId = nextQuestion(numQuestions);

  return (
    <Link href={`/${encodeURIComponent(nextPageId)}`}>
      <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex items-center justify-center flex-none">
        Try a would you rather?
      </div>
    </Link>
  )
}