"use client"
import AdmissionLayout from "@/components/layouts/AdmissionLayout";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdmissionLayout>{children}</AdmissionLayout>;
}

