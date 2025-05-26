"use client";
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Menu,
  Select,
  Tag,
  Text,
  useDisclosure,
  VStack,
  Tabs,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Link from "next/link";
import {
  AiFillFilePdf,
  AiOutlineArrowRight,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineFileExcel,
  AiOutlineFilePdf,
  AiOutlineHistory,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineSetting,
  AiOutlineUser,
} from "react-icons/ai";
import { HiBuildingOffice } from "react-icons/hi2";
import { useAppSelector } from "@/store";
import { useParams, usePathname, useRouter } from "next/navigation";
import moment from "moment";
import { BsFilter } from "react-icons/bs";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import MIFModal from "../drawers/MIFModal";
import SideBar from "../SideBar";
import { FaChevronDown, FaFileDownload } from "react-icons/fa";
import { useSignIn, useUser } from "@/utils/auth";
import {
  DialogTrigger,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "../ui/dialog";
import { Avatar } from "../ui/avatar";
import { LuCheck } from "react-icons/lu";

interface AttendanceLayoutProps {
  children: React.ReactNode;
  showDownloadFile?: boolean;
}

export default function AdmissionLayout({ children }: AttendanceLayoutProps) {
  const router = useParams();

  const { college, branch } = router;

  const [filterType, setFilterType] = useState<string>("");
  const [filterState, setFilterState] = useState<{
    source: string;
    date: Date | null;
  }>({
    source: "",
    date: new Date(),
  });
  const [query, setQuery] = useState<string>("");

  const metaData = useAppSelector(
    (state) => state.admissions.search_class.data
  ) as { remaining: string; intake: string; allotted: string }[];

  const pathname = usePathname();

  const user = useUser();
  const { signOut } = useSignIn();
  const { open, onOpen, onClose } = useDisclosure();
  const navRouter = useRouter();

  return (
    <Box h={"100svh"} w={"full"} position={"relative"} display={"contents"}>
      <HStack
        w={"full"}
        position={"sticky"}
        top={"0"}
        left={"0"}
        px={"5"}
        justifyContent={"space-between"}
        h={"16"}
        gap={"3"}
        borderBottomColor={"border"}
        borderBottomWidth={"thin"}
        backdropBlur={"sm"}
        zIndex={"sticky"}
        background={"Background"}
      >
        <HStack w={"full"}>
          {/* <Box h={"8"} w={"28"} position={"relative"}>
            <Image
              quality={100}
              alt={"ismart"}
              src={"/nexuss.png"}
              priority
              sizes="24vh"
              fill
            />
          </Box> */}
          <Heading size={"lg"} position={"relative"} color={"fg"}>
            Admission Matrix
          </Heading>
        </HStack>
        <HStack w={"full"}>
          <InputGroup
            endElement={
              <IconButton
                onClick={async () => {
                  navRouter.push(
                    `/dashboard/search/${new Date().getTime()}?query=${query}&type=QUERY`
                  );
                }}
                colorScheme="facebook"
                size={"md"}
                variant={"ghost"}
                aria-label="search"
              >
                <AiOutlineSearch className="text-lg" />
              </IconButton>
            }
            w={"full"}
          >
            <Input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              w={"full"}
              fontSize={"sm"}
              type={"text"}
              onKeyDown={(e) => {
                if (e.key == "Enter")
                  navRouter.push(
                    `/dashboard/search/${new Date().getTime()}?query=${query}&type=QUERY`
                  );
              }}
              placeholder="Search Admission no./Student Name/Phone No."
            />
          </InputGroup>
        </HStack>

        <HStack w={"full"} position={"relative"} justifyContent={"end"}>
          <HStack>
            <Heading size={"md"}>{user?.fullname}</Heading>
            <DialogRoot size={"sm"}>
              <DialogTrigger>
                <IconButton
                  onClick={onOpen}
                  variant={"plain"}
                  aria-label="avatar"
                >
                  <Avatar />
                </IconButton>
              </DialogTrigger>

              <DialogContent
                position={"relative"}
                zIndex={"toast"}
                backdropBlur={"2xl"}
                shadow={"2xl"}
              >
                <DialogHeader fontWeight="semibold" fontSize={"lg"}>
                  <DialogTitle>Profile Info</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <HStack gap={"3"} py={"2"}>
                    <AiOutlineUser className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {user?.fullname}
                    </Heading>
                  </HStack>
                  <HStack gap={"3"} py={"2"}>
                    <AiOutlineMail className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {user?.email}
                    </Heading>
                  </HStack>
                  <HStack gap={"3"} py={"2"}>
                    <Button
                      onClick={async () => {
                        await signOut();
                      }}
                      colorScheme="facebook"
                      w={"full"}
                    >
                      <AiOutlineLogout />
                      SignOut
                    </Button>
                  </HStack>
                </DialogBody>
              </DialogContent>
            </DialogRoot>
          </HStack>
        </HStack>
      </HStack>

      <Grid
        gridAutoFlow={"row"}
        h={"100svh"}
        w={"full"}
        templateColumns="repeat(7, 1fr)"
      >
        {/** SideBar contents */}
        <GridItem>
          <SideBar />
        </GridItem>

        {/** Main Content */}
        <GridItem colSpan={6} p={"5"} h={"full"} w={"full"}>
          <HStack justifyContent={"space-between"}>
            <Heading size={"2xl"} color={"fg"}>
              {pathname.startsWith("/dashboard/approved")
                ? "Approved Details"
                : pathname.startsWith("/dashboard/un-approved")
                ? "Un-Approved Details"
                : pathname.startsWith("/dashboard/hostel")
                ? "Hostel Details"
                : pathname.startsWith("/dashboard/history")
                ? "Admissions History"
                : ""}
            </Heading>

            <HStack mr={"2"}>
              <Menu.Root size={"md"}>
                <Menu.Trigger asChild>
                  <Button>
                    <BsFilter className={"text-xl"} />
                    Filters
                  </Button>
                </Menu.Trigger>
                <Menu.Content shadow={"2xl"} zIndex={"dropdown"}>
                  <VStack px={"4"}>
                    <Field.Root>
                      <Select.Root
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <Select.Trigger>
                          <Select.ValueText />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value={""}>Select Filter</Select.Item>
                          <Select.Item value={"ENQUIRY"}>
                            By Enquiry Date
                          </Select.Item>
                          <Select.Item value={"APPROVAL"}>
                            By Approval Date
                          </Select.Item>
                          <Select.Item value={"SOURCE"}>By source.</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Field.Root>
                    {filterType && (
                      <>
                        <Field.Root>
                          {filterType == "SOURCE" ? (
                            <>
                              <Field.Label>Source</Field.Label>
                              <Select.Root
                                onChange={(e) =>
                                  setFilterState((prev) => ({
                                    ...prev,
                                    source: e.target.value,
                                  }))
                                }
                              >
                                <option value={""}>Select Source</option>
                                {[
                                  {
                                    option: "MANAGEMENT",
                                    value: "MANAGEMENT",
                                  },
                                  {
                                    option: "COLLEGE WEBSITE",
                                    value: "COLLEGE WEBSITE",
                                  },
                                  {
                                    option: "STUDENT REFERENCE",
                                    value: "STUDENT REFERENCE",
                                  },
                                  {
                                    option: "PARENT/RELATIVE REFERENCE",
                                    value: "PARENT/RELATIVE REFERENCE",
                                  },
                                  {
                                    option: "FACULTY REFERENCE",
                                    value: "FACULTY REFERENCE",
                                  },
                                  {
                                    option: "NEWS PAPER AD",
                                    value: "NEWS PAPER AD",
                                  },
                                  {
                                    option: "TV OR RADIO AD",
                                    value: "TV OR RADIO AD",
                                  },
                                  {
                                    option: "METRO BRANDING",
                                    value: "METRO BRANDING",
                                  },
                                  {
                                    option: "BUS BRANDING",
                                    value: "BUS BRANDING",
                                  },
                                  {
                                    option: "EDUCATION FAIR",
                                    value: "EDUCATION FAIR",
                                  },
                                  {
                                    option: "PHONE OR SMS OR WHATSAPP",
                                    value: "PHONE OR SMS OR WHATSAPP",
                                  },
                                  {
                                    option: "SOCAIL MEDIA",
                                    value: "SOCAIL MEDIA",
                                  },
                                  {
                                    option: "OTHERS",
                                    value: "OTHERS",
                                  },
                                ].map((value, _index) => (
                                  <option key={value.value} value={value.value}>
                                    {value.option}
                                  </option>
                                ))}
                              </Select.Root>
                            </>
                          ) : filterType == "APPROVAL" ||
                            filterType == "ENQUIRY" ? (
                            <>
                              <Field.Label>Date</Field.Label>
                              <ReactDatePicker
                                className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                                selected={
                                  !filterState.date
                                    ? new Date()
                                    : new Date(filterState.date)
                                }
                                dateFormat={"dd/MM/yyyy"}
                                onChange={(date) => {
                                  setFilterState((prev) => ({
                                    ...prev,
                                    date,
                                  }));
                                }}
                              />
                            </>
                          ) : null}
                        </Field.Root>
                        <Field.Root>
                          <Button asChild w={"full"} colorPalette={"blue"}>
                            <Link
                              href={`/dashboard/search/${new Date(
                                Date.now()
                              ).getTime()}/?type=${filterType}&date=${moment(
                                filterState.date
                              ).format("yyyy-MM-DD")}&source=${
                                filterState.source
                              }`}
                              onClick={() => {
                                //  navigation.refresh()
                              }}
                            >
                              <AiOutlineSearch className={"text-lg"} />
                              Search
                            </Link>
                          </Button>
                        </Field.Root>
                      </>
                    )}
                  </VStack>
                </Menu.Content>
              </Menu.Root>

              {user?.college === "MANAGEMENT" ? (
                <MIFModal>
                  {({ onOpen }) => (
                    <Button onClick={onOpen} size={"sm"} variant={"ghost"}>
                      Manage Intake & Fee{" "}
                      <AiOutlineSetting className="text-xl" />
                    </Button>
                  )}
                </MIFModal>
              ) : null}
            </HStack>
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
