"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";

type SupabaseContext = {
  supabase: SupabaseClient<any>;
  user: {
    email: string | undefined;
    username: string | undefined;
    last_login_at: string | undefined;
    session: AuthSession | null;
    college: string | undefined;
    can_edit: boolean;
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
    last_login_at: string | undefined;
    college: string | undefined;
    can_edit: boolean;
  } | null>(null);
  const router = useRouter();

  async function getUserData() {
    const { data } = await supabase.auth.getSession();
    const { data: User } = await supabase
      .from("profiles")
      .select("username,last_login_at,college,can_edit")
      .eq("id", data.session?.user.id)
      .single();
    setUser({
      username: User?.username,
      email: data.session?.user.email,
      last_login_at: User?.last_login_at,
      college: User?.college,
      session: data.session,
      can_edit: User?.can_edit,
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
  }, [router, supabase]); // eslint-disable-line

  useEffect(() => {
    getUserData();
  }, [router, supabase]); // eslint-disable-line

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
