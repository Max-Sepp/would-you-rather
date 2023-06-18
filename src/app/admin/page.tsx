export const runtime = 'edge';

import { db } from "~/db/db";
import Admin from "../../components/Admin";

export default async function Home() {
  return <Admin />
}
