import { createListCollection } from "@chakra-ui/react";

export const COLLEGES = () => {
  if (process.env.NEXT_PUBLIC_IS_CLONE)
    return [{ value: "SSPT", option: "SSPT" }];
  return [
    { value: "KSIT", option: "KSIT" },
    { value: "KSPT", option: "KSPT" },
    { value: "KSPU", option: "KSPU" },
    { value: "KSDC", option: "KSDC" },
    { value: "KSSEM", option: "KSSEM" },
  ];
};
export const ACADYEARS = createListCollection({
  items: [{ value: "2025", label: "2025-26" }],
});
