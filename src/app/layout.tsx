import "./globals.css";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";

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
        <Providers>
          <SupabaseProvider>{children}</SupabaseProvider>
        </Providers>
      </body>
    </html>
  );
}
