import "./globals.css";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata = {
  title: "Nexuss | Admission Matrix",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NuqsAdapter>
          <Providers>
            <SupabaseProvider>{children}</SupabaseProvider>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
