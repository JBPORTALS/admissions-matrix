import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/utils/session";

export async function GET(request: Request) {
  const response = new Response();
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions
  );
  console.log("\n\n\nSession data of GET request", session, "\n\n\n");
  if (!session.id) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  return NextResponse.json(session);
}

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions
  );
  const input = await request.json();

  session.id = input.id;

  await session.save();

  console.log("Session stored", session);

  return response;
}

export async function DELETE(request: Request) {
  const response = new Response();
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions
  );
  session.destroy();
  return response;
}
