"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillTrashFill } from "react-icons/bs";
import { z } from "zod";
import { questions } from "~/utils/fetchInfiniteQuestion";

const updateQuestionPageIdSchema = z.object({
  questionPageId: z.number()
})

type updateQuestionPageIdSchema = z.infer<typeof updateQuestionPageIdSchema>;

function QuestionReview({ leftQuestion, rightQuestion, questionPageId, questionId, password }: { leftQuestion: string, rightQuestion: string, questionPageId: number, questionId: number, password: string }) {

  const [deleted, setDeleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<updateQuestionPageIdSchema>({
    resolver: zodResolver(updateQuestionPageIdSchema),
    defaultValues: {
      questionPageId
    }
  })

  const submit = async (data: updateQuestionPageIdSchema) => {
    // await setQuestionPageId({ id: questionId, questionPageId: data.questionPageId });
    await fetch("api/admin/questions", {
      method: "POST",
      headers: {
        "Authorization": password
      },
      body: JSON.stringify({
        id: questionId,
        questionPageId: data.questionPageId
      })
    })
  }

  const acceptQuestion = async () => {
    const response = await fetch("api/admin/questions/accept", {
      method: "POST",
      headers: {
        "Authorization": password
      },
      body: JSON.stringify({
        id: questionId
      })
    });

    const pageId: { questionPageId: number } = await response.json()

    setValue('questionPageId', pageId.questionPageId);
  }

  const deleteQuestion = async () => {
    await fetch(`api/admin/questions?id=${questionId}`, {
      method: "DELETE",
      headers: {
        "Authorization": password
      }
    })
    setDeleted(true);
  }

  return (
    <div className="rounded-xl m-2 p-1 dark:bg-slate-900 bg-slate-100">
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
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(submit)} className="flex flex-col items-center">
        <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 w-96">
          <label>Question Page Id: </label>
          <input type="text" {...register("questionPageId", { setValueAs: (value: string) => parseInt(value) })} className="text-slate-700" />
        </div>
        {errors.questionPageId && <p className="text-slate-600 dark:text-slate-300">errors.questionPageId.message</p>}
        {deleted ? <p className="text-slate-600 dark:text-slate-300">This question has been deleted</p> : null}
        <div className="flex flex-row items-center gap-4">
          <input type="submit" value="Submit" className="bg-slate-50 dark:bg-slate-700 my-2 p-2 rounded-xl text-slate-600 dark:text-slate-300" />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <div onClick={acceptQuestion} className="bg-slate-50 dark:bg-slate-700 my-2 p-2 rounded-xl text-slate-600 dark:text-slate-300">Accept</div>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <div onClick={deleteQuestion} className="bg-red-500 p-3 rounded-xl w-10 h-10"><BsFillTrashFill color="white" className="mx-auto my-auto" /></div>
        </div>
      </form>
    </div>
  )
}

export default function Admin() {

  // this is not secure but is simple. I just want to prevent people easily accessing and changing website data.
  // change password by changing environment variable easily
  const [password, setPassword] = useState("")

  // DATA SCROLL
  const initialData: questions = []
  const [questionData, setQuestionData] = useState([initialData]);
  const [nextPage, setNextPage] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(true)

  const getMoreData = async () => {

    // getting data
    const questionResponse = await fetch(`api/admin/questions?page=${nextPage}`, {
      headers: {
        "Authorization": password
      }
    })

    if (!questionResponse?.ok) {
      console.log("Wrong password")
      return
    }

    const newQuestionData: { data: questions, hasNextPage: boolean } = await questionResponse.json()

    // update dataas
    const newData = questionData;
    newData.push(newQuestionData.data)
    setQuestionData(newData)

    setNextPage(nextPage + 1)

    if (hasNextPage != newQuestionData.hasNextPage) {
      setHasNextPage(newQuestionData.hasNextPage)
    }
  }

  const questions = questionData?.flatMap((page) => page) ?? [];

  return (
    <>
      <div className="flex flex-row justify-center gap-3">
        <h1 className="text-slate-900 dark:text-white text-center text-xl">Admin password:</h1>
        <form>
          <input
            name="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </form>
      </div>
      {questions.map((question) => {
        return (
          <QuestionReview
            key={question.id}
            leftQuestion={question.leftQuestion}
            rightQuestion={question.rightQuestion}
            questionPageId={question.questionPageId}
            questionId={question.id}
            password={password}
          />
        )
      })}
      {hasNextPage && <div className="bg-slate-50 dark:bg-slate-700 m-2 p-4 rounded-3xl text-slate-600 dark:text-slate-300 text-2xl flex flex-col w-52 text-center" onClick={getMoreData}>Get more questions</div>}
    </>
  )
}