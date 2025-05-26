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
  SelectControl,
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
import {
  SelectContent,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select";
import { LuCheck, LuClock10, LuHistory, LuUserCheck } from "react-icons/lu";

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
          <LuUserCheck />
          Approved
        </Link>
      </NavButton>
      <NavButton asChild active={pathname.startsWith("/dashboard/un-approved")}>
        <Link href={"/dashboard/un-approved"}>
          <LuClock10 />
          Un-Approved
        </Link>
      </NavButton>
      <NavButton asChild active={pathname.startsWith("/dashboard/history")}>
        <Link href={"/dashboard/history"}>
          <LuHistory />
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
        <SelectRoot
          value={[acadYear]}
          collection={ACADYEARS}
          onValueChange={(e) => {
            dispatch(updateAcadYear(e.value));
            toast.success(`Academic year changed to "${e.value}"`);
            router.push("/dashboard");
          }}
          rounded={"full"}
        >
          <SelectControl>
            <SelectTrigger>
              <SelectValueText placeholder="Select Academic Year" />
            </SelectTrigger>
          </SelectControl>
          <SelectContent>
            {ACADYEARS.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </SelectContent>
        </SelectRoot>
      </Field.Root>
    </VStack>
  );
}
