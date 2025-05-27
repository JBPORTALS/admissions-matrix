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
