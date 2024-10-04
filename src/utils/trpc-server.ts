import { createCaller } from "@/server";
import { headers } from "next/headers";
import { cache } from "react";

const createContext = cache(async () => {
  const headersList = headers();
  const heads = new Headers(headersList);
  heads.set("x-trpc-source", "rsc");
});
export const api = createCaller(createContext);
