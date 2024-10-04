"use client";
import { createContext, useContext, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@/utils/auth";
import { SessionData } from "@/utils/session";

type SupabaseContext = {
  supabase: SupabaseClient<any>;
  user: SessionData | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const user = useUser();

  return (
    <Context.Provider value={{ supabase, user }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
};
