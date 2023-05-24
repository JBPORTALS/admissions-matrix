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
import { Link } from "@chakra-ui/next-js";
import {
  AiOutlineArrowRight,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloudDownload,
  AiOutlineFieldTime,
  AiOutlineFilePdf,
  AiOutlineFilter,
  AiOutlineHistory,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlinePlusCircle,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
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
import { useParams } from "next/navigation";
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

  const [ubranch, setBranch] = useState<string | undefined>("");
  const [ucollege, setCollege] = useState<string | undefined>("");
  const [hcollege, setHCollege] = useState<string | undefined>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterState, setFilterState] = useState<{
    source: string;
    date: Date | null;
  }>({
    source: "",
    date: new Date(),
  });
  const [adno, setAdno] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [branchList, setBranchList] = useState<[]>([]);

  const data = useAppSelector(
    (state) => state.admissions.unapproved_matrix.data
  ) as [];
  const Error = useAppSelector(
    (state) => state.admissions.unapproved_matrix.error
  ) as [];
  const sdata = useAppSelector(
    (state) => state.admissions.seat_matrix.data
  ) as [];
  const sError = useAppSelector(
    (state) => state.admissions.seat_matrix.error
  ) as [];
  const selectedMatrixError = useAppSelector(
    (state) => state.admissions.selectedMatrix.error
  ) as string | null;
  const dispatch = useAppDispatch();
  const metaData = useAppSelector(
    (state) => state.admissions.search_class.data
  ) as { remaining: string; intake: string; allotted: string }[];

  useEffect(() => {
    if (ucollege !== undefined)
      dispatch(fetchBranchList({ college: ucollege })).then((value: any) => {
        setBranchList(value.payload);
      });
    setBranch("");
  }, [ucollege, dispatch]);

  useEffect(() => {
    if (hcollege !== undefined) dispatch(fetchHistory({ college: hcollege }));
  }, [hcollege, dispatch]);

  useEffect(() => {
    ucollege &&
      ubranch &&
      dispatch(
        fetchUnApprovedAdmissions({
          college: ucollege,
          branch: ubranch,
        })
      );
  }, [ucollege, ubranch, dispatch]);

  const { user, supabase } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Input
            onChange={(e) => setAdno(e.target.value)}
            value={adno}
            size={"sm"}
            variant={"filled"}
            w={"72"}
            type={"number"}
            placeholder="Search admission no."
          />
          <ViewAdmissionDetailsModal admissionno={adno!}>
            {({ onOpen }) => (
              <ViewUnApprovedAdmModal admissionno={adno!}>
                {({ onOpen: onUnapprovedOpen }) => (
                  <IconButton
                    isLoading={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const formData = new FormData();
                        formData.append("admissionno", adno);
                        const response = await axios({
                          url:
                            process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                            "searchbyid.php",
                          method: "POST",
                          data: formData,
                        });

                        const resData = response.data.status as
                          | "APPROVED"
                          | "NOT APPROVED";
                        if (resData == "APPROVED" && !selectedMatrixError)
                          onOpen();
                        else if (
                          resData == "NOT APPROVED" &&
                          !selectedMatrixError
                        )
                          onUnapprovedOpen();
                        else
                          toast.error("No record found !", {
                            position: "top-right",
                          });
                      } catch (e: any) {
                        toast.error(e.response.data?.msg, {
                          position: "top-right",
                        });
                      }
                      setIsLoading(false);
                    }}
                    colorScheme="facebook"
                    size={"sm"}
                    aria-label="search"
                    icon={<AiOutlineSearch className="text-lg" />}
                  />
                )}
              </ViewUnApprovedAdmModal>
            )}
          </ViewAdmissionDetailsModal>
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
        mt={"14"}
        size={"sm"}
        variant={"line"}
        h={"92vh"}
        w={"full"}
        px={"0"}
      >
        <TabList className="px-5" justifyContent={"space-between"}>
          <HStack>
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
                <Link href={"/dashboard"}>
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
                    <Link href={"/dashboard/" + college}>
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
                        `dowloadclassexcel.php?college=${ucollege}&branch=${ubranch}`
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
                  </>
                )}
              </HStack>
            </HStack>
            <VStack h={"100vh"} overflow={"scroll"} w={"full"}>
              {children}
            </VStack>
          </TabPanel>
          <TabPanel p={"0"} h={"full"}>
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
                {ucollege ? (
                  <ISelect
                    placeHolder="Select Branch"
                    value={ubranch}
                    onChange={(value) => setBranch(value)}
                    options={branchList}
                  />
                ) : null}
              </HStack>
              <HStack>
                {/* <Button
                  as={Link}
                  target={"_blank"}
                  download
                  href={
                    process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                    `downloadenquiryclassexcel.php?college=${college}&branch=${branch}`
                  }
                  leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                  colorScheme={"green"}
                  variant={"outline"}
                  size={"sm"}
                >
                  Download Excel
                </Button> */}
                {ucollege && ubranch && (
                  <Button
                    as={Link}
                    target={"_blank"}
                    download
                    href={
                      process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                      `downloadenquiryclasspdf.php?college=${ucollege}&branch=${ubranch}`
                    }
                    leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                    colorScheme={"orange"}
                    variant={"outline"}
                    size={"sm"}
                  >
                    Download PDF
                  </Button>
                )}
              </HStack>
            </HStack>
            <VStack className="w-full h-full" spacing={0}>
              {!ucollege ? (
                <InfoCard message="Select College" />
              ) : ucollege && !ubranch ? (
                <InfoCard message="Select Branch" />
              ) : null}
              <VStack
                spacing={0}
                className={
                  "justify-start h-[91vh] items-start flex w-full overflow-scroll"
                }
              >
                {/* displaying admin childrens */}
                {ubranch && ucollege && data.length > 0 ? (
                  <AgGridReact
                    alwaysShowHorizontalScroll
                    animateRows={true}
                    className="w-full h-full pb-20 ag-theme-material"
                    rowData={data as any}
                    columnDefs={UnAprrovedColumns as any}
                  />
                ) : ubranch && ucollege && data.length == 0 ? (
                  <Center h={"80%"}>
                    <Heading size={"lg"}>{Error}</Heading>
                  </Center>
                ) : null}
              </VStack>
            </VStack>
          </TabPanel>
          <TabPanel p={"0"} h={"full"}>
            <HStack
              justifyContent={"space-between"}
              className="w-full flex border-b py-2 space-x-3 px-5"
            >
              <HStack justify={"space-between"} w={"full"}>
                <ISelect
                  placeHolder="Select College"
                  value={hcollege}
                  onChange={(value) => setHCollege(value)}
                  options={[
                    { value: "KSIT", option: "KSIT" },
                    { value: "KSPT", option: "KSPT" },
                    { value: "KSPU", option: "KSPU" },
                    { value: "KSSA", option: "KSSA" },
                    { value: "KSSEM", option: "KSSEM" },
                  ]}
                />
              </HStack>
              {hcollege && (
                <Button
                  as={Link}
                  target="_blank"
                  href={
                    process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                    "seatmatrixdownload.php?college=" +
                    hcollege
                  }
                  size={"sm"}
                  colorScheme="teal"
                  leftIcon={<AiOutlineFilePdf className="text-2xl" />}
                  variant={"ghost"}
                >
                  Download Matrix
                </Button>
              )}
            </HStack>
            <VStack className="w-full h-full" spacing={0}>
              {!hcollege ? <InfoCard message="Select College" /> : null}
              <VStack
                spacing={0}
                px={"10"}
                className={
                  "justify-start h-fit items-start flex w-full overflow-scroll"
                }
              >
                {/* displaying admin childrens */}
                {hcollege && sdata.length > 0 ? (
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
                            Seat Matrix on{" "}
                            {moment(history.date).format("MMM DD, YYYY")}
                          </h3>
                          <StatGroup
                            width={"50%"}
                            px={"0"}
                          >
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
                                    <StatUpArrow type="increase" /> Got
                                    increased
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
                ) : hcollege && data.length == 0 ? (
                  <Center h={"80%"}>
                    <Heading size={"lg"}>{Error}</Heading>
                  </Center>
                ) : null}
              </VStack>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
