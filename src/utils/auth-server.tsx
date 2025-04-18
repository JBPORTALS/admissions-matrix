"use server";

import { getIronSession } from "iron-session";
import { api } from "./trpc-server";
import { SessionData, sessionOptions } from "./session";
import { cookies } from "next/headers";

export async function auth() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  console.log("session get", session);

  if (!session.id) return { isLoggedIn: false, user: null };
  const user = await api.getUser(session.id ?? "");
  return {
    isLoggedIn: !!user?.id,
    user,
  };
}
