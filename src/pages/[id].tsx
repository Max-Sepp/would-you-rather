import Head from "next/head";
import Link from "next/link";
import { type NextPage } from "next/types";

const Question: NextPage = () => {

  

  return (
    <>
      <Head>
        <title>Would you rather?</title>
      </Head>
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-5xl">Would You Rather?</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <div onClick={submitLeftOption} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
          {props.leftOption}
          </div>
          <div className={`transition-all duration-300 ${answered ? "opacity-100" : "opacity-0"}`}>
          {props.leftPercentage} %
          </div>
        </div>
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
        <div onClick={submitRightOption} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
          {props.rightOption}
          </div>
          <div className={`transition-all duration-300 ${answered ? "opacity-100" : "opacity-0"}`}>
          {props.rightPercentage} %
          </div>
        </div>
      </div>
      <Link href={`/${encodeURIComponent(nextQuestion)}`}>
        <div className="bg-slate-50 dark:bg-slate-700 my-2 mx-auto w-64 p-2 rounded-xl text-slate-600 dark:text-slate-300 text-center">
          Next Would You Rather?
        </div>
      </Link>
    </>
  )
  
}

export default Question