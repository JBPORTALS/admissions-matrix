"use client";

import { genderSearchParams } from "@/utils/searchParms";
import { HStack, SegmentGroup } from "@chakra-ui/react";
import { useQueryStates } from "nuqs";
import { FaFemale, FaMale } from "react-icons/fa";

export function GenderSegmentControl() {
  const [{ gender }, setGender] = useQueryStates(genderSearchParams);

  // Dynamically switch color palette based on gender
  const colorPalette = gender === "MALE" ? "blue" : "pink";

  return (
    <SegmentGroup.Root
      size={"lg"}
      colorPalette={colorPalette}
      value={gender}
      onValueChange={({ value }) =>
        setGender({ gender: value as "MALE" | "FEMALE" })
      }
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
