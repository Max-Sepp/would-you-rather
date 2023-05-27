"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const questionSchema = z.object({
  leftQuestion: z.string().max(190),
  rightQuestion: z.string().max(190)
});

type questionSchema = z.infer<typeof questionSchema>;

export default function SuggestForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<questionSchema>({
    resolver: zodResolver(questionSchema),
  });

  const submitQuestion = async (data: questionSchema) => {

    await fetch("/api/questions/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    reset({ leftQuestion: "", rightQuestion: "" })
  };

  return (
    <form onSubmit={handleSubmit(submitQuestion)}>
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex flex-col items-center justify-center">
            <label className="text-bold text-2xl p-5">First option: </label>
            <textarea {...register("leftQuestion")} className="rounded-xl w-64 lg:w-72 h-44 text-slate-800 p-2" />
            {
              !errors.leftQuestion ? null :
                errors.leftQuestion.type == "too_big" ? <span>Your question is too long. Just shorten to 190 characters</span>
                  : null
            }
          </div>
          <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
          <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-44 md:h-96 w-72 lg:w-96 text-center flex flex-col items-center justify-center">
            <label className="text-bold text-2xl p-5">Second option: </label>
            <textarea {...register("rightQuestion")} className="rounded-xl w-64 lg:w-72 h-44 text-slate-800 p-2" />
            {
              !errors.rightQuestion ? null :
                errors.rightQuestion.type == "too_big" ? <span>Your question is too long. Just shorten to 190 characters</span>
                  : null
            }
          </div>
        </div>
        <input type="submit" value="Submit" className="bg-slate-50 dark:bg-slate-700 my-2 w-64 p-2 rounded-xl text-slate-600 dark:text-slate-300 text-center" />
      </div>
    </form>
  )
}