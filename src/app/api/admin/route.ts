export const runtime = 'edge';

import { NextResponse } from "next/server";
import { env } from "~/env.mjs";

export async function POST(req: Request) {
  if (req.headers.get("Authorization") == env.ADMIN_KEY) {
    return NextResponse.json(true, {status: 200})
  }

  return NextResponse.json(false, {status: 401})
}