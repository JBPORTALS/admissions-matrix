"use client";
import { Center, Spinner } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center pb={"36"} h={"100vh"} w={"100vw"}>
      <Spinner size={"lg"} colorPalette="blue" />
    </Center>
  );
}
