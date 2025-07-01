"use client";
import { store } from "@/store";
import TRPCProvider from "@/utils/trpc-provider";
import { Toaster } from "@/components/ui/toaster";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { EnquiryStoreProvider } from "@/providers/enquiry-store-provider";
import { SessionProvider } from "@/utils/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <TRPCProvider>
        <SessionProvider>
          <EnquiryStoreProvider>
            <ChakraProvider>
              {children}
              <Toaster />
            </ChakraProvider>
          </EnquiryStoreProvider>
        </SessionProvider>
      </TRPCProvider>
    </ReduxProvider>
  );
}
