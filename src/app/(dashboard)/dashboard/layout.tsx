"use client";
import AdmissionLayout from "@/components/layouts/AdmissionLayout";

export default async function DashboardMainLayout(props: {
  children: React.ReactNode;
}) {
  return <AdmissionLayout>{props?.children}</AdmissionLayout>;
}
