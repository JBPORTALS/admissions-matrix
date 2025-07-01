import React from "react";
import { trpc } from "./trpc-cleint";
import { useRouter } from "next/navigation";
import { SessionData } from "./session";

type SessionContextType = {
  isLoaded: boolean;
  user: SessionData | null;
};

const SessionContext = React.createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const utils = trpc.useUtils();
  const [isLoaded, setIsLoaded] = React.useState(false);
  /** Memoize the session data */
  const [session, setSession] = React.useState<SessionData | null>(null);

  const fetchUser = React.useCallback(async () => {
    setIsLoaded(false);
    // Fetch session
    const sessionResponse = await fetch(`/api/session`, {
      credentials: "include",
    });

    if (!sessionResponse.ok) {
      throw new Error(`Session fetch failed: ${sessionResponse.statusText}`);
    }

    const sessionData = await sessionResponse.json();

    if (!sessionData || !sessionData.id) {
      throw new Error("Invalid session data");
    }

    const user = await utils.getUser.fetch(sessionData.id);
    setSession(user ?? null);
    setIsLoaded(true);
  }, []);

  /** Fetch the session data */
  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SessionContext.Provider value={{ isLoaded, user: session ?? null }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useUser() {
  const session = React.useContext(SessionContext);

  if (!session) {
    throw new Error("useUser must be used within a SessionProvider");
  }
  const { isLoaded, user } = session;

  return {
    isLoaded,
    ...user,
  };
}

export function useSignIn() {
  const [userId, setUserId] = React.useState(undefined);
  const user = trpc.getUser.useQuery(userId ?? "", { enabled: !!userId });
  const router = useRouter();
  const { mutateAsync } = trpc.signIn.useMutation({
    async onSuccess(data) {
      await fetch("/api/session", {
        body: JSON.stringify({ id: data.id }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const setUser = React.useCallback(async () => {
    // Fetch session
    const sessionResponse = await fetch(`/api/session`, {
      credentials: "include",
    });

    if (!sessionResponse.ok) {
      throw new Error(`Session fetch failed: ${sessionResponse.statusText}`);
    }

    const sessionData = await sessionResponse.json();

    console.log("Session Data", sessionData);

    setUserId(sessionData.id);
  }, []);

  const signOut = React.useCallback(async () => {
    // Fetch session
    await fetch(`/api/session`, {
      credentials: "include",
      method: "DELETE",
    });

    router.refresh();
  }, []);

  React.useEffect(() => {
    setUser();
  }, [user.data?.id]);

  return {
    isLoggedIn: !!user.data,
    signIn: mutateAsync,
    signOut,
  };
}
