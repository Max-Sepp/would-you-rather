export const runtime = 'edge';
export const preferredRegion = 'dub1';

import { db } from "~/db/db";
import Admin from "../../components/Admin";

export default async function Home() {
  return <Admin />
}
