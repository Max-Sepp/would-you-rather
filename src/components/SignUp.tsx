// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { api } from "~/utils/api";
// import SignIn from "./SignIn";

// const loginSchema = z.object({
//   username: z.string(),
//   password: z.string(),
//   confirm: z.string(),
//   createAccountKey: z.string(),
// })
// .refine((data) => data.password === data.confirm, {
//   message: "Passwords don't match",
//   path: ["confirm"], // path of error
// });

// type loginSchema = z.infer<typeof loginSchema>

// const SignUp: React.FC = () => {

//   const [signedUp, setSignedUp] = useState(false)

//   const submitQuestionData = api.users.createUser.useMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<loginSchema>({
//     resolver: zodResolver(loginSchema),
//   });
  
//   const submitQuestion = async (data: loginSchema) => {
//     await submitQuestionData.mutateAsync(data);
//     setSignedUp(true);
//   };

//   if (signedUp) {
//     return <SignIn />
//   }


//   return (
//     <>
//       {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
//       <form onSubmit={handleSubmit(submitQuestion)} className="flex flex-col w-64 mx-auto bg-slate-50 dark:bg-slate-700 m-2 p-2 rounded-xl text-slate-600 dark:text-slate-300">
//         <h1 className="text-2xl text-center">Sign Up</h1>
//         <label className="text-lg">Username:</label>
//         <input type="text" {...register("username")} className="text-slate-700 rounded-xl" />
//         { errors.username && <span>{errors.username.message}</span>}
//         <label className="text-lg">Password:</label>
//         <input type="password" {...register("password")} className="text-slate-700 rounded-xl" />
//         { errors.password && <span>{errors.password.message}</span>}
//         <label className="text-lg">Confirm Password:</label>
//         <input type="password" {...register("confirm")} className="text-slate-700 rounded-xl" />
//         { errors.confirm && <span>{errors.confirm.message}</span>}
//         <label className="text-lg">Create Account Key:</label>
//         <input type="text" {...register("createAccountKey")} className="text-slate-700 rounded-xl" />
//         { errors.createAccountKey && <span>{errors.createAccountKey.message}</span>}
//         <input type="submit" className="hover:bg-slate-100 hover:dark:bg-slate-600 my-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 text-center"/>
//       </form>
//     </>
//   )
// }

// export default SignUp;

export { };
