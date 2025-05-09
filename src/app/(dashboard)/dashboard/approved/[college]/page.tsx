"use client";
import {
  Progress,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Link } from "@chakra-ui/next-js";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { trpc } from "@/utils/trpc-cleint";

export default function Home() {
  const router = useParams();
  const acadyear = useAppSelector((state) => state.admissions.acadYear);
  const { data, error } = trpc.retreiveBranchMatrix.useQuery({
    acadyear,
    college: router.college as string,
  });
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading)
    return (
      <VStack spacing={1} h={"full"} w={"full"}>
        <Skeleton w={"full"} h={"14"}></Skeleton>
        {new Array(8).fill(0).map((_, index) => {
          return <Skeleton key={index} w={"full"} h={"20"}></Skeleton>;
        })}
      </VStack>
    );

  return (
    <Stack h={"fit"} w={"full"} pb={"40"} justifyContent={"start"}>
      <Table
        px={"5"}
        variant={"simple"}
        bg={"white"}
        colorScheme="facebook"
        size={"md"}
      >
        <Tbody>
          <Tr
            position={"sticky"}
            top={"0"}
            zIndex={"banner"}
            borderBottom={"1px"}
            borderColor={"gray.300"}
            fontSize={"sm"}
            shadow={"sm"}
            className="backdrop-blur-sm bg-[rgba(255,255,255,0.6)] border-b-2"
          >
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Branch
              </div>
            </Th>

            {router.college === "KSIT" ||
            router.college === "KSDC" ||
            router.college === "KSSEM" ? (
              <>
                <Th>
                  <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                    Total Seats
                  </div>
                </Th>
                <Th>
                  <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                    CET & SNQ
                  </div>
                </Th>
                <Th>
                  <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                    COMEDK
                  </div>
                </Th>
              </>
            ) : null}
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Management
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Allotted
              </div>
            </Th>

            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Remaining
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Filled Percentage
              </div>
            </Th>
            <Th>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Total Enquiries
              </div>
            </Th>
          </Tr>
          {data &&
            data.length > 0 &&
            data?.map((value, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link
                      href={
                        "/dashboard/approved/" +
                        router.college +
                        `/${value.branch}`
                      }
                    >
                      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                        {value.branch}
                      </div>
                    </Link>
                  </Td>

                  {router.college === "KSIT" ||
                  router.college === "KSDC" ||
                  router.college === "KSSEM" ? (
                    <>
                      <Td>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.total}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.cet}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.comedk}
                        </div>
                      </Td>
                    </>
                  ) : null}
                  <Td>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.management}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.allotted_seats}
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
                  <Td>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total_enquiries}
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
