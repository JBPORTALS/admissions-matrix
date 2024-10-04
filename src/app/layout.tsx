import "./globals.css";
import { Manrope } from "next/font/google";
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
      <Providers>
        <body
          className={"overflow-x-hidden overflow-y-auto h-screen"}
          style={Fira.style}
        >
          <SupabaseProvider>{children}</SupabaseProvider>
        </body>
      </Providers>
    </html>
  );
}
