"use client";

import { useAppSelector } from "@/store";
import { useUser } from "@/utils/auth";
import { trpc } from "@/utils/trpc-cleint";
import {
  Badge,
  Button,
  Center,
  FormatNumber,
  HStack,
  Heading,
  Icon,
  Spinner,
  Stat,
  Timeline,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import React from "react";
import { LuCalendar, LuFileDown } from "react-icons/lu";

export default function UnApproved() {
  const user = useUser();
  const currentUserCollege = user?.college ?? "";
  const searchParmas = useSearchParams();
  const college = searchParmas.get("col") ?? currentUserCollege;
  const acadYear = useAppSelector((state) => state.admissions.acadYear);

  const {
    data: sdata,
    isLoading,
    isError,
    error,
  } = trpc.seatMatrix.useQuery({ college, acadYear });

  if (
    !["MANAGEMENT", "KSPT"].includes(currentUserCollege) &&
    college !== currentUserCollege &&
    user?.isLoaded
  )
    return notFound();

  return (
    <React.Fragment>
      {/** Header */}
      <HStack
        justifyContent={"space-between"}
        w={"full"}
        bg={"AppWorkspace/60"}
        backdropFilter={"blur(5px)"}
        alignItems={"center"}
        h={"14"}
        px={"3"}
        rounded={"lg"}
        shadow={"sm"}
        position={"sticky"}
        top={"20"}
        zIndex={"banner"}
      >
        {college && (
          <Heading size={"md"} color={"fg"} fontWeight={"semibold"}>
            Seat Matrix History - {college}
          </Heading>
        )}
        {college && (
          <Button size={"sm"} asChild variant={"surface"}>
            <Link
              target="_blank"
              href={
                process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                "seatmatrixdownload.php?college=" +
                college
              }
            >
              <LuFileDown /> Download Matrix
            </Link>
          </Button>
        )}
      </HStack>

      <VStack
        w={"full"}
        py={"3"}
        px={"4"}
        justifyContent={"start"}
        alignItems={"start"}
        gap={0}
      >
        {/* displaying admin childrens */}
        {college && user?.college && sdata && (
          <Timeline.Root size="lg" variant="subtle" maxW="2xl">
            {sdata.map((history: any, index) => {
              return (
                <Timeline.Item key={history.date + index}>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>
                      <Icon fontSize="xs">
                        <LuCalendar />
                      </Icon>
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>
                      {moment(history.date).format("MMM DD, YYYY")}
                    </Timeline.Title>
                    <HStack alignItems={"start"}>
                      <Stat.Root>
                        <Stat.Label>Total Seats</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber value={history.total} style="decimal" />
                        </Stat.ValueText>
                      </Stat.Root>

                      <Stat.Root>
                        <Stat.Label>Total Admissions</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber
                            value={history.allotted_seats}
                            style="decimal"
                          />
                        </Stat.ValueText>
                      </Stat.Root>

                      <Stat.Root>
                        <Stat.Label>Today Admissions</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber
                            value={history.today_admissions}
                            style="decimal"
                          />
                        </Stat.ValueText>
                        {history.today_admissions > 0 && (
                          <Badge colorPalette="green" variant="plain" px="0">
                            <Stat.UpIndicator />
                            Got increased
                          </Badge>
                        )}
                      </Stat.Root>

                      <Stat.Root>
                        <Stat.Label>Remaining Admissions</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber
                            value={history.remaining_seats}
                            style="decimal"
                          />
                        </Stat.ValueText>
                      </Stat.Root>
                    </HStack>
                  </Timeline.Content>
                </Timeline.Item>
              );
            })}
          </Timeline.Root>
        )}
      </VStack>
      {isError && (
        <Center h={"80%"}>
          <Heading size={"lg"}>{error.message}</Heading>
        </Center>
      )}
      {isLoading && (
        <Center h={"80%"}>
          <Spinner color={"fg.muted"} size={"lg"} />
        </Center>
      )}
    </React.Fragment>
  );
}
