"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { get } from "http";

type SupabaseContext = {
  supabase: SupabaseClient<any>;
  user: {
    email: string | undefined;
    username: string | undefined;
    last_login_at: string | undefined;
    session: AuthSession | null;
  } | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [user, setUser] = useState<{
    username: undefined | string;
    email: string | undefined;
    session: AuthSession | null;
    last_login_at:string|undefined
  } | null>(null);
  const router = useRouter();

  async function getUserData() {
    const { data } = await supabase.auth.getSession();
    const { data: User } = await supabase
      .from("profiles")
      .select("username,last_login_at")
      .eq("id", data.session?.user.id)
      .single();
    setUser({
      username: User?.username,
      email: data.session?.user.email,
      last_login_at:User?.last_login_at,
      session: data.session,
    });
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
      getUserData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);// eslint-disable-line

  useEffect(() => {
    getUserData();
  }, [router, supabase]);

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
