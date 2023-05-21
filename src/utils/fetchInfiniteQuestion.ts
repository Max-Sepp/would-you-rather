"use client";

import { useState } from "react";

export type questions = {
  leftQuestion: string;
  rightQuestion: string;
  questionPageId: number;
  id: number;
  leftChosen: number;
  totalChosen: number;
  createdAt: Date;
}[]

export function useFetchInfiniteQuestion(initialData: questions) {
  const [isFetching, setIsFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(false);
  const [data, setData] = useState([initialData]);

  let nextPage = 1;

  const fetchNextPage = async () => {

    setIsFetching(true)

    const page = await fetchPage(nextPage)

    nextPage += 1

    // update data
    const newData = data;
    newData.push(page.data)
    setData(newData)


    setIsFetching(false)
  }

  return {isFetching, hasNextPage, data, fetchNextPage}
}

export async function fetchPage (page: number) {
  const data = await fetch(`api/questions?page=${page}`)

  const pageData: {data: questions, hasNextPage: boolean} = await data.json()

  return pageData
}