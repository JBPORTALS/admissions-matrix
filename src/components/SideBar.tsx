"use client";

import { MdOutlineAdd } from "react-icons/md";
import NavButton from "./ui/utils/NavButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Field,
  Heading,
  Select,
  SelectControl,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { useAppSelector } from "@/store";
import { useAppDispatch } from "@/hooks";
import { updateAcadYear } from "@/store/admissions.slice";
import { useRouter } from "next/navigation";
import { ACADYEARS } from "@/utils/constants";
import { toast } from "react-hot-toast";
import {
  SelectContent,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select";
import { LuBuilding2, LuClock10, LuHistory, LuUserCheck } from "react-icons/lu";

const items = [
  {
    label: "Approved",
    href: "/dashboard/approved",
    icon: LuUserCheck,
  },
  {
    label: "Unapproved",
    href: "/dashboard/un-approved",
    icon: LuClock10,
  },
  {
    label: "Hostel",
    href: "/dashboard/hostel",
    icon: LuBuilding2,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: LuHistory,
  },
];

export function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const acadYear = useAppSelector((state) => state.admissions.acadYear);

  return (
    <VStack
      w={"3xs"}
      flexShrink={"0"}
      h={"100vh"}
      borderRightColor={"border"}
      borderRightWidth={"1px"}
      alignItems={"start"}
      background={"Background"}
      position={"sticky"}
      inset={"0"}
      marginTop={"-16"}
      paddingTop={"16"}
      asChild
    >
      <aside>
        <VStack
          asChild
          position={"relative"}
          w={"full"}
          overflowY={"auto"}
          overflowX={"hidden"}
          overscroll={"contain"}
          px={"3"}
          py={"3"}
          alignItems={"start"}
        >
          <nav>
            <VStack w={"full"}>
              {items.map((item) => (
                <NavButton asChild active={pathname.startsWith(item.href)}>
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
                  </Link>
                </NavButton>
              ))}
            </VStack>

            <Separator color={"border"} />
            <Heading fontSize={"xs"} color={"fg.muted"}>
              ENQUIRY
            </Heading>
            <Button size={"sm"} width={"full"}>
              <MdOutlineAdd />
              New Enquiry
            </Button>
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
          </nav>
        </VStack>
      </aside>
    </VStack>
  );
}
