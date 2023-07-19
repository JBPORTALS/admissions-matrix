"use client";
import {
  Avatar,
  Box,
  Button,
  Center,
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
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatUpArrow,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  AiOutlineArrowRight,
  AiOutlineBuild,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloudDownload,
  AiOutlineFieldTime,
  AiOutlineFilePdf,
  AiOutlineFilter,
  AiOutlineHistory,
  AiOutlineLine,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlinePlusCircle,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { HiBuildingOffice } from "react-icons/hi2";
import ISelect from "../ui/utils/ISelect";
import { InfoCard } from "../ui/utils/InfoCard";
import { UnAprrovedColumns } from "../mock-data/admission-meta";
import { AgGridReact } from "ag-grid-react";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchList,
  fetchHistory,
  fetchUnApprovedAdmissions,
} from "@/store/admissions.slice";
import { useParams, usePathname, useRouter } from "next/navigation";
import AddCouncelAddmissionModel from "../modals/AddCouncelAdmissionModal";
import { useSupabase } from "@/app/supabase-provider";
import ViewAdmissionDetailsModal from "../drawers/ViewAdmissionDetailsModal";
import ViewUnApprovedAdmModal from "../drawers/ViewUnApprovedAdmModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AttendanceLayoutProps {
  children: React.ReactNode;
  showDownloadFile?: boolean;
}

export default function AdmissionLayout({ children }: AttendanceLayoutProps) {
  const router = useParams();

  const { college, branch } = router;

  const [hcollege, setHCollege] = useState<string | undefined>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterState, setFilterState] = useState<{
    source: string;
    date: Date | null;
  }>({
    source: "",
    date: new Date(),
  });
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const metaData = useAppSelector(
    (state) => state.admissions.search_class.data
  ) as { remaining: string; intake: string; allotted: string }[];

  const pathname = usePathname();

  useEffect(() => {
    if (hcollege !== undefined) dispatch(fetchHistory({ college: hcollege }));
  }, [hcollege, dispatch]);

  const { user, supabase } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navRouter = useRouter();

  return (
    <div className="bg-primary z-20 relative overflow-hidden w-full  h-full flex flex-col">
      <HStack
        w={"full"}
        position={"fixed"}
        top={"0"}
        left={"0"}
        px={"5"}
        justifyContent={"space-between"}
        h={"14"}
        bg={"whiteAlpha.100"}
        className="border-b border-b-lightgray backdrop-blur-sm"
      >
        <HStack color={"blue.600"}>
          <AiOutlineUsergroupAdd className="text-3xl" />
          <Heading size={"md"}>KSGI Admission Matrix</Heading>
        </HStack>
        <HStack>
          <InputGroup>
            <Input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              size={"md"}
              w={"96"}
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
                isLoading={isLoading}
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

        <HStack position={"relative"}>
          <HStack>
            <Heading size={"md"}>{user?.username}</Heading>
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
                    {user?.username}
                  </Heading>
                </HStack>
                <HStack spacing={"3"} py={"2"}>
                  <AiOutlineMail className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.email}
                  </Heading>
                </HStack>
                <HStack spacing={"3"} py={"2"}>
                  <AiOutlineFieldTime className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {moment(user?.last_login_at).format("MMMM Do YYYY, h:mm a")}
                  </Heading>
                </HStack>
                <HStack spacing={"3"} py={"2"}>
                  <Button
                    leftIcon={<AiOutlineLogout />}
                    onClick={async () => {
                      await supabase
                        .from("profiles")
                        .update({ last_login_at: new Date(Date.now()) })
                        .eq("id", user?.session?.user.id);
                      await supabase.auth.signOut();
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
        mt={"14"}
        size={"sm"}
        variant={"line"}
        h={"92vh"}
        w={"full"}
        px={"0"}
      >
        <TabList className="px-5" justifyContent={"space-between"}>
          <HStack>
            <Link href={"/dashboard/approved"}>
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
            </Link>
            <Link href={"/dashboard/un-approved"}>
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
            </Link>
            <Link href={"/dashboard/history"}>
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
            </Link>
            <Link href={"/dashboard/search"}>
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
            </Link>
            <Tab hidden>search</Tab>
          </HStack>
          <HStack mr={"2"}>
            <Menu size={"md"}>
              <MenuButton position={"relative"} zIndex={"0"}>
                <Button
                  as={"view"}
                  size={"sm"}
                  shadow={"md"}
                  leftIcon={<AiOutlineFilter className={"text-xl"} />}
                  colorScheme={"teal"}
                  position={"relative"}
                  z={-1}
                >
                  Filter
                </Button>
              </MenuButton>
              <MenuList
                shadow={"2xl"}
                position={"absolute"}
                zIndex={"dropdown"}
              >
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
                                <option key={value.value} value={value.value}>
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
                                setFilterState((prev) => ({ ...prev, date }));
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
                          ).format("yyyy-MM-DD")}&source=${filterState.source}`}
                          colorScheme={"blue"}
                          onClick={() => {
                            //  navigation.refresh()
                          }}
                          rightIcon={<AiOutlineSearch className={"text-lg"} />}
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
            <AddCouncelAddmissionModel>
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
            </AddCouncelAddmissionModel>
          </HStack>
        </TabList>
        <TabPanels px={"0"} h={"full"}>
          <TabPanel p={"0"} h={"100vh"}>
            <HStack
              className="bg-secondary"
              px={"5"}
              py={"3"}
              borderBottom={"1px"}
              borderColor={"gray.200"}
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
              <HStack>
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
              </HStack>
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
  );
}
