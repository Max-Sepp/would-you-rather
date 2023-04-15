import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import List from "~/components/List";
import NavBar from "~/components/NavBar";

const list: NextPage = () => {

  return (
    <>
      <Head>
        <title>Would you rather?</title>
      </Head>
      <NavBar />
      <List />
    </>
  )
}

export default list;