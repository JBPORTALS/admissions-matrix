"use client";
import { store } from "@/store";
import TRPCProvider from "@/utils/trpc-provider";
import { Toaster } from "react-hot-toast";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "@/components/ui/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ReduxProvider store={store}>
        <ChakraProvider>{children}</ChakraProvider>
      </ReduxProvider>
      <Toaster />
    </TRPCProvider>
  );
}
