"use client";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchOverallHostel } from "@/store/admissions.slice";
import {
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useSupabase } from "@/app/supabase-provider";
import Link from "next/link";

export default function Home() {
  const dispatch = useAppDispatch();
  const { user } = useSupabase();
  const overAllMatrix = useAppSelector(
    (state) => state.admissions.overall_matrix.data
  ) as {
    allotted_seats: string;
    college: string;
    filled_percentage: number;
    remaining_seats: string;
    total: number;
    total_enquiries: string;
  }[];
  const isLoading = useAppSelector(
    (state) => state.admissions.overall_matrix.pending
  ) as boolean;

  useEffect(() => {
    user?.college && dispatch(fetchOverallHostel({ college: user?.college }));
  }, [dispatch, user?.college]);

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
    <Stack
      h={"fit"}
      pb={"40"}
      w={"full"}
      justifyContent={"start"}
      overflowY={"scroll"}
    >
      <Table
        px={"5"}
        variant={"simple"}
        bg={"white"}
        colorScheme="facebook"
        size={"lg"}
      >
        <TableBody px={"5"}>
          <TableRow>
            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                College
              </div>
            </TableHeader>

            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Total Students
              </div>
            </TableHeader>
          </TableRow>
          {overAllMatrix.length > 0 &&
            overAllMatrix?.map((value: any, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link href={"/dashboard/hostel/" + value.college}>
                      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                        {value.college}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total_students}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Stack>
  );
}
