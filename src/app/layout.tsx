import "./globals.css";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";
import { Provider as ChakraProvider } from "@/components/ui/provider";

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
        <ChakraProvider>
          <Providers>
            <SupabaseProvider>{children}</SupabaseProvider>
          </Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}
