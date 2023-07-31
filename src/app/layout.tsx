import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-material.css"

export const metadata = {
  title:"Nexuss | Admission Matrix"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"overflow-hidden"}>
      <SupabaseProvider>
        <Providers>{children}</Providers>
      </SupabaseProvider>
      </body>
    </html>
  );
}
