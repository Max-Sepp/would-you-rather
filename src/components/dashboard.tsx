import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";

const updateQuestionPageIdSchema = z.object({
  questionPageId: z.number()
})

type updateQuestionPageIdSchema = z.infer<typeof updateQuestionPageIdSchema>;

function QuestionReview({leftQuestion, rightQuestion, questionPageId, questionId}: {leftQuestion: string, rightQuestion: string, questionPageId: number, questionId: string}) {

  const setQuestionPageId = api.questions.setQuestionPageId.useMutation().mutateAsync;
  const accept = api.questions.acceptQuestion.useMutation().mutateAsync;

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
        {errors.questionPageId && <p>errors.questionPageId.message</p>}
        <div className="flex flex-row">
          <input type="submit" className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300" />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <div onClick={acceptQuestion} className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300">Accept</div>
        </div>
      </form>
    </div>
  )
}

/**
 *  useScrollPosition that gives a number from 0 to 1 of the position of the view window
 */
function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const refreshScrollPosition = () => {
    const screen = document.documentElement;
    const scroll = screen.scrollTop / (screen.scrollHeight - screen.clientHeight)
    setScrollPosition(scroll)
  }

  useEffect(() => {
    window.addEventListener("scroll", refreshScrollPosition, {passive: true});

    return () => {
      window.removeEventListener("scroll", refreshScrollPosition);
    }
  }, []);

  return scrollPosition;
}

const Dashboard: React.FC = () => {

  const scrollPosition = useScrollPosition();

  const {data, hasNextPage, fetchNextPage, isFetching} = api.questions.list.useInfiniteQuery(
    {
      limit: 5,
      where: {
        unacceptedQuestions: false
      }
    },
    {
      getNextPageParam: (prevPage) => prevPage.nextCursor,
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

