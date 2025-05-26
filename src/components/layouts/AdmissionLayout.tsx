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
  useDisclosure,
  VStack,
  Grid,
  GridItem,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Link from "next/link";
import {
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineSetting,
  AiOutlineUser,
} from "react-icons/ai";
import { useAppSelector } from "@/store";
import { useParams, usePathname, useRouter } from "next/navigation";
import moment from "moment";
import { BsFilter } from "react-icons/bs";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MIFModal from "../drawers/MIFModal";
import SideBar from "../SideBar";
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
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";

interface AttendanceLayoutProps {
  children: React.ReactNode;
  showDownloadFile?: boolean;
}

const filterSourceOptions = createListCollection({
  items: [
    {
      label: "MANAGEMENT",
      value: "MANAGEMENT",
    },
    {
      label: "COLLEGE WEBSITE",
      value: "COLLEGE WEBSITE",
    },
    {
      label: "STUDENT REFERENCE",
      value: "STUDENT REFERENCE",
    },
    {
      label: "PARENT/RELATIVE REFERENCE",
      value: "PARENT/RELATIVE REFERENCE",
    },
    {
      label: "FACULTY REFERENCE",
      value: "FACULTY REFERENCE",
    },
    {
      label: "NEWS PAPER AD",
      value: "NEWS PAPER AD",
    },
    {
      label: "TV OR RADIO AD",
      value: "TV OR RADIO AD",
    },
    {
      label: "METRO BRANDING",
      value: "METRO BRANDING",
    },
    {
      label: "BUS BRANDING",
      value: "BUS BRANDING",
    },
    {
      label: "EDUCATION FAIR",
      value: "EDUCATION FAIR",
    },
    {
      label: "PHONE OR SMS OR WHATSAPP",
      value: "PHONE OR SMS OR WHATSAPP",
    },
    {
      label: "SOCAIL MEDIA",
      value: "SOCAIL MEDIA",
    },
    {
      label: "OTHERS",
      value: "OTHERS",
    },
  ],
});

const filterStateOptions = createListCollection({
  items: [
    {
      label: "By enquiry Date",
      value: "ENQUIRY",
    },
    {
      label: "By Approval Date.",
      value: "APPROVAL",
    },
    {
      label: "By Source",
      value: "SOURCE",
    },
  ],
});

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
              <MenuRoot size={"md"}>
                <MenuTrigger asChild>
                  <Button variant={"outline"}>
                    <BsFilter className={"text-xl"} />
                    Filters
                  </Button>
                </MenuTrigger>

                <MenuContent
                  gap={"3"}
                  display={"flex"}
                  flexDir={"column"}
                  shadow={"2xl"}
                >
                  <Field.Root>
                    <SelectRoot
                      collection={filterStateOptions}
                      value={[filterType]}
                      onValueChange={(e) => setFilterType(e.value[0])}
                    >
                      <SelectLabel>Select Filter</SelectLabel>
                      <SelectTrigger w={"240px"}>
                        <Select.ValueText placeContent={"Select ..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {filterStateOptions.items.map((item) => (
                          <SelectItem key={item.value} item={item}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </Field.Root>
                  {filterType && (
                    <>
                      <Field.Root>
                        {filterType == "SOURCE" ? (
                          <>
                            <SelectRoot
                              collection={filterSourceOptions}
                              value={[filterState.source]}
                              onValueChange={(e) =>
                                setFilterState((prev) => ({
                                  ...prev,
                                  source: e.value[0],
                                }))
                              }
                            >
                              <SelectLabel>Select Source</SelectLabel>
                              <SelectTrigger w={"240px"}>
                                <SelectValueText placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent zIndex={"max"}>
                                {filterSourceOptions.items.map(
                                  (item, _index) => (
                                    <SelectItem item={item} key={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </SelectRoot>
                          </>
                        ) : filterType == "APPROVAL" ||
                          filterType == "ENQUIRY" ? (
                          <>
                            <Field.Label>Date</Field.Label>
                            <Input
                              className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                              value={
                                !filterState.date
                                  ? new Date().toDateString()
                                  : new Date(filterState.date).toDateString()
                              }
                              type="date"
                              onChange={(date) => {
                                setFilterState((prev) => ({
                                  ...prev,
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
                </MenuContent>
              </MenuRoot>

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
