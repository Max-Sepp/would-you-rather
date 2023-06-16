import { db } from "~/db/db";
import Admin from "../../components/Admin";

export const revalidate = 600;

export default async function Home() {
  return <Admin />
}
