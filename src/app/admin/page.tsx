export const config = {
  runtime: 'edge',
  regions: ['dub1'],
};

import { db } from "~/db/db";
import Admin from "../../components/Admin";

export default async function Home() {
  return <Admin />
}
