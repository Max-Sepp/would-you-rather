import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";


import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [nextQuestion, setNextQuestion] = useState(1);


  // sets which question to go to
  useEffect(() => {
    const maxNumberQuestions = 5

    setNextQuestion(Math.floor(Math.random() * maxNumberQuestions) + 1);
  },[])

  return (
    <>
      <Head>
        <title>Would you rather?</title>
      </Head>
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-5xl">Would You Rather?</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <Link href={`/${encodeURIComponent(nextQuestion)}`}>
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex items-center justify-center">Try a would you rather?</div>
        </Link>
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
        <Link href={`/${encodeURIComponent(nextQuestion)}`}>
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex items-center justify-center">Try a would you rather?</div>
        </Link>
      </div>
      <h3 className="text-slate-900 dark:text-white text-center p-5 text-2xl">By Max Smith</h3>
    </>
  );
};

export default Home;