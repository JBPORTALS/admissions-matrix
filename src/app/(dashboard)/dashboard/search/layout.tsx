"use client"
import { HStack, Heading, VStack } from "@chakra-ui/react";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VStack h={"full"} w={"full"}>
    <HStack px={"5"} py={"2"} w={"full"} className="border-b border-b-lightgray">
        <Heading size={"lg"} color={"gray.600"}>Search results for</Heading>
    </HStack>
    {children}
    </VStack>;
}

