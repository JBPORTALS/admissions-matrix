"use client";

import { HStack, SegmentGroup } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaFemale, FaMale } from "react-icons/fa";

export function GenderSegmentControl() {
  const { gender } = useParams<{ gender: "MALE" | "FEMALE" }>();
  const router = useRouter();

  // Dynamically switch color palette based on gender
  const colorPalette = gender === "MALE" ? "blue" : "pink";

  return (
    <SegmentGroup.Root
      size={"lg"}
      colorPalette={colorPalette}
      value={gender}
      onValueChange={({ value }) => {
        router.push(`/dashboard/hostel/${value}`);
      }}
    >
      <SegmentGroup.Indicator bg={"colorPalette.solid"} />
      <SegmentGroup.Items
        items={[
          {
            value: "MALE",
            label: (
              <HStack color={gender === "MALE" ? "white" : undefined}>
                <FaMale />
                Male
              </HStack>
            ),
          },
          {
            value: "FEMALE",
            label: (
              <HStack color={gender === "FEMALE" ? "white" : undefined}>
                <FaFemale />
                Female
              </HStack>
            ),
          },
        ]}
      />
    </SegmentGroup.Root>
  );
}
