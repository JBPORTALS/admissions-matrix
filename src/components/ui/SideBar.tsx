"use client";
import {
  MdAddBusiness,
  MdBusiness,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdHistory,
  MdList,
  MdOutlineBusiness,
  MdOutlineHistory,
  MdOutlineList,
  MdOutlineLockClock,
  MdOutlineSpaceDashboard,
  MdSpaceDashboard,
} from "react-icons/md";
import NavButton from "./utils/NavButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FormControl, Select } from "@chakra-ui/react";
import { IoMdClock } from "react-icons/io";

export default function SideBar() {
  const pathname = usePathname();
  return (
    <div className="bg-secondary gap-4 flex flex-col border-r p-3 border-slate-300 w-full col-span-1">
      <FormControl>
        <Select rounded={"full"}>
          <option>2023</option>
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
