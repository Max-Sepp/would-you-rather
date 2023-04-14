import { type NextPage } from "next";
import Dashboard from "~/components/Dashboard";
import NavBar from "~/components/NavBar";

const Admin: NextPage = () => {
  return (
    <>
      <NavBar />
      <Dashboard />
    </>
  )
}

export default Admin;