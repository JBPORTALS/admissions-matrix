"use client";
import {
  MdBusiness,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdHistory,
  MdOutlineAdd,
  MdOutlineBusiness,
  MdOutlineHistory,
} from "react-icons/md";
import NavButton from "./utils/NavButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Divider,
  FormControl,
  Heading,
  Select,
  useToast,
} from "@chakra-ui/react";
import { IoMdClock } from "react-icons/io";
import { useAppSelector } from "@/store";
import { useAppDispatch } from "@/hooks";
import { updateAcadYear } from "@/store/admissions.slice";
import { useRouter } from "next/navigation";
import { ACADYEARS } from "@/utils/constants";
import AddCouncelAddmissionModel from "../modals/AddCouncelAdmissionModal";

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const toast = useToast({
    position: "bottom",
    status: "info",
    variant: "subtle",
  });

  return (
    <div className="bg-secondary gap-6 flex flex-col border-r p-3 border-slate-300 w-full col-span-1 z-50">
      <Link href={"/dashboard/approved"}>
        <NavButton
          active={pathname.startsWith("/dashboard/approved")}
          icon={
            pathname.startsWith("/dashboard/approved") ? (
              <MdCheckCircle />
            ) : (
              <MdCheckCircleOutline />
            )
          }
        >
          Approved
        </NavButton>
      </Link>
      <Link href={"/dashboard/un-approved"}>
        <NavButton
          active={pathname.startsWith("/dashboard/un-approved")}
          icon={
            pathname.startsWith("/dashboard/un-approved") ? (
              <IoMdClock />
            ) : (
              <IoMdClock />
            )
          }
        >
          Un-Approved
        </NavButton>
      </Link>

      {/* <Link href={"/dashboard/hostel"}>
        <NavButton
          active={pathname.startsWith("/dashboard/hostel")}
          icon={
            pathname.startsWith("/dashboard/hostel") ? (
              <MdBusiness />
            ) : (
              <MdOutlineBusiness />
            )
          }
        >
          Hostel
        </NavButton>
      </Link> */}
      <Link href={"/dashboard/history"}>
        <NavButton
          active={pathname.startsWith("/dashboard/history")}
          icon={
            pathname.startsWith("/dashboard/history") ? (
              <MdHistory />
            ) : (
              <MdOutlineHistory />
            )
          }
        >
          History
        </NavButton>
      </Link>
      <Divider />
      <Heading fontSize={"xs"} color={"gray.500"} scale={0.3}>
        ENQUIRY
      </Heading>
      <AddCouncelAddmissionModel>
        {({ onOpen }) => (
          <Button
            // as={Link}
            // href={"/new-enquiry"}
            rounded={"full"}
            colorScheme="facebook"
            leftIcon={<MdOutlineAdd />}
            size={"md"}
            onClick={onOpen}
            width={"full"}
          >
            New Enquiry
          </Button>
        )}
      </AddCouncelAddmissionModel>
      <Divider />
      <Heading fontSize={"xs"} color={"gray.500"} scale={0.3}>
        ACADEMIC YEAR
      </Heading>
      <FormControl>
        <Select
          value={acadYear}
          onChange={(e) => {
            dispatch(updateAcadYear(e.target.value));
            toast({ title: `Academic year changed to "${e.target.value}"` });
            router.push("/dashboard");
          }}
          rounded={"full"}
        >
          {ACADYEARS.map((option) => (
            <option value={option.value} key={option.value}>
              {option.option}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
