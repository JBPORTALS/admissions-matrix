"use client";
import { useState } from "react";
import { trpc } from "./trpc-cleint";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

function getBaseUrl() {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_URL ?? "";
  return url;
}
export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
