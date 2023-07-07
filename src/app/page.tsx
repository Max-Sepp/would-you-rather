export const revalidate = 600;
export const runtime = 'edge';
export const preferredRegion = 'dub1';

import Link from "next/link";
import { getNumQuestion } from "~/utils/data/getNumQuestions";
import TryWouldYouRather from "./TryWouldYouRather";

export default async function Home() {

  const numQuestions = await getNumQuestion();

  return (
    <>
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-3xl md:text-5xl">Would You Rather?</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <TryWouldYouRather numQuestions={numQuestions} />
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
        <Link href='/suggest'>
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex items-center justify-center flex-none">
            Suggest a would you rather?
          </div>
        </Link>
      </div>
      <h3 className="text-slate-900 dark:text-white text-center p-5 text-2xl">By Max Smith</h3>
    </>
  )
}
