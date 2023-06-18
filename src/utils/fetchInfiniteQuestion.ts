"use client";

import { useState } from "react";

export type questions = {
  leftQuestion: string;
  rightQuestion: string;
  questionPageId: number;
  questionId: number;
  leftChosen: number;
  totalChosen: number;
  createdAt: Date;
}[]

export function useFetchInfiniteQuestion(initialData: questions) {
  const [isFetching, setIsFetching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [data, setData] = useState([initialData]);
  const [nextPage, setNextPage] = useState(1);

  const fetchNextPage = async () => {

    setIsFetching(true)

    const page = await fetchPage(nextPage)

    setNextPage(nextPage + 1);

    // update data
    const newData = data;
    newData.push(page.data)
    setData(newData)

    setHasNextPage(page.hasNextPage)
    setIsFetching(false)
  }

  return { isFetching, hasNextPage, data, fetchNextPage }
}

export async function fetchPage(page: number) {
  const data = await fetch(`api/questions?page=${page}`)

  const pageData: { data: questions, hasNextPage: boolean } = await data.json()

  return pageData
}