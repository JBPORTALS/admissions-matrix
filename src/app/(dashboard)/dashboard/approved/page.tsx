"use client";
import {
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
    <Stack
      h={"fit"}
      pb={"40"}
      w={"full"}
      justifyContent={"start"}
      overflowY={"scroll"}
    >
      <Table.Root
        px={"5"}
        variant={"outline"}
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
                Management Seats
              </div>
            </TableHeader>
            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Allotted Seats
              </div>
            </TableHeader>
            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Total Enquiries
              </div>
            </TableHeader>
            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Remaining Seats
              </div>
            </TableHeader>
            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Filled Percentage
              </div>
            </TableHeader>
          </TableRow>
          {data &&
            data.length > 0 &&
            data?.map((value, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link href={"/dashboard/approved/" + value.college}>
                      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                        {value.college}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.allotted_seats}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total_enquiries}
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
                    <Progress.Root>
                      <Progress.Track>
                        <Progress.Range
                          w={"full"}
                          value={value.filled_percentage}
                          rounded={"full"}
                          isAnimated
                          isIndeterminate={value.filled_percentage == undefined}
                          size="sm"
                          colorScheme="blue"
                        />
                      </Progress.Track>
                    </Progress.Root>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table.Root>
    </Stack>
  );
}
