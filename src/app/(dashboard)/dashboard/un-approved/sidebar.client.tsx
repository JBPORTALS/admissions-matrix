"use client";

import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchBranchList } from "@/store/admissions.slice";
import { collegesOptions } from "@/utils/constants";
import { Button, Skeleton, Text, VStack } from "@chakra-ui/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useCallback, useEffect } from "react";

export function SidebarClient() {
  const [college, setCollege] = useQueryState(
    "col",
    parseAsArrayOf(parseAsString)
      .withDefault([collegesOptions.at(0)?.value ?? ""])
      .withOptions({ clearOnDefault: false, shallow: true })
  );

  const [branch, setBranch] = useQueryState(
    "br",
    parseAsArrayOf(parseAsString)
      .withDefault([collegesOptions.at(0)?.value ?? ""])
      .withOptions({ clearOnDefault: false, shallow: true })
  );

  const dispatch = useAppDispatch();
  const branches = useAppSelector(
    (state) => state.admissions.branchlist.data as { value: string }[]
  );
  const isBranchesLoading = useAppSelector(
    (state) => state.admissions.branchlist.pending
  );

  const fetchBranches = useCallback(() => {
    if (college[0]) dispatch(fetchBranchList({ college: college[0] }));
  }, [college[0]]);

  // Ensure the default value is set in the URL on first load if it's missing
  useEffect(() => {
    setCollege([collegesOptions.items[0]?.value ?? ""]);
  }, [setCollege]);

  useEffect(() => {
    if (!isBranchesLoading && !branch[0] && branches.length !== 0)
      setBranch([branches.at(0)?.value ?? ""]);
  }, [branches, isBranchesLoading]);

  useEffect(() => {
    fetchBranches();
  }, [college[0]]);

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
    >
      <VStack alignItems={"start"} w={"full"} py={"4"}>
        <Text fontSize={"xs"} color={"fg.muted"}>
          College
        </Text>

        <SelectRoot
          size={"sm"}
          value={college}
          onValueChange={({ value }) => setCollege(value)}
          collection={collegesOptions}
        >
          <SelectTrigger>
            <SelectValueText placeholder="Select College" />
          </SelectTrigger>

          <SelectContent>
            {collegesOptions.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>

        <Text fontSize={"xs"} color={"fg.muted"}>
          Branches
        </Text>

        {isBranchesLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} w={"full"} h={"8"} />
            ))
          : branches.map((item) => (
              <Button
                w={"full"}
                justifyContent={"start"}
                variant={item.value === branch.at(0) ? "subtle" : "ghost"}
                colorPalette={item.value === branch.at(0) ? "blue" : "gray"}
                size={"xs"}
                onClick={() => setBranch([item.value])}
                key={item.value}
              >
                {item.value}
              </Button>
            ))}
      </VStack>
    </VStack>
  );
}
