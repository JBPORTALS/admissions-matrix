"use client";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchOverallMatrix } from "@/store/admissions.slice";
import { Progress, Stack, Table, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import { useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Link } from "@chakra-ui/next-js";

export default function Home() {
  const dispatch = useAppDispatch();
  const overAllMatrix = useAppSelector(
    (state) => state.admissions.overall_matrix.data
  ) as {
    allotted_seats: string;
    college: string;
    filled_percentage: number;
    remaining_seats: string;
    total: number;
  }[];

  useEffect(() => {
    dispatch(fetchOverallMatrix());
  }, [dispatch]);

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <Table
        px={"5"}
        variant={"simple"}
        bg={"white"}
        colorScheme="facebook"
        size={"lg"}
      >
        <Tbody px={"5"}>
          <Tr>
            <Th>College</Th>
            <Th>Mangement Seats</Th>
            <Th>Allotted Seats</Th>
            <Th>Remaining Seats</Th>
            <Th>Filled Percentage</Th>
          </Tr>
          {overAllMatrix.length &&
            overAllMatrix?.map((value, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link href={"/dashboard/" + value.college}>
                      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                        {value.college}
                      </div>
                    </Link>
                  </Td>
                  <Td>{value.total}</Td>
                  <Td>{value.allotted_seats}</Td>
                  <Td>{value.remaining_seats}</Td>
                  <Td>
                    <div className="flex flex-col justify-center items-center relative text-xl text-black h-full w-full">
                      <h3 className="z-2 text-brand drop-shadow-lg">
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
                    </div>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Stack>
  );
}
