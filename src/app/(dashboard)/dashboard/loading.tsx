"use client";
import { Center, Spinner } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center pb={"36"} h={"100%"} w={"100%"}>
      <Spinner size={"lg"} colorPalette="blue" />
    </Center>
  );
}
