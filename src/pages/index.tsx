import { type NextPage } from "next";
import NextError from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import NavBar from "~/components/NavBar";
import { api } from "~/utils/api";
import { nextQuestion } from "~/utils/nextQuestion";

const Home: NextPage = () => {

  const router = useRouter()

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

  return (
    <>
      <Head>
        <title>Would you rather?</title>
      </Head>
      <NavBar />
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-3xl md:text-5xl">Would You Rather?</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <div onClick={nextPage} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex items-center justify-center flex-none">
          Try a would you rather?
        </div>
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
        <Link href='/suggest'>
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex items-center justify-center flex-none">
            Suggest a would you rather?
          </div>
        </Link>
      </div>
      <h3 className="text-slate-900 dark:text-white text-center p-5 text-2xl">By Max Smith</h3>
    </>
  );
};

export default Home;