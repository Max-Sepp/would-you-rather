import Link from "next/link";
import React from "react";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-slate-50 dark:bg-slate-700 flex flex-row m-2 p-1 rounded-xl justify-center max-w-5xl mx-auto">
      <Link href={"/"} className="m-1 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white hover:dark:bg-slate-800">
        <h1>Home</h1>
      </Link>
      <Link href={"/list"} className="m-1 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white hover:dark:bg-slate-800">
        <h1>List of Questions</h1>
      </Link>
      <Link href={"/suggest"} className="m-1 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white hover:dark:bg-slate-800">
        <h1>Suggest</h1>
      </Link>
    </nav>
  )
}

export default NavBar