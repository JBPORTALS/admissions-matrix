"use client";
import { store } from "@/store";
import TRPCProvider from "@/utils/trpc-provider";
import { Toaster } from "react-hot-toast";
import { Provider as ReduxProvider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ReduxProvider store={store}>
        <Toaster />
        {children}
      </ReduxProvider>
    </TRPCProvider>
  );
}
