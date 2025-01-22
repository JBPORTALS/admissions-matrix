export const COLLEGES = () => {
  if (process.env.NEXT_PUBLIC_IS_CLONE)
    return [{ value: "SSPT", option: "SSPT" }];
  return [
    { value: "KSIT", option: "KSIT" },
    { value: "KSPT", option: "KSPT" },
    { value: "KSPU", option: "KSPU" },
    { value: "KSSA", option: "KSSA" },
    { value: "KSSEM", option: "KSSEM" },
  ];
};
export const ACADYEARS = [
  { value: "2024", option: "2024-25" },
  { value: "2023", option: "2023-24" },
];
