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
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { trpc } from "@/utils/trpc-cleint";
import Link from "next/link";
import { ProgressBar, ProgressRoot } from "@/components/ui/progress";

export default function CollegeList() {
  const params = useParams<{ college: string }>();
  const acadyear = useAppSelector((state) => state.admissions.acadYear);
  const { data, error } = trpc.retreiveBranchMatrix.useQuery({
    acadyear,
    college: params.college,
  });
  const [isLoading, setIsLoading] = useState(false);

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
      <Breadcrumb.Root size={"lg"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href={"/dashboard/approved"}>Overall</Link>
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
        size={"lg"}
        colorPalette={"gray"}
      >
        <Table.Header>
          <Table.ColumnHeader>
            <div className="flex justify-center items-center text-md hover:underline h-full w-full">
              Branch
            </div>
          </Table.ColumnHeader>

          {params.college === "KSIT" ||
          params.college === "KSDC" ||
          params.college === "KSSEM" ? (
            <>
              <Table.ColumnHeader>Total Seats</Table.ColumnHeader>
              <Table.ColumnHeader>CET & SNQ</Table.ColumnHeader>
              <Table.ColumnHeader>COMEDK</Table.ColumnHeader>
            </>
          ) : null}
          <Table.ColumnHeader>Management</Table.ColumnHeader>
          <Table.ColumnHeader>Allotted</Table.ColumnHeader>

          <Table.ColumnHeader>Remaining</Table.ColumnHeader>
          <Table.ColumnHeader>Filled Percentage</Table.ColumnHeader>
          <Table.ColumnHeader>Total Enquiries</Table.ColumnHeader>
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
                          "/dashboard/approved/" +
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

                  {params.college === "KSIT" ||
                  params.college === "KSDC" ||
                  params.college === "KSSEM" ? (
                    <>
                      <TableCell>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.total}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.cet}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.comedk}
                        </div>
                      </TableCell>
                    </>
                  ) : null}
                  <TableCell>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.management}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.allotted_seats}
                    </div>
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <span className="relative flex items-center justify-center h-10 w-10">
                      <span className="animate-ping absolute inline-flex h-[72%] w-[72%] rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative text-md flex items-center p-2 justify-center text-white font-medium rounded-full h-10 w-10 bg-sky-600">
                        {value.remaining_seats}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell position={"relative"} zIndex={"base"}>
                    <h3 className="text-brand drop-shadow-lg text-lg font-medium">
                      {value.filled_percentage} %
                    </h3>
                    <ProgressRoot
                      colorPalette={"blue"}
                      size="sm"
                      defaultValue={value.filled_percentage}
                      striped
                    >
                      <ProgressBar />
                    </ProgressRoot>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total_enquiries}
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
