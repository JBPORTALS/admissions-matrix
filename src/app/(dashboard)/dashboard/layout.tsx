import AdmissionLayout from "@/components/layouts/AdmissionLayout";

export default function DashboardMainLayout(props: {
  children: React.ReactNode;
}) {
  return <AdmissionLayout>{props?.children}</AdmissionLayout>;
}
