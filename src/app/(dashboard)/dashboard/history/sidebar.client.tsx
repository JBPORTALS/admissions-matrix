"use client";

import { useUser } from "@/utils/auth";
import { collegesOptions } from "@/utils/constants";
import { Button, Text, VStack } from "@chakra-ui/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

export function SidebarClient() {
  const user = useUser();
  const [college, setCollege] = useQueryState(
    "col",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      clearOnDefault: false,
      shallow: true,
    })
  );

  // Ensure the default value is set in the URL on first load if it's missing
  useEffect(() => {
    if (!college[0]) setCollege([collegesOptions.firstValue ?? ""]);
  }, [setCollege]);

  return (
    <VStack
      h={"svh"}
      flexShrink={"0"}
      w={"3xs"}
      maxW={"3xs"}
      bg={"bg.subtle"}
      borderRightColor={"border"}
      borderRightWidth={"thin"}
      position={"sticky"}
      inset={"0"}
      marginTop={"-16"}
      paddingTop={"16"}
      px={"4"}
      display={
        user?.isLoaded && ["MANAGEMENT", "KSPT"].includes(user?.college ?? "")
          ? "flex"
          : "none"
      }
    >
      <VStack alignItems={"start"} w={"full"} py={"4"}>
        <Text fontSize={"xs"} color={"fg.muted"}>
          College
        </Text>

        {collegesOptions.items.map((item) => (
          <Button
            w={"full"}
            justifyContent={"start"}
            variant={item.value === college.at(0) ? "subtle" : "ghost"}
            colorPalette={item.value === college.at(0) ? "blue" : "gray"}
            size={"xs"}
            onClick={() => setCollege([item.value])}
            key={item.value}
          >
            {item.value}
          </Button>
        ))}
      </VStack>
    </VStack>
  );
}
