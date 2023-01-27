import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react"
import { prisma } from "../services/prisma";

export async function getStaticProps(context: any) {
  const Id: number = parseInt(context.params.id);

  const question: any = await prisma.question.findUnique({
    where: {
      id: Id
    }
  });

  if (question == null) {
      return {
          notFound: true
      }
  }

  const leftPercentage = Math.round((question.leftChosen / question.totalChosen) * 100 )
  const rightPercentage =  100 - leftPercentage

  return {
    props: {
        leftOption: question.leftQuestion,
        rightOption: question.rightQuestion,
        leftPercentage,
        rightPercentage,
        currentQuestion: Id
    },
    revalidate: 1200,
  }
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

function Home(props: { leftOption: string, rightOption: string, leftPercentage: number, rightPercentage: number, currentQuestion: number }) {
  const [nextQuestion, setNextQuestion] = useState(1);
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    const maxNumberQuestions: number = 5
    let output: number = Math.floor(Math.random() * maxNumberQuestions) + 1

    while (output == props.currentQuestion) {
      output = Math.floor(Math.random() * maxNumberQuestions) + 1
    }

    setNextQuestion(output);
    setAnswered(false)
  }, [props.currentQuestion])

  async function submitLeftOption(e: any) {
    e.preventDefault();
    if (!answered) {
      setAnswered(true);
      const response = await fetch("/api/updatepoll", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "leftClicked": true,
          "id": props.currentQuestion
        })
      })
      const data = await response.json()
    }
  }

  async function submitRightOption(e: any) {
    e.preventDefault();
    if (!answered){
      setAnswered(true);
      const response = await fetch("/api/updatepoll", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "leftClicked": false,
          "id": props.currentQuestion
        })
      })
      const data = await response.json()
    }
  }

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
          <div className={answered ? "" : "hidden"}>
          {props.leftPercentage} %
          </div>
        </div>
        <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
        <div onClick={submitRightOption} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-xl">
          {props.rightOption}
          </div>
          <div className={answered ? "duration-700" : "hidden"}>
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

export default Home