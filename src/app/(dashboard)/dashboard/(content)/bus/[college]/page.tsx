"use client";
import {
  Breadcrumb,
  LinkBox,
  Skeleton,
  Table,
  TableCell,
  TableRow,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { trpc } from "@/utils/trpc-cleint";
import Link from "next/link";
import { ProgressBar, ProgressRoot } from "@/components/ui/progress";

export default function CollegeList() {
  const params = useParams<{ college: string }>();
  const acadyear = useAppSelector((state) => state.admissions.acadYear);
  const { data, isLoading } = trpc.retreiveBusBranchMatrix.useQuery({
    acadyear,
    college: params.college,
  });

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
      <Breadcrumb.Root variant={"underline"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href={"/dashboard/bus"}>Overall</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>{params.college}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Table.Root
        interactive
        px={"5"}
        variant={"outline"}
        rounded={"lg"}
        colorPalette={"gray"}
      >
        <Table.Header>
          <Table.ColumnHeader>
            <div className="flex justify-center items-center text-md hover:underline h-full w-full">
              Branch
            </div>
          </Table.ColumnHeader>
          <Table.ColumnHeader>Allotted Seats</Table.ColumnHeader>
        </Table.Header>
        <Table.Body>
          {data &&
            data.length > 0 &&
            data?.map((value, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <LinkBox asChild _hover={{ textDecor: "underline" }}>
                      <Link
                        href={
                          "/dashboard/bus/" +
                          params.college +
                          `/${value.branch}`
                        }
                      >
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.branch}
                        </div>
                      </Link>
                    </LinkBox>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.allotted}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </Table.Body>
      </Table.Root>
    </React.Fragment>
  );
}
