"use client";

import { Breadcrumb, LinkBox, Skeleton, Table, VStack } from "@chakra-ui/react";
import { trpc } from "@/utils/trpc-cleint";
import Link from "next/link";
import {
  ProgressBar,
  ProgressLabel,
  ProgressRoot,
} from "@/components/ui/progress";
import React from "react";
import { useUser } from "@/utils/auth";

export default function Home() {
  const user = useUser();
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
          return <Skeleton key={index} w={"full"} h={"10"}></Skeleton>;
        })}
      </VStack>
    );

  return (
    <React.Fragment>
      {/* BreadCrumbs  */}
      <Breadcrumb.Root variant={"underline"}>
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
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>College</Table.ColumnHeader>

            <Table.ColumnHeader textAlign={"center"}>
              Allotted Seats
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Total Enquiries
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
                      <Link href={"/dashboard/bus/" + value.college}>
                        {value.college}
                      </Link>
                    </LinkBox>
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.allotted_seats}
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.total_enquiries}
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </React.Fragment>
  );
}
