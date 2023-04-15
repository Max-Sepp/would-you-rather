import List from "./List";
import NavBar from "./NavBar";

function QuestionNotFound() {
  return (
    <>
      <NavBar />
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-3xl">Question could not be found look at these other questions</h1>
      <List />
    </>
  )
}

export default QuestionNotFound;