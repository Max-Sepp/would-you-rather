import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillTrashFill } from "react-icons/bs";
import { z } from "zod";
import { api } from "~/utils/api";
import { useScrollPosition } from "~/utils/useScrollPosition";
import SignIn from "./SignIn";

const updateQuestionPageIdSchema = z.object({
  questionPageId: z.number()
})

type updateQuestionPageIdSchema = z.infer<typeof updateQuestionPageIdSchema>;

function QuestionReview({leftQuestion, rightQuestion, questionPageId, questionId}: {leftQuestion: string, rightQuestion: string, questionPageId: number, questionId: string}) {

  const setQuestionPageId = api.questions.setQuestionPageId.useMutation().mutateAsync;
  const accept = api.questions.acceptQuestion.useMutation().mutateAsync;
  const deleteQuestionMutation = api.questions.deleteQuestion.useMutation().mutateAsync;

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

  const submit = async (data : updateQuestionPageIdSchema) => {
    await setQuestionPageId({id: questionId, questionPageId: data.questionPageId});
  }

  const acceptQuestion = async () => {
    const pageId = await accept({id: questionId});
    setValue('questionPageId', pageId.questionPageId);
  }

  const deleteQuestion = async () => {
    await deleteQuestionMutation({
      id: questionId
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
          <input type="text" {...register("questionPageId", {setValueAs: (value: string) => parseInt(value)})} className="text-slate-700" />
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

const Dashboard: React.FC = () => {

  const scrollPosition = useScrollPosition();

  const { data: sessionData } = useSession();

  const {data, hasNextPage, fetchNextPage, isFetching} = api.questions.listUnaccepted.useInfiniteQuery(
    {
      limit: 5,
      where: {
        unacceptedQuestions: false
      }
    },
    {
      getNextPageParam: (prevPage) => prevPage.nextCursor,
      enabled: sessionData?.user !== undefined
    }
  )

  useEffect(() => {
    if (scrollPosition > 0.9 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  const questions = data?.pages.flatMap((page) => page.questions) ?? [];

  return (
    <div>
      <SignIn />
      {questions.map((question) => {
         return (
          <QuestionReview 
            key={question.id}
            leftQuestion={question.leftQuestion}
            rightQuestion={question.rightQuestion}
            questionPageId={question.questionPageId}
            questionId={question.id}
          />
         )
      })}
    </div>
  )
}

export default Dashboard;

