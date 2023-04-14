/**
 * Finds the next page id by checking what the user has already seen
 * 
 * @param numQuestions 
 * @returns 
 */
export function nextQuestion(numQuestions: number): number {
  const sessionQuestions = sessionStorage.getItem('ms-questions-visited');
  let questionsVisited: number[] = []
  if (sessionQuestions != null) {
    questionsVisited = JSON.parse(sessionQuestions) as number[]
  }
  let nextQuestion = Math.floor(Math.random() * (numQuestions - questionsVisited.length)) + 1;
  while (nextQuestion in questionsVisited) {
    nextQuestion += 1;
  }
  questionsVisited.push(nextQuestion);
  sessionStorage.setItem('ms-questions-visited', JSON.stringify(questionsVisited));
  return nextQuestion;
}
