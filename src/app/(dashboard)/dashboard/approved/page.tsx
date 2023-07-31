"use client";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchOverallMatrix } from "@/store/admissions.slice";
import { Progress, Skeleton, Stack, Table, Tbody, Td, Th, Tr, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Link } from "@chakra-ui/next-js";
import { useSupabase } from "@/app/supabase-provider";

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
    user?.college && dispatch(fetchOverallMatrix({ college: user?.college }));
  }, [dispatch, user?.college]);
  
  if(isLoading) return(
    <VStack spacing={1} h={"full"} w={"full"}>
      <Skeleton w={"full"} h={"14"}></Skeleton>
       {
        new Array(8).fill(0).map((_,index)=>{
          return <Skeleton key={index} w={"full"} h={"20"}></Skeleton>
        })
       }   
    </VStack>
  ) 
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
        <Tbody px={"5"}>
          <Tr>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                College
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Management Seats
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Allotted Seats
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Total Enquiries
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Remaining Seats
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Filled Percentage
              </div>
            </Th>
          </Tr>
          {overAllMatrix.length > 0 &&
            overAllMatrix?.map((value, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link href={"/dashboard/approved/" + value.college}>
                      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                        {value.college}
                      </div>
                    </Link>
                  </Td>
                  <Td className="text-center">
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.allotted_seats}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total_enquiries}
                    </div>
                  </Td>
                  <Td className="flex justify-center">
                    <span className="relative flex items-center justify-center h-10 w-10">
                      <span className="animate-ping absolute inline-flex h-[72%] w-[72%] rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative text-md flex items-center p-2 justify-center text-white font-medium rounded-full h-10 w-10 bg-sky-600">
                        {value.remaining_seats}
                      </span>
                    </span>
                  </Td>
                  <Td position={"relative"} zIndex={"base"}>
                    <h3 className="text-brand drop-shadow-lg text-lg font-medium">
                      {value.filled_percentage} %
                    </h3>
                    <Progress
                      w={"full"}
                      hasStripe
                      value={value.filled_percentage}
                      rounded={"full"}
                      isAnimated
                      isIndeterminate={value.filled_percentage == undefined}
                      size="sm"
                      colorScheme="blue"
                    />
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Stack>
  );
}
