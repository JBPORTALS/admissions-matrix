"use client";
import {
  MdCheckCircle,
  MdCheckCircleOutline,
  MdHistory,
  MdOutlineAdd,
  MdOutlineHistory,
} from "react-icons/md";
import NavButton from "./ui/utils/NavButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Field,
  Heading,
  Portal,
  Select,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { IoMdClock } from "react-icons/io";
import { useAppSelector } from "@/store";
import { useAppDispatch } from "@/hooks";
import { updateAcadYear } from "@/store/admissions.slice";
import { useRouter } from "next/navigation";
import { ACADYEARS } from "@/utils/constants";
import CheckStudentDetails from "./modals/CheckStudentDetails";
import { toast } from "react-hot-toast";

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const acadYear = useAppSelector((state) => state.admissions.acadYear);

  return (
    <VStack
      w={"2xs"}
      p={"4"}
      h={"full"}
      borderRightColor={"border"}
      borderRightWidth={"1px"}
      alignItems={"start"}
    >
      <NavButton asChild active={pathname.startsWith("/dashboard/approved")}>
        <Link href={"/dashboard/approved"}>
          {pathname.startsWith("/dashboard/approved") ? (
            <MdCheckCircle />
          ) : (
            <MdCheckCircleOutline />
          )}
          Approved
        </Link>
      </NavButton>
      <NavButton asChild active={pathname.startsWith("/dashboard/un-approved")}>
        <Link href={"/dashboard/un-approved"}>
          {pathname.startsWith("/dashboard/un-approved") ? (
            <IoMdClock />
          ) : (
            <IoMdClock />
          )}
          Un-Approved
        </Link>
      </NavButton>
      <NavButton asChild active={pathname.startsWith("/dashboard/history")}>
        <Link href={"/dashboard/history"}>
          {pathname.startsWith("/dashboard/history") ? (
            <MdHistory />
          ) : (
            <MdOutlineHistory />
          )}
          History
        </Link>
      </NavButton>
      <Separator />
      <Heading fontSize={"xs"} color={"fg.muted"}>
        ENQUIRY
      </Heading>
      <CheckStudentDetails>
        <Button
          rounded={"full"}
          colorPalette={"black"}
          size={"md"}
          width={"full"}
        >
          <MdOutlineAdd />
          New Enquiry
        </Button>
      </CheckStudentDetails>
      <Separator />
      <Heading fontSize={"xs"} color={"fg.muted"}>
        ACADEMIC YEAR
      </Heading>
      <Field.Root>
        <Select.Root
          value={[acadYear]}
          onValueChange={(e) => {
            dispatch(updateAcadYear(e.value));
            toast.success(`Academic year changed to "${e.value}"`);
            router.push("/dashboard");
          }}
          rounded={"full"}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select Academic Year" />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {ACADYEARS.map((option) => (
                  <Select.Item item={option} key={option.value}>
                    {option.option}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Field.Root>
    </VStack>
  );
}
