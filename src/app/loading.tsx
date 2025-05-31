"use client";
import { Center, Spinner } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center h={"100vh"} w={"100vw"}>
      <Spinner size={"lg"} colorPalette="blue" />
    </Center>
  );
}
