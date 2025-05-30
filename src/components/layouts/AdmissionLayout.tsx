"use client";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Link from "next/link";
import {
  AiFillFilePdf,
  AiOutlineArrowRight,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineFieldTime,
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
import { useSupabase } from "@/app/supabase-provider";
import moment from "moment";
import { BsFilter } from "react-icons/bs";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import MIFModal from "../drawers/MIFModal";
import SideBar from "../ui/SideBar";
import { FaChevronDown, FaFileDownload } from "react-icons/fa";
import { useSignIn, useUser } from "@/utils/auth";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navRouter = useRouter();

  return (
    <div className="bg-background z-20 relative overflow-hidden w-full  h-full flex flex-col">
      <HStack
        w={"full"}
        position={"sticky"}
        top={"0"}
        left={"0"}
        px={"5"}
        justifyContent={"space-between"}
        h={"14"}
        gap={3}
        bg={"whiteAlpha.100"}
        className="border-b border-b-lightgray backdrop-blur-sm"
      >
        <HStack w={"full"}>
          <div className="relative flex h-8 w-28">
            <Image
              quality={100}
              alt={"ismart"}
              src={"/nexuss.png"}
              priority
              sizes="24vh"
              fill
            />
          </div>
          <Heading size={"sm"} position={"relative"} color={"gray.600"}>
            | Admission Matrix
          </Heading>
        </HStack>
        <HStack w={"full"}>
          <InputGroup w={"full"}>
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
            <InputRightElement>
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
                icon={<AiOutlineSearch className="text-lg" />}
              />
            </InputRightElement>
          </InputGroup>
        </HStack>

        <HStack w={"full"} position={"relative"} justifyContent={"end"}>
          <HStack>
            <Heading size={"md"}>{user?.fullname}</Heading>
            <IconButton
              onClick={onOpen}
              variant={"unstyled"}
              aria-label="avatar"
            >
              <Avatar size={"sm"}></Avatar>
            </IconButton>
          </HStack>
          <Modal isOpen={isOpen} size={"sm"} onClose={onClose}>
            <ModalOverlay className="backdrop-blur-sm" />
            <ModalContent
              position={"relative"}
              zIndex={"toast"}
              backdropBlur={"2xl"}
              shadow={"2xl"}
            >
              <ModalHeader fontWeight="semibold" fontSize={"lg"}>
                Profile Info
              </ModalHeader>
              <ModalBody>
                <HStack spacing={"3"} py={"2"}>
                  <AiOutlineUser className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.fullname}
                  </Heading>
                </HStack>
                <HStack spacing={"3"} py={"2"}>
                  <AiOutlineMail className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.email}
                  </Heading>
                </HStack>
                <HStack spacing={"3"} py={"2"}>
                  <Button
                    leftIcon={<AiOutlineLogout />}
                    onClick={async () => {
                      await signOut();
                    }}
                    colorScheme="facebook"
                    w={"full"}
                  >
                    SignOut
                  </Button>
                </HStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </HStack>
      </HStack>

      <div className="w-full h-full grid grid-cols-7 grid-flow-row">
        <SideBar />
        <div className="col-span-6 h-full w-full">
          <Tabs
            index={
              pathname.startsWith("/dashboard/approved")
                ? 0
                : pathname.startsWith("/dashboard/un-approved")
                ? 1
                : pathname.startsWith("/dashboard/history")
                ? 2
                : pathname.startsWith("/dashboard/hostel")
                ? 3
                : pathname.startsWith("/dashboard/search")
                ? 4
                : -1
            }
            size={"sm"}
            variant={"line"}
            h={"92vh"}
            w={"full"}
            px={"0"}
          >
            <TabList className="px-5" justifyContent={"space-between"}>
              <HStack>
                <Heading size={"sm"}>
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
              </HStack>
              <HStack visibility={"hidden"}>
                <Tab
                  as={Button}
                  rounded={"none"}
                  colorScheme="green"
                  variant={"ghost"}
                  size={"lg"}
                  py={"2"}
                  _selected={{
                    color: "green.400",
                    borderBottom: "2px",
                    borderBottomColor: "green.400",
                  }}
                  leftIcon={<AiOutlineCheckCircle className="text-lg" />}
                >
                  Approved
                </Tab>
                <Tab
                  as={Button}
                  py={"2"}
                  colorScheme="orange"
                  variant={"ghost"}
                  rounded={"none"}
                  size={"lg"}
                  _selected={{
                    color: "orange.400",
                    borderBottom: "2px",
                    borderBottomColor: "orange.400",
                  }}
                  leftIcon={<AiOutlineClockCircle className="text-lg" />}
                >
                  Un-Approved
                </Tab>
                <Tab
                  as={Button}
                  py={"2"}
                  colorScheme="purple"
                  variant={"ghost"}
                  rounded={"none"}
                  size={"lg"}
                  _selected={{
                    color: "purple.400",
                    borderBottom: "2px",
                    borderBottomColor: "purple.400",
                  }}
                  leftIcon={<AiOutlineHistory className="text-lg" />}
                >
                  History
                </Tab>
                <Tab
                  as={Button}
                  py={"2"}
                  colorScheme="purple"
                  variant={"ghost"}
                  rounded={"none"}
                  size={"lg"}
                  _selected={{
                    color: "green.400",
                    borderBottom: "2px",
                    borderBottomColor: "green.4000",
                  }}
                  leftIcon={<HiBuildingOffice className="text-lg" />}
                >
                  Hostel
                </Tab>
                <Tab hidden>search</Tab>
              </HStack>

              <HStack mr={"2"}>
                <Menu size={"md"}>
                  <MenuButton
                    as={Button}
                    size={"sm"}
                    leftIcon={<BsFilter className={"text-xl"} />}
                    colorScheme={"gray"}
                    variant={"ghost"}
                  >
                    Filters
                  </MenuButton>
                  <MenuList shadow={"2xl"} zIndex={"dropdown"}>
                    <VStack px={"4"}>
                      <FormControl>
                        <Select onChange={(e) => setFilterType(e.target.value)}>
                          <option value={""}>Select Filter</option>
                          <option value={"ENQUIRY"}>By Enquiry Date</option>
                          <option value={"APPROVAL"}>By Approval Date</option>
                          <option value={"SOURCE"}>By source.</option>
                        </Select>
                      </FormControl>
                      {filterType && (
                        <>
                          <FormControl>
                            {filterType == "SOURCE" ? (
                              <>
                                <FormLabel>Source</FormLabel>
                                <Select
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
                                    <option
                                      key={value.value}
                                      value={value.value}
                                    >
                                      {value.option}
                                    </option>
                                  ))}
                                </Select>
                              </>
                            ) : filterType == "APPROVAL" ||
                              filterType == "ENQUIRY" ? (
                              <>
                                <FormLabel>Date</FormLabel>
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
                          </FormControl>
                          <FormControl>
                            <Button
                              as={Link}
                              href={`/dashboard/search/${new Date(
                                Date.now()
                              ).getTime()}/?type=${filterType}&date=${moment(
                                filterState.date
                              ).format("yyyy-MM-DD")}&source=${
                                filterState.source
                              }`}
                              colorScheme={"blue"}
                              onClick={() => {
                                //  navigation.refresh()
                              }}
                              rightIcon={
                                <AiOutlineSearch className={"text-lg"} />
                              }
                              w={"full"}
                            >
                              Search
                            </Button>
                          </FormControl>
                        </>
                      )}
                    </VStack>
                  </MenuList>
                </Menu>
                {user?.college === "MANAGEMENT" ? (
                  <MIFModal>
                    {({ onOpen }) => (
                      <Button
                        onClick={onOpen}
                        size={"sm"}
                        variant={"ghost"}
                        leftIcon={<AiOutlineSetting className="text-xl" />}
                      >
                        Manage Intake & Fee
                      </Button>
                    )}
                  </MIFModal>
                ) : null}

                {/* <AddCouncelAddmissionModel>
                  {({ onOpen }) => (
                    <Button
                      leftIcon={<AiOutlinePlusCircle className="text-lg" />}
                      onClick={onOpen}
                      size={"sm"}
                      colorScheme="facebook"
                    >
                      Add Enquiry
                    </Button>
                  )}
                </AddCouncelAddmissionModel> */}
              </HStack>
            </TabList>
            <TabPanels px={"0"} h={"full"}>
              <TabPanel p={"0"} w={"full"}>
                <HStack
                  className="bg-secondary"
                  px={"5"}
                  py={"3"}
                  borderBottom={"1px"}
                  borderColor={"gray.200"}
                  zIndex={"dropdown"}
                  w={"full"}
                  justifyContent={"space-between"}
                >
                  <HStack w={"full"}>
                    <Link href={"/dashboard/approved"}>
                      <Box
                        as={Tag}
                        colorScheme="gray"
                        size={"lg"}
                        _hover={{ textDecoration: "underline" }}
                      >
                        Overall
                      </Box>
                    </Link>
                    {college && (
                      <>
                        <AiOutlineArrowRight />
                        <Link href={"/dashboard/approved/" + college}>
                          <Box
                            as={Tag}
                            colorScheme="gray"
                            size={"lg"}
                            _hover={{ textDecoration: "underline" }}
                          >
                            {college}
                          </Box>
                        </Link>
                      </>
                    )}
                    {college && branch && (
                      <>
                        <AiOutlineArrowRight />
                        <Box
                          as={Tag}
                          colorScheme="gray"
                          size={"lg"}
                          _hover={{ textDecoration: "underline" }}
                        >
                          {branch}
                        </Box>
                      </>
                    )}
                  </HStack>
                  {college && branch && (
                    <>
                      <HStack px={3} w={"full"}>
                        <Tag gap={2} pl={0} variant={"outline"}>
                          <Tag colorScheme="gray" variant={"solid"}>
                            Intake
                          </Tag>
                          <TagLabel>{metaData[0]?.intake!}</TagLabel>
                        </Tag>
                        <Text>-</Text>
                        <Tag gap={2} pl={0} variant={"outline"}>
                          <Tag colorScheme="gray" variant={"solid"}>
                            Alloted
                          </Tag>
                          <TagLabel>{metaData[0]?.allotted!}</TagLabel>
                        </Tag>
                        <Text>=</Text>
                        <Tag gap={2} pl={0} variant={"outline"}>
                          <Tag colorScheme="gray" variant={"solid"}>
                            Remaining
                          </Tag>
                          <TagLabel>{metaData[0]?.remaining!}</TagLabel>
                        </Tag>
                      </HStack>
                      <HStack w={"full"} justifyContent={"end"}>
                        <Menu>
                          <MenuButton
                            as={Button}
                            colorScheme="gray"
                            variant={"ghost"}
                            size={"sm"}
                            leftIcon={
                              <FaFileDownload className="text-gray-700" />
                            }
                            rightIcon={<FaChevronDown />}
                          >
                            Export Data
                          </MenuButton>
                          <MenuList zIndex={"dropdown"}>
                            <MenuItem
                              as={Link}
                              target={"_blank"}
                              download
                              command="↗️"
                              href={
                                process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                                `dowloadclassexcel.php?college=${college}&branch=${branch}`
                              }
                              icon={
                                <AiOutlineFileExcel className="text-lg text-green-600" />
                              }
                            >
                              .Excel format
                            </MenuItem>
                            <MenuItem
                              as={Link}
                              target={"_blank"}
                              download
                              href={
                                process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                                `downloadclasspdf.php?college=${college}&branch=${branch}`
                              }
                              command="↗️"
                              icon={
                                <AiOutlineFilePdf className="text-lg text-rose-600" />
                              }
                            >
                              .Pdf format
                            </MenuItem>
                            <MenuItem
                              as={Link}
                              target={"_blank"}
                              download
                              href={
                                process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                                `downloadclasswithfee.php?college=${college}&branch=${branch}`
                              }
                              command="↗️"
                              icon={
                                <AiFillFilePdf className="text-lg text-rose-700" />
                              }
                            >
                              .Pdf format with <b>Fee</b> details
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </>
                  )}
                </HStack>
                <VStack h={"100vh"} overflow={"scroll"} w={"full"}>
                  {children}
                </VStack>
              </TabPanel>
              <TabPanel p={"0"} h={"full"}>
                {children}
              </TabPanel>
              <TabPanel p={"0"} h={"full"}>
                {children}
              </TabPanel>
              <TabPanel p={"0"}>
                <HStack
                  className="bg-secondary"
                  px={"5"}
                  py={"3"}
                  borderBottom={"1px"}
                  borderColor={"gray.200"}
                >
                  <HStack w={"full"}>
                    <Link href={"/dashboard/hostel"}>
                      <Box
                        as={Tag}
                        colorScheme="gray"
                        size={"lg"}
                        _hover={{ textDecoration: "underline" }}
                      >
                        Overall
                      </Box>
                    </Link>
                    {college && (
                      <>
                        <AiOutlineArrowRight />
                        <Link href={"/dashboard/hostel/" + college}>
                          <Box
                            as={Tag}
                            colorScheme="gray"
                            size={"lg"}
                            _hover={{ textDecoration: "underline" }}
                          >
                            {college}
                          </Box>
                        </Link>
                      </>
                    )}
                    {college && branch && (
                      <>
                        <AiOutlineArrowRight />
                        <Box
                          as={Tag}
                          colorScheme="gray"
                          size={"lg"}
                          _hover={{ textDecoration: "underline" }}
                        >
                          {branch}
                        </Box>
                      </>
                    )}
                  </HStack>
                  {/* <HStack>
                {college && branch && (
                  <>
                    <VStack px={3}>
                      <Heading
                        size={"sm"}
                        whiteSpace={"nowrap"}
                        fontWeight={"medium"}
                      >
                        Intake - Alloted = Remaining
                      </Heading>
                      {metaData.length > 0 && (
                        <Heading
                          size={"sm"}
                          whiteSpace={"nowrap"}
                          fontWeight={"medium"}
                        >
                          {metaData[0]?.intake!} - {metaData[0]?.allotted!} ={" "}
                          {metaData[0]?.remaining!}
                        </Heading>
                      )}
                    </VStack>
                    <Button
                      as={Link}
                      target={"_blank"}
                      download
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `dowloadclassexcel.php?college=${college}&branch=${branch}`
                      }
                      leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                      colorScheme={"green"}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Download Excel
                    </Button>
                    <Button
                      as={Link}
                      target={"_blank"}
                      download
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `downloadclasspdf.php?college=${college}&branch=${branch}`
                      }
                      leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                      colorScheme={"orange"}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Download PDF
                    </Button>
                    <Button
                      as={Link}
                      target={"_blank"}
                      download
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `downloadclasswithfee.php?college=${college}&branch=${branch}`
                      }
                      leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                      colorScheme={"purple"}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Download PDF With Fee Details
                    </Button>
                  </>
                )}
              </HStack> */}
                </HStack>
                <VStack h={"100vh"} overflow={"scroll"} w={"full"}>
                  {children}
                </VStack>
              </TabPanel>
              <TabPanel p={"0"} h={"full"}>
                {children}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
