import "./globals.css";
import { Fira_Sans, Inter, Manrope } from "next/font/google";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export const metadata = {
  title: "Nexuss | Admission Matrix",
};

const Fira = Manrope({
  subsets: ["vietnamese"],
  weight: ["200", "300", "400", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"overflow-hidden h-screen"} style={Fira.style}>
        <SupabaseProvider>
          <Providers>{children}</Providers>
        </SupabaseProvider>
      </body>
    </html>
  );
}
