import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchFeeQouted,
  fetchSelectedMatrix,
  fetchUnApprovedAdmissions,
  SelectedMatrix,
  updateEnquiry,
  updateSelectedMatrix,
  updateToApprove,
} from "@/store/admissions.slice";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import IDrawer from "../ui/utils/IDrawer";
import IModal from "../ui/utils/IModal";
import { useSupabase } from "@/app/supabase-provider";
import { AiOutlineDelete, AiOutlineDownload } from "react-icons/ai";
import { toast } from "react-hot-toast";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { Link } from "@chakra-ui/next-js";
import { trpc } from "@/utils/trpc-cleint";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
  admissionno: string;
}

export const exams = [
  {
    option: "CET",
    value: "CET",
  },
  {
    option: "COMEDK",
    value: "COMEDK",
  },
  {
    option: "CET AND COMEDK",
    value: "CET AND COMEDK",
  },
  {
    option: "DCET",
    value: "DCET",
  },
  {
    option: "JEE (M)",
    value: "JEE (M)",
  },
  {
    option: "NATA",
    value: "NATA",
  },
  {
    option: "OTHERS",
    value: "OTHERS",
  },
  {
    option: "NONE",
    value: "NONE",
  },
];

export default function ViewUnApprovedAdmModal({
  children,
  admissionno,
}: props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onClose, onOpen: onModalOpen } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();
  const {
    isOpen: isConfirm,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const selectedAdmissionDetails = useAppSelector(
    (state) => state.admissions.selectedMatrix.data
  ) as SelectedMatrix[];
  const isUpdating = useAppSelector(
    (state) => state.admissions.selectedMatrix.pending
  ) as boolean;
  const isLoading = useAppSelector(
    (state) => state.admissions.update_approve.pending
  ) as boolean;
  const isError = useAppSelector(
    (state) => state.admissions.update_approve.error
  );
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const fee = useAppSelector((state) => state.admissions.fee) as
    | string
    | undefined;
  const { data: branch_list } = trpc.retrieveBranchList.useQuery(
    {
      college: selectedAdmissionDetails[0]?.college,
      acadYear,
    },
    {
      enabled: isOpen && !!selectedAdmissionDetails[0]?.college,
    }
  );
  const dispatch = useAppDispatch();
  const { user } = useSupabase();
  const [state, setState] = useState({
    fee_quoted: selectedAdmissionDetails[0]?.fee_quoted,
    fee_fixed: selectedAdmissionDetails[0]?.fee_fixed,
  });

  let intialRender = true;

  useEffect(() => {
    if (isOpen) {
      console.log("triggered");
      setState({
        fee_fixed: selectedAdmissionDetails[0]?.fee_fixed,
        fee_quoted: selectedAdmissionDetails[0]?.fee_quoted,
      });
      intialRender = false;
    }
  }, [
    isOpen,
    selectedAdmissionDetails[0]?.fee_fixed,
    selectedAdmissionDetails[0]?.fee_quoted,
  ]);

  useEffect(() => {
    if (
      isOpen &&
      selectedAdmissionDetails[0]?.admission_id == admissionno &&
      intialRender
    ) {
      dispatch(
        fetchFeeQouted({
          college: selectedAdmissionDetails[0]?.college,
          branch: selectedAdmissionDetails[0]?.branch,
        })
      ).then((action) => {
        setState({
          fee_fixed: fee as string,
          fee_quoted: fee as string,
        });
      });
    }
  }, [
    selectedAdmissionDetails[0]?.college,
    selectedAdmissionDetails[0]?.branch,
    selectedAdmissionDetails[0]?.admission_id,
    fee,
    dispatch,
    isOpen,
    intialRender,
  ]);

  useEffect(() => {
    if (
      isOpen &&
      selectedAdmissionDetails[0]?.admission_id == admissionno &&
      intialRender
    ) {
      dispatch(updateSelectedMatrix({ branch: "" }));
    }
  }, [
    dispatch,
    isOpen,
    selectedAdmissionDetails[0]?.admission_id,
    selectedAdmissionDetails[0]?.college,
  ]);

  const onOpen = () => {
    onModalOpen();
    dispatch(fetchSelectedMatrix({ admissionno }));
  };

  let render = 0;

  // useEffect(() => {
  //   render++;
  //   selectedAdmissionDetails[0]?.admission_id == admissionno &&
  //     selectedAdmissionDetails[0]?.college &&
  //     intialRender &&
  //     isOpen &&
  //     dispatch(
  //       fetchBranchList({ college: selectedAdmissionDetails[0]?.college })
  //     );

  //   render++;

  //   () => render++;
  // }, [
  //   dispatch,
  //   selectedAdmissionDetails[0]?.admission_id,
  //   selectedAdmissionDetails[0]?.college,
  //   admissionno,
  //   isOpen,
  //   intialRender,
  // ]);

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("admissionno", selectedAdmissionDetails[0]?.admission_id);
      formData.append("user_college", user?.college!);
      formData.append("acadyear", acadYear);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "deletestudent.php",
        method: "POST",
        data: formData,
      });
      dispatch(
        fetchUnApprovedAdmissions({
          college: selectedAdmissionDetails[0].college,
          branch: selectedAdmissionDetails[0].branch,
        })
      );
      toast.success(response.data?.msg, { position: "top-right" });
    } catch (e: any) {
      toast.error(e.response?.data?.msg, { position: "top-right" });
    }
    setIsDeleting(false);
  };

  useEffect(() => {
    isOpen &&
      selectedAdmissionDetails[0]?.admission_id == admissionno &&
      dispatch(
        updateSelectedMatrix({
          total: (
            parseInt(state.fee_fixed) -
            parseInt(selectedAdmissionDetails[0]?.fee_paid)
          ).toString(),
        })
      );
  }, [
    // eslint-disable-line
    state.fee_fixed, // eslint-disable-line
    selectedAdmissionDetails[0]?.fee_paid, // eslint-disable-line
    dispatch, // eslint-disable-line
    selectedAdmissionDetails[0]?.admission_id,
    admissionno,
    isOpen,
  ]); // eslint-disable-line

  const onsubmit = async () => {
    await dispatch(
      updateToApprove({
        username: user?.fullname!,
        fee_fixed: state.fee_fixed,
        fee_quoted: state.fee_quoted,
        user_college: user?.college!,
      })
    );
    if (!isError) onClose();
  };

  return (
    <>
      <IDrawer
        isLoading={isLoading}
        isDisabled={isLoading}
        onSubmit={onConfirmOpen}
        buttonTitle="Approve"
        onClose={() => {
          onClose();
        }}
        isOpen={isOpen}
        heading="Approve Enquiry"
      >
        <IModal
          onSubmit={onsubmit}
          buttonTitle="Yes"
          heading="Are you sure ?"
          isOpen={isConfirm}
          onClose={onConfirmClose}
        >
          <Center py={"3"}>
            <Heading size={"md"} fontWeight={"medium"}>
              You want to approve the
            </Heading>
            <Heading size={"md"} ml={"2"}>
              {selectedAdmissionDetails[0]?.name}(
              {selectedAdmissionDetails[0]?.admission_id})
            </Heading>
          </Center>
        </IModal>
        <VStack w={"full"} h={"full"} px={"5"} spacing={"3"} py={"5"}>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Application No.
              </Heading>
            </VStack>
            <Input
              isReadOnly
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.admission_id}
              className={"shadow-md shadow-lightBrand"}
            />
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Enquiry Date
              </Heading>
            </VStack>
            {selectedAdmissionDetails[0]?.enquiry_date && (
              <Box w={"60%"}>
                <ReactDatePicker
                  className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                  selected={
                    selectedAdmissionDetails[0]?.enquiry_date.toString() ==
                    "0000-00-00"
                      ? new Date()
                      : new Date(selectedAdmissionDetails[0]?.enquiry_date)
                  }
                  dateFormat={"dd/MM/yyyy"}
                  onChange={(date) => {
                    dispatch(updateSelectedMatrix({ enquiry_date: date }));
                  }}
                />
              </Box>
            )}
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Register Number
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.reg_no}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ reg_no: e.target.value }));
              }}
            />
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Name
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.name}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ name: e.target.value }));
              }}
            />
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Student Phone No.
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.phone_no}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ phone_no: e.target.value }));
              }}
            />
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Overall Percentage / CGPA
              </Heading>
            </VStack>
            <InputGroup w={"60%"} className={"shadow-md shadow-lightBrand"}>
              <Input
                variant={"outline"}
                bg={"white"}
                type="number"
                value={parseFloat(
                  selectedAdmissionDetails[0]?.percentage
                ).toString()}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({
                      percentage:
                        e.target.value == ""
                          ? 0
                          : parseInt(e.target.value) > 100
                          ? Math.trunc(100)
                          : parseFloat(e.target.value),
                    })
                  );
                }}
              />
              <InputRightAddon fontSize={"lg"} fontWeight={"bold"}>
                %
              </InputRightAddon>
            </InputGroup>
          </Flex>
          {selectedAdmissionDetails[0]?.course === "ENGINEERING" && (
            <>
              <Flex
                className="w-full justify-between"
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <VStack flex={"1"} alignItems={"start"}>
                  <Heading fontSize={"sm"} fontWeight={"medium"}>
                    PCM Aggregate
                  </Heading>
                </VStack>
                <InputGroup w={"60%"} className={"shadow-md shadow-lightBrand"}>
                  <Input
                    variant={"outline"}
                    bg={"white"}
                    type="number"
                    value={parseFloat(
                      selectedAdmissionDetails[0]?.pcm
                    ).toString()}
                    onChange={(e) => {
                      dispatch(
                        updateSelectedMatrix({
                          pcm:
                            e.target.value == ""
                              ? 0
                              : parseInt(e.target.value) > 100
                              ? Math.trunc(100)
                              : parseFloat(e.target.value),
                        })
                      );
                    }}
                  />
                  <InputRightAddon fontSize={"lg"} fontWeight={"bold"}>
                    %
                  </InputRightAddon>
                </InputGroup>
              </Flex>
            </>
          )}

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                College
              </Heading>
            </VStack>
            <Select
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.college}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ college: e.target.value }));
              }}
            >
              <option value={""} disabled selected>
                Select College
              </option>
              <option value={"KSIT"}>KSIT</option>
              <option value={"KSPT"}>KSPT</option>
              <option value={"KSPU"}>KSPU</option>
              <option value={"KSDC"}>KSDC</option>
              <option value={"KSSEM"}>KSSEM</option>
            </Select>
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Branch
              </Heading>
            </VStack>
            <FormControl
              w={"60%"}
              isInvalid={!selectedAdmissionDetails[0]?.branch}
            >
              <Select
                w={"full"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.branch}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ branch: e.target.value }));
                }}
              >
                <option value={""}>Select Branch</option>
                {branch_list &&
                  branch_list.map((branch: any) => {
                    return (
                      <option key={branch.value} value={branch.value}>
                        {branch.option}
                      </option>
                    );
                  })}
              </Select>
              {selectedAdmissionDetails[0]?.branch == "" && (
                <FormErrorMessage>Branch is required !</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Father Name
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.father_name}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ father_name: e.target.value }));
              }}
            />
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Father Mobile No.
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.father_no}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ father_no: e.target.value }));
              }}
            />
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Mother Name
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.mother_name}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ mother_name: e.target.value }));
              }}
            />
          </Flex>
          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Mother Mobile No.
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.mother_no}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ mother_no: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                E-Mail
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.email}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ email: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Exam
              </Heading>
            </VStack>
            <Select
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.exam}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ exam: e.target.value }));
              }}
            >
              <option value={""}>Select Exam</option>
              {exams.map((option, key) => (
                <option key={key + option.value} value={option.value}>
                  {option.option}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Rank
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.rank}
              className={"shadow-md shadow-lightBrand"}
              type={"number"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ rank: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Management Fee
              </Heading>
            </VStack>
            <Input
              isReadOnly
              w={"60%"}
              type={"number"}
              variant={"outline"}
              bg={"white"}
              value={state.fee_quoted}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                setState((prev) => ({ ...prev, fee_quoted: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Fee Fixed
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              type={"number"}
              variant={"outline"}
              bg={"white"}
              value={state.fee_fixed}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                setState((prev) => ({ ...prev, fee_fixed: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Fee Paid
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              type={"number"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.fee_paid}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ fee_paid: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Fee Paid Date
              </Heading>
            </VStack>
            {selectedAdmissionDetails[0]?.paid_date && (
              <Box w={"60%"}>
                <ReactDatePicker
                  className="px-3 flex justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                  selected={
                    selectedAdmissionDetails[0]?.paid_date == "0000-00-00"
                      ? new Date(Date.now())
                      : new Date(selectedAdmissionDetails[0]?.paid_date)
                  }
                  dateFormat={"dd/MM/yyyy"}
                  onChange={(date) => {
                    dispatch(
                      updateSelectedMatrix({
                        paid_date: moment(date).format("yyyy-MM-DD"),
                      })
                    );
                  }}
                />
              </Box>
            )}
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Mode / Remarks
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.remarks}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ remarks: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Total Remaining Fee
              </Heading>
            </VStack>
            <Input
              isReadOnly
              w={"60%"}
              type={"number"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.total || 0}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {}}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Due Date
              </Heading>
            </VStack>
            {selectedAdmissionDetails[0]?.due_date && (
              <Box w={"60%"}>
                <ReactDatePicker
                  className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                  selected={
                    selectedAdmissionDetails[0]?.due_date.toString() ==
                      "0000-00-00" ||
                    selectedAdmissionDetails[0]?.due_date.toString() ==
                      "Invalid Date"
                      ? new Date(Date.now())
                      : new Date(selectedAdmissionDetails[0]?.due_date)
                  }
                  dateFormat={"dd/MM/yyyy"}
                  onChange={(date) => {
                    dispatch(
                      updateSelectedMatrix({
                        due_date: moment(date).format("yyyy-MM-DD"),
                      })
                    );
                  }}
                />
              </Box>
            )}
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Reffered By
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.referred_by}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ referred_by: e.target.value }));
              }}
            />
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Hostel
              </Heading>
            </VStack>
            <FormControl
              w={"60%"}
              isInvalid={!selectedAdmissionDetails[0]?.hostel}
            >
              <Select
                w={"full"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.hostel}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ hostel: e.target.value }));
                }}
              >
                <option value={"NO"}>NO</option>
                <option value={"YES"}>YES</option>
              </Select>
              {selectedAdmissionDetails[0]?.branch == "" && (
                <FormErrorMessage>Branch is required !</FormErrorMessage>
              )}
            </FormControl>
          </Flex>

          <Flex
            className="w-full justify-between"
            justifyContent={"space-between"}
            alignItems={"center"}
            pb={"5"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Status
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.status}
              className={"shadow-md shadow-lightBrand"}
            />
          </Flex>

          <VStack w={"full"}>
            <Heading
              fontSize={"sm"}
              w={"full"}
              className="w-3/4"
              fontWeight={"medium"}
            >
              Counselled & Quoted By
            </Heading>
            <Textarea
              w={"full"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.counselled_quoted_by ?? ""}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(
                  updateSelectedMatrix({ counselled_quoted_by: e.target.value })
                );
              }}
            />
          </VStack>

          <VStack
            zIndex={"sticky"}
            position={"sticky"}
            bottom={"0"}
            py={"2"}
            w={"full"}
            className={"border-t border-t-lightgray backdrop-blur-md"}
          >
            {parseInt(selectedAdmissionDetails[0]?.total) < 0 && (
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize={"small"}>Warning !</AlertTitle>
                  <AlertDescription fontSize={"smaller"}>
                    Remaining Amount is less than zero. You still may continue
                    to save the changes.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
            <HStack w={"full"}>
              <Button
                as={Link}
                target={"_blank"}
                download
                href={
                  process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                  `searchenquiry.php?id=${selectedAdmissionDetails[0]?.admission_id}&acadyear=${acadYear}`
                }
                colorScheme={"teal"}
                w={"full"}
                leftIcon={<AiOutlineDownload className="text-xl" />}
              >
                Download Enquiry
              </Button>
            </HStack>
            <HStack w={"full"}>
              <IModal
                heading="Are you sure ?"
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                colorBtn="red"
                onSubmit={() => {
                  onDelete();
                  onDeleteClose();
                }}
                buttonTitle="Yes"
              >
                <VStack py={"5"}>
                  <Heading size={"md"} fontWeight={"medium"}>
                    You want to delete this record
                  </Heading>
                  <Heading size={"md"} fontWeight={"sm"} color={"gray.600"}>
                    {"This action can't be undo"}
                  </Heading>
                </VStack>
              </IModal>
              <Button
                isLoading={isDeleting}
                onClick={onDeleteOpen}
                leftIcon={<AiOutlineDelete />}
                colorScheme={"red"}
                w={"full"}
              >
                Delete
              </Button>
              <Button
                isLoading={isUpdating}
                onClick={() =>
                  dispatch(
                    updateEnquiry({
                      username: user?.fullname!,
                      fee_fixed: state.fee_fixed,
                      fee_quoted: state.fee_quoted,
                      user_college: user?.college!,
                    })
                  )
                }
                colorScheme={"purple"}
                w={"full"}
              >
                Update Details
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
