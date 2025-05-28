import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Select,
  Grid,
  GridItem,
  VStack,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { AiOutlineSearch, AiOutlineSetting } from "react-icons/ai";
import moment from "moment";
import { BsFilter } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import MIFModal from "@/components/drawers/MIFModal";
import { SideBar } from "@/components/side-bar";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import Header from "@/components/header";
import { auth } from "@/utils/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardMainLayout(props: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await auth();

  if (!isLoggedIn) redirect("/signin");

  return (
    <VStack gap={"0"} alignItems={"start"} minH={"100vh"}>
      <Header />
      <HStack
        alignItems={"start"}
        justifyItems={"start"}
        zIndex={1}
        w={"full"}
        flex={"1"}
        gap={"0"}
      >
        {/** SideBar contents */}
        <SideBar />

        {/** Main Content */}
        <Box w={"full"} flex={"1"} asChild minW={"0"}>
          <main>{props.children}</main>
        </Box>
      </HStack>
    </VStack>
  );
}
