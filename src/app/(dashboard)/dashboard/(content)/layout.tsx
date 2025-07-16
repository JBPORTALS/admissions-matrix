import { Stack } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Stack py={"4"} mx={"auto"} px={"6"} w={"full"} flex={"1"} spaceY={"2.5"}>
      {children}
    </Stack>
  );
}
