"use client";
import { Skeleton,  VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <VStack
      justifyContent={"start"}
      alignItems={"start"}
      h={"full"}
      spacing={0.5}
      w={"100vw"}
    >
      <Skeleton w={"100%"} h={"12"} mb={"2"}/>
      {new Array(9).fill(0).map((value, index) => {
        return <Skeleton w={"100%"} h={"12"} key={index} />;
      })}
    </VStack>
  );
}
