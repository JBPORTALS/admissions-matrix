"use client";
import {
  MdBusiness,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdHistory,
  MdOutlineBusiness,
  MdOutlineHistory,
} from "react-icons/md";
import NavButton from "./utils/NavButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FormControl, Select, useToast } from "@chakra-ui/react";
import { IoMdClock } from "react-icons/io";
import { useAppSelector } from "@/store";
import { useAppDispatch } from "@/hooks";
import { updateAcadYear } from "@/store/admissions.slice";

export default function SideBar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const toast = useToast({
    position: "bottom",
    status: "info",
    variant: "subtle",
  });

  return (
    <div className="bg-secondary gap-4 flex flex-col border-r p-3 border-slate-300 w-full col-span-1 z-50">
      <FormControl>
        <Select
          value={acadYear}
          onChange={(e) => {
            dispatch(updateAcadYear(e.target.value));
            toast({ title: `Academic year changed to "${acadYear}"` });
          }}
          rounded={"full"}
        >
          <option value={"2023"}>2023</option>
          <option value={"2024"}>2024</option>
        </Select>
      </FormControl>
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

      <Link href={"/dashboard/hostel"}>
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
      </Link>
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
    </div>
  );
}
