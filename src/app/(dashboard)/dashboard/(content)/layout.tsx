import { Stack } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      py={"4"}
      mx={"auto"}
      px={"4"}
      w={"full"}
      flex={"1"}
      maxW={"7xl"}
      spaceY={"2.5"}
    >
      {children}
    </Stack>
  );
}
