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
export const ACADYEARS = [{ value: "2025", option: "2025-26" }];
