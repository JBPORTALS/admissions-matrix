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
      size={"md"}
      colorPalette={colorPalette}
      value={gender}
      onValueChange={({ value }) => {
        router.push(`/dashboard/hostel/${value}`);
      }}
    >
      <SegmentGroup.Indicator bg={"colorPalette.subtle"} />
      <SegmentGroup.Items
        items={[
          {
            value: "MALE",
            label: (
              <HStack>
                <FaMale />
                Male
              </HStack>
            ),
          },
          {
            value: "FEMALE",
            label: (
              <HStack>
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
