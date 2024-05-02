"use client";
import ISelect from "@/components/ui/utils/ISelect";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import { useAppSelector } from "@/store";
import { trpc } from "@/utils/trpc-cleint";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatUpArrow,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineFilePdf } from "react-icons/ai";

export default function UnApproved() {
  const [ucollege, setCollege] = useState<string | undefined>("");
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const { data: sdata } = trpc.seatMatrix.useQuery(
    { college: ucollege ?? "", acadYear },
    { enabled: !!ucollege }
  );
  const sError = useAppSelector((state) => state.admissions.seat_matrix.error);

  return (
    <div className="h-full">
      <HStack
        justifyContent={"space-between"}
        className="w-full flex border-b py-2 space-x-3 px-5"
      >
        <HStack>
          <ISelect
            placeHolder="Select College"
            value={ucollege}
            onChange={(value) => setCollege(value)}
            options={[
              { value: "KSIT", option: "KSIT" },
              { value: "KSPT", option: "KSPT" },
              { value: "KSPU", option: "KSPU" },
              { value: "KSSA", option: "KSSA" },
              { value: "KSSEM", option: "KSSEM" },
            ]}
          />
        </HStack>
        {ucollege && (
          <Heading size={"lg"} color={"gray.700"} fontWeight={"semibold"}>
            Seat Matrix - {ucollege}
          </Heading>
        )}
        <Box>
          {ucollege && (
            <Button
              as={Link}
              target="_blank"
              href={
                process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                "seatmatrixdownload.php?college=" +
                ucollege
              }
              size={"sm"}
              colorScheme="teal"
              leftIcon={<AiOutlineFilePdf className="text-2xl" />}
              variant={"ghost"}
            >
              Download Matrix
            </Button>
          )}
        </Box>
      </HStack>
      <VStack className="w-full h-full" spacing={0}>
        {!ucollege ? <InfoCard message="Select College" /> : null}
        <VStack
          spacing={0}
          px={"10"}
          className={
            "justify-start h-fit items-start flex w-full overflow-scroll"
          }
        >
          {/* displaying admin childrens */}
          {ucollege && sdata && sdata.length > 0 ? (
            <ol className="relative border-l py-10 pb-16 border-gray-200 h-fit w-full">
              {sdata.map((history: any, index) => {
                return (
                  <li
                    key={history.date + index}
                    className="mb-10 ml-6 border-gray-200 border-b pb-5"
                  >
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                      <svg
                        aria-hidden="true"
                        className="w-3 h-3 text-blue-800"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <h3 className="flex pb-3 px-3 items-center mb-1 text-lg font-semibold text-gray-900 ">
                      {moment(history.date).format("MMM DD, YYYY")}
                    </h3>
                    <StatGroup width={"50%"} px={"0"}>
                      <Stat size={"md"}>
                        <StatLabel textAlign={"center"}>Total Seats</StatLabel>
                        <StatNumber
                          fontSize={"3xl"}
                          textAlign={"center"}
                          color={"purple.700"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.total}
                        </StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel textAlign={"center"}>
                          Total Admissions
                        </StatLabel>
                        <StatNumber
                          fontSize={"3xl"}
                          textAlign={"center"}
                          color={"green.500"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.allotted_seats}
                        </StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel textAlign={"center"}>
                          Today Admissions
                        </StatLabel>
                        <StatNumber
                          textAlign={"center"}
                          fontSize={"3xl"}
                          color={"teal.700"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.today_admissions}
                        </StatNumber>
                        <StatHelpText textAlign={"center"}>
                          {history.today_admissions > 0 && (
                            <>
                              <StatUpArrow type="increase" /> Got increased
                            </>
                          )}
                        </StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel textAlign={"center"}>
                          Remaining Seats
                        </StatLabel>
                        <StatNumber
                          textAlign={"center"}
                          fontSize={"3xl"}
                          color={"red.600"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.remaining_seats}
                        </StatNumber>
                      </Stat>
                    </StatGroup>
                  </li>
                );
              })}
            </ol>
          ) : ucollege && sdata && sdata.length == 0 ? (
            <Center h={"80%"}>
              <Heading size={"lg"}>{sError}</Heading>
            </Center>
          ) : null}
        </VStack>
      </VStack>
    </div>
  );
}
