import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchList,
  fetchSearchClass,
  fetchSelectedMatrix,
  SelectedMatrix,
  updateMatrix,
  updateSelectedMatrix,
} from "@/store/admissions.slice";
import {
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import IDrawer from "../ui/utils/IDrawer";
import { usePathname } from "next/navigation";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-hot-toast";
import IModal from "../ui/utils/IModal";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
  admissionno: string;
}

export default function ViewAdmissionDetailsModal({
  children,
  admissionno,
}: props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();
  const { isOpen, onClose, onOpen: onModalOpen } = useDisclosure();
  const selectedAdmissionDetails = useAppSelector(
    (state) => state.admissions.selectedMatrix.data
  ) as SelectedMatrix[];
  const isLoading = useAppSelector(
    (state) => state.admissions.selectedMatrix.pending
  ) as boolean;
  const branch_list = useAppSelector(
    (state) => state.admissions.branchlist.data
  ) as [];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const aspath = usePathname();

  useEffect(() => {
    selectedAdmissionDetails[0]?.admission_id == admissionno &&
      selectedAdmissionDetails[0]?.college &&
      dispatch(fetchBranchList({college:selectedAdmissionDetails[0].college}))
  }, [
    dispatch,
    selectedAdmissionDetails[0]?.admission_id,
    selectedAdmissionDetails[0]?.college,
    admissionno,
  ]);

  const onOpen = () => {
    onModalOpen();
    dispatch(fetchSelectedMatrix({ admissionno }));
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("admissionno", selectedAdmissionDetails[0].admission_id);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "deletestudent.php",
        method: "POST",
        data: formData,
      });
      dispatch(
        fetchSearchClass({
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
    dispatch(
      updateSelectedMatrix({
        remaining_amount: (
          parseInt(selectedAdmissionDetails[0]?.fee_fixed) -
          parseInt(selectedAdmissionDetails[0]?.fee_paid)
        ).toString(),
      })
    );
  }, [
    // eslint-disable-line
    selectedAdmissionDetails[0]?.fee_fixed, // eslint-disable-line
    selectedAdmissionDetails[0]?.fee_paid, // eslint-disable-line
    isOpen,
    dispatch,
  ]); // eslint-disable-line

  const onsubmit = async () => {
    await dispatch(updateMatrix());
    router.replace(aspath);
  };

  return (
    <>
      <IDrawer
        isLoading={isLoading}
        isDisabled={isLoading}
        onSubmit={onsubmit}
        buttonTitle="Save"
        onClose={() => {
          onClose();
        }}
        isOpen={isOpen}
        heading="Admission Details"
      >
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
            <Input
              w={"60%"}
              isReadOnly
              variant={"outline"}
              bg={"white"}
              type={"date"}
              value={selectedAdmissionDetails[0]?.enquiry_date}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ name: e.target.value })); // eslint-disable-line
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
                dispatch(updateSelectedMatrix({ name: e.target.value })); // eslint-disable-line
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
              <option value={""}>Select College</option>
              <option value={"KSIT"}>KSIT</option>
              <option value={"KSPT"}>KSPT</option>
              <option value={"KSPU"}>KSPU</option>
              <option value={"KSSA"}>KSSA</option>
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
            <Select
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.branch}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ branch: e.target.value }));
              }}
            >
              <option value={""}>Select Branch</option>
              {branch_list.map((branch: any) => {
                return (
                  <option key={branch.value} value={branch.value}>
                    {branch.option}
                  </option>
                );
              })}
            </Select>
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
                Management Fee
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              type={"number"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.fee_quoted}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ fee_fixed: e.target.value }));
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
                Quoted by
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              type={"text"}
              variant={"outline"}
              isReadOnly
              bg={"white"}
              value={selectedAdmissionDetails[0]?.quoted_by}
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
                Fee Fixed
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              type={"number"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.fee_fixed}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ fee_fixed: e.target.value }));
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
              min={0}
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
            <Input
              isReadOnly
              w={"60%"}
              type={"date"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.paid_date}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ paid_date: e.target.value }));
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
                Remaining Fee
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              isReadOnly
              type={"number"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.remaining_amount}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(
                  updateSelectedMatrix({ remaining_amount: e.target.value })
                );
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
                Due Date
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              type={"date"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.due_date}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ due_date: e.target.value }));
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
                Approved By
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              readOnly
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.approved_by}
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
                Approved Date
              </Heading>
            </VStack>
            <Input
              w={"60%"}
              readOnly
              variant={"outline"}
              bg={"white"}
              type="date"
              value={selectedAdmissionDetails[0]?.approved_date}
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
                Remarks
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
            pb={"5"}
          >
            <VStack flex={"1"} alignItems={"start"}>
              <Heading fontSize={"sm"} fontWeight={"medium"}>
                Status
              </Heading>
            </VStack>
            <Input
              isReadOnly
              w={"60%"}
              variant={"outline"}
              bg={"white"}
              value={selectedAdmissionDetails[0]?.status}
              className={"shadow-md shadow-lightBrand"}
              onChange={(e) => {
                dispatch(updateSelectedMatrix({ remarks: e.target.value }));
              }}
            />
          </Flex>
          <HStack
            zIndex={"sticky"}
            position={"sticky"}
            bottom={"0"}
            py={"2"}
            w={"full"}
            className={"border-t border-t-lightgray bg-primary"}
          >
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
          </HStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
