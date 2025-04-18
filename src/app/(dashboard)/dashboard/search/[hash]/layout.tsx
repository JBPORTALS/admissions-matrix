"use client";
import { HStack, Heading, Tag, VStack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useSearchParams();

  return (
    <VStack h={"full"} w={"full"}>
      <HStack
        px={"5"}
        py={"2"}
        w={"full"}
        className="border-b bg border-b-lightgray"
      >
        <Heading size={"md"} fontWeight={"medium"} color={"gray.600"}>
          Search results for
        </Heading>
        {params.get("type") && (
          <HStack>
            {params.get("type") == "DATE" && (
              <Tag size={"lg"} colorScheme="purple">
                Equiry Date: {params.get("date")}
              </Tag>
            )}
            {params.get("type") == "SOURCE" && (
              <Tag size={"lg"} colorScheme="purple">
                Source: {params.get("source")}
              </Tag>
            )}
            {params.get("type") == "QUERY" && (
              <>
                <Heading size={"sm"}>`{params.get("query")}`</Heading>
              </>
            )}
          </HStack>
        )}
      </HStack>
      <VStack h={"fit-content"} w={"full"}>
        {children}
      </VStack>
    </VStack>
  );
}
