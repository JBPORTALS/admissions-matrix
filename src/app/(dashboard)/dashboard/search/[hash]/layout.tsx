"use client";
import { HStack, Heading, Tag, VStack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";

export default async function DashboardLayout({
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
        <Heading size={"lg"} color={"gray.600"}>
          Search results for
        </Heading>
        {params.get("type") && (
          <HStack>
            {params.get("type") == "DATE" && (
              <Tag size={"lg"} colorScheme="purple">
                date: {params.get("date")}
              </Tag>
            )}
            {params.get("type") == "SOURCE" && (
              <Tag size={"lg"} colorScheme="purple">
                Source: {params.get("source")}
              </Tag>
            )}
          </HStack>
        )}
      </HStack>
      {children}
    </VStack>
  );
}
