"use client";
import {
  Breadcrumb,
  LinkBox,
  Progress,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  VStack,
} from "@chakra-ui/react";
import { trpc } from "@/utils/trpc-cleint";
import { useSupabase } from "@/app/supabase-provider";
import Link from "next/link";
import {
  ProgressBar,
  ProgressLabel,
  ProgressRoot,
} from "@/components/ui/progress";
import React from "react";

export default function Home() {
  const { user } = useSupabase();
  const { isLoading, data } = trpc.getOverallMatrix.useQuery(
    {
      acadyear: process.env.NEXT_PUBLIC_ACADYEAR!,
      college: user?.college ?? "",
    },
    { enabled: !!user?.college, queryHash: user?.college }
  );

  if (isLoading)
    return (
      <VStack gap={1} h={"full"} w={"full"}>
        <Skeleton w={"full"} h={"14"}></Skeleton>
        {new Array(8).fill(0).map((_, index) => {
          return <Skeleton key={index} w={"full"} h={"20"}></Skeleton>;
        })}
      </VStack>
    );

  return (
    <React.Fragment>
      {/* BreadCrumbs  */}
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Overall</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      {/* Main Table */}
      <Table.Root
        colorPalette={"gray"}
        interactive
        px={"5"}
        variant={"outline"}
        rounded={"lg"}
        size={"lg"}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>College</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Management Seats
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Allotted Seats
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Total Enquiries
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Remaining Seats
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"right"}>
              Filled Percentage
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data &&
            data.length > 0 &&
            data?.map((value, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>
                    <LinkBox asChild _hover={{ textDecor: "underline" }}>
                      <Link href={"/dashboard/approved/" + value.college}>
                        {value.college}
                      </Link>
                    </LinkBox>
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>{value.total}</Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.allotted_seats}
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.total_enquiries}
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.remaining_seats}
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <ProgressRoot colorPalette={"blue"} size={"xs"} striped>
                      <ProgressLabel>{value.filled_percentage} %</ProgressLabel>
                      <ProgressBar defaultValue={value.filled_percentage} />
                    </ProgressRoot>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </React.Fragment>
  );
}
