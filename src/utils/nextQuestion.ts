/**
 * Finds the next page id by checking what the user has already seen
 * 
 * @param numQuestions 
 * @returns 
 */
export function nextQuestion(numQuestions: number): number {
  let questionsVisited: number[] = []
  if (typeof window !== 'undefined') {
    const sessionQuestions = sessionStorage.getItem('ms-questions-visited');
    if (sessionQuestions != null) {
      questionsVisited = JSON.parse(sessionQuestions) as number[]
    }
  } 
  const nextQuestion = getNextQuestion(numQuestions, questionsVisited, Math.random());
  return nextQuestion;
}

function getNextQuestion(largestNum: number, notAllowedList: number[], randomNum: number): number {
  let nextQuestion = Math.floor(randomNum * (largestNum - notAllowedList.length)) + 1;
  while (notAllowedList.includes(nextQuestion)) {
    nextQuestion += 1;
  }
  return nextQuestion
}


