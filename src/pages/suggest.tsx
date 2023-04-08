import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";

const questionSchema = z.object({
  leftQuestion: z.string().max(190),
  rightQuestion: z.string().max(190)
});

type questionSchema = z.infer<typeof questionSchema>;

const Suggest: NextPage = () => {

  const submitQuestionData = api.questions.createQuestion.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<questionSchema>({
    resolver: zodResolver(questionSchema),
  });
  
  const submitQuestion = async (data: questionSchema) => {
    await submitQuestionData.mutateAsync(data)
    reset({leftQuestion: "", rightQuestion: ""})
  };

  return (
    <>
      <Head>
        <title>Would you rather?</title>
      </Head>
      
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(submitQuestion)}>
        <div className="flex flex-col items-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-5">
            <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex flex-col items-center justify-center">
              <label className="text-bold text-2xl p-5">First option: </label>
              <textarea {...register("leftQuestion")} className="rounded-xl w-72 h-44 text-slate-800"/>
              {
                !errors.leftQuestion ? null :
                errors.leftQuestion.type == "too_big" ? <span>Your question is too long. Just shorten to 190 characters</span>
                : null
              }
            </div>
            <div className="text-bold uppercase text-slate-900 dark:text-white my-auto text-3xl">OR</div>
            <div className="bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 h-96 w-96 text-center flex flex-col items-center justify-center">
              <label className="text-bold text-2xl p-5">Second option: </label>
              <textarea {...register("rightQuestion")} className="rounded-xl w-72 h-44 text-slate-800" />
              {
                !errors.rightQuestion ? null :
                errors.rightQuestion.type == "too_big" ? <span>Your question is too long. Just shorten to 190 characters</span>
                : null
              }
            </div>
          </div>
          <input type="submit" className="bg-slate-50 dark:bg-slate-700 my-2 w-64 p-2 rounded-xl text-slate-600 dark:text-slate-300 text-center" />
        </div>
      </form>
    </>
  );
};

export default Suggest;