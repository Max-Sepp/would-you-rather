export const config = {
  runtime: 'edge', 
  regions: ['dub1'], 
};

import { NextResponse } from "next/server";
import { env } from "~/env.mjs";

/**
 *  Function to check if user has the admin key
 *
 */
export async function POST(req: Request) {
  if (req.headers.get("Authorization") == env.ADMIN_KEY) {
    return NextResponse.json(true, {status: 200})
  }

  return NextResponse.json(false, {status: 401})
}