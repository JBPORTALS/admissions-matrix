import { createListCollection } from "@chakra-ui/react";

export const COLLEGES = () => {
  if (process.env.NEXT_PUBLIC_IS_CLONE)
    return [{ value: "SSPT", label: "SSPT" }];
  return [
    { value: "KSIT", label: "KSIT" },
    { value: "KSPT", label: "KSPT" },
    { value: "KSPU", label: "KSPU" },
    { value: "KSDC", label: "KSDC" },
    { value: "KSSEM", label: "KSSEM" },
  ];
};
export const ACADYEARS = createListCollection({
  items: [{ value: "2025", label: "2025-26" }],
});

export const collegesOptions = createListCollection({
  items: [
    { value: "KSIT", label: "KSIT" },
    { value: "KSPT", label: "KSPT" },
    { value: "KSPU", label: "KSPU" },
    { value: "KSDC", label: "KSDC" },
    { value: "KSSEM", label: "KSSEM" },
  ],
});

export const examsOptions = createListCollection({
  items: [
    {
      label: "CET",
      value: "CET",
    },
    {
      label: "COMEDK",
      value: "COMEDK",
    },
    {
      label: "CET AND COMEDK",
      value: "CET AND COMEDK",
    },
    {
      label: "DCET",
      value: "DCET",
    },
    {
      label: "JEE (M)",
      value: "JEE (M)",
    },
    {
      label: "NATA",
      value: "NATA",
    },
    {
      label: "OTHERS",
      value: "OTHERS",
    },
    {
      label: "NONE",
      value: "NONE",
    },
  ],
});

export const hostelOptions = createListCollection({
  items: [
    { value: "YES", label: "Yes" },
    { value: "NO", label: "No" },
  ],
});

export const genderOptions = createListCollection({
  items: [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ],
});

export const boardOptions = createListCollection({
  items: [
    {
      label: "SSLC OR 10th",
      value: "SSLC",
    },
    {
      label: "PUC",
      value: "PUC",
    },
    {
      label: "CBSE",
      value: "CBSE",
    },
    {
      label: "ICSE",
      value: "ICSE",
    },
    {
      label: "OTHERS",
      value: "OTHERS",
    },
  ],
});

export const courseOptions = createListCollection({
  items: [
    {
      label: "PU",
      value: "PU",
    },
    {
      label: "DIPLOMA",
      value: "DIPLOMA",
    },
    {
      label: "MBA",
      value: "MBA",
    },
    {
      label: "MTECH",
      value: "MTECH",
    },
    {
      label: "DEGREE",
      value: "DEGREE",
    },
    {
      label: "ENGINEERING",
      value: "ENGINEERING",
    },
  ],
});

export const sourceOptions = createListCollection({
  items: [
    {
      label: "MANAGEMENT",
      value: "MANAGEMENT",
    },
    {
      label: "COLLEGE WEBSITE",
      value: "COLLEGE WEBSITE",
    },
    {
      label: "STUDENT REFERENCE",
      value: "STUDENT REFERENCE",
    },
    {
      label: "PARENT/RELATIVE REFERENCE",
      value: "PARENT/RELATIVE REFERENCE",
    },
    {
      label: "FACULTY REFERENCE",
      value: "FACULTY REFERENCE",
    },
    {
      label: "NEWS PAPER AD",
      value: "NEWS PAPER AD",
    },
    {
      label: "TV OR RADIO AD",
      value: "TV OR RADIO AD",
    },
    {
      label: "METRO BRANDING",
      value: "METRO BRANDING",
    },
    {
      label: "BUS BRANDING",
      value: "BUS BRANDING",
    },
    {
      label: "EDUCATION FAIR",
      value: "EDUCATION FAIR",
    },
    {
      label: "PHONE OR SMS OR WHATSAPP",
      value: "PHONE OR SMS OR WHATSAPP",
    },
    {
      label: "SOCAIL MEDIA",
      value: "SOCAIL MEDIA",
    },
    {
      label: "OTHERS",
      value: "OTHERS",
    },
  ],
});
