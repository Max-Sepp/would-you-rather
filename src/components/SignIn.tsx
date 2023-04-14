import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";


const SignIn: React.FC = () => {

  const [validKey, setValidKey] = useState(true);

  const checkKey = api.Auth.checkSignUpKey.useMutation().mutateAsync;
  
  const { data: sessionData } = useSession();

  if (sessionData) {
    return (
      <button
          className="bg-slate-50 dark:bg-slate-700 m-2 p-4 rounded-3xl text-slate-600 dark:text-slate-300 text-2xl"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
    )
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      key: { value: string };
    };
    const key = target.key.value;

    const {correct} = await checkKey({key})

    if (correct){
      await signIn()
    } else (
      setValidKey(false)
    )
  }

  return (
    <form 
      onSubmit={(e: React.SyntheticEvent) => void handleSubmit(e)}
      className="bg-slate-50 dark:bg-slate-700 m-2 p-4 rounded-3xl text-slate-600 dark:text-slate-300 text-2xl flex flex-col w-52 text-center"
    >
      <label>
        Sign up key:
      </label>
      <input 
        type="text" 
        name="key" 
        className="text-slate-800"
      />
      {validKey ? null : <span className="text-xl">Invalid Key</span>}
      <input 
        type="submit" 
        value="Sign In" 
        className="p-2 m-1 hover:bg-slate-100 hover:dark:bg-slate-600 rounded-xl"
      />
    </form>
  )
}

export default SignIn;