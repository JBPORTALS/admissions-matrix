import React from "react";
import { trpc } from "./trpc-cleint";
import { useRouter } from "next/navigation";
import { SessionData } from "./session";

export function useUser() {
  const utils = trpc.useUtils();
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [user, setUser] = React.useState<SessionData | null>(null);

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
    setUser(user ?? null);
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, []);

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
