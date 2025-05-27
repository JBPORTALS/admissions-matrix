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
import { SideBar } from "@/components/sidebar";
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
      >
        {/** SideBar contents */}
        <SideBar />

        {/** Main Content */}
        <Box w={"full"} flex={"1"} asChild minW={"0"}>
          <main>
            {/* <HStack justifyContent={"space-between"}>
          <Heading size={"2xl"} color={"fg"}>
          {pathname.startsWith("/dashboard/approved")
          ? "Approved Details"
          : pathname.startsWith("/dashboard/un-approved")
          ? "Un-Approved Details"
          : pathname.startsWith("/dashboard/hostel")
          ? "Hostel Details"
          : pathname.startsWith("/dashboard/history")
          ? "Admissions History"
          : ""}
          </Heading>
          
          <HStack mr={"2"}>
          <MenuRoot size={"md"}>
          <MenuTrigger asChild>
          <Button variant={"outline"}>
          <BsFilter className={"text-xl"} />
          Filters
          </Button>
          </MenuTrigger>
          
          <MenuContent
          gap={"3"}
          display={"flex"}
          flexDir={"column"}
          shadow={"2xl"}
          >
          <Field.Root>
          <SelectRoot
          collection={filterStateOptions}
          value={[filterType]}
          onValueChange={(e) => setFilterType(e.value[0])}
          >
          <SelectLabel>Select Filter</SelectLabel>
          <SelectTrigger w={"240px"}>
          <Select.ValueText placeContent={"Select ..."} />
          </SelectTrigger>
          <SelectContent>
          {filterStateOptions.items.map((item) => (
            <SelectItem key={item.value} item={item}>
            {item.label}
            </SelectItem>
            ))}
            </SelectContent>
            </SelectRoot>
            </Field.Root>
            {filterType && (
              <>
              <Field.Root>
              {filterType == "SOURCE" ? (
                <>
                <SelectRoot
                collection={filterSourceOptions}
                value={[filterState.source]}
                onValueChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  source: e.value[0],
                  }))
                  }
                  >
                  <SelectLabel>Select Source</SelectLabel>
                  <SelectTrigger w={"240px"}>
                  <SelectValueText placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent zIndex={"max"}>
                  {filterSourceOptions.items.map((item, _index) => (
                    <SelectItem item={item} key={item.value}>
                    {item.label}
                    </SelectItem>
                    ))}
                    </SelectContent>
                    </SelectRoot>
                    </>
                    ) : filterType == "APPROVAL" ||
                    filterType == "ENQUIRY" ? (
                      <>
                      <Field.Label>Date</Field.Label>
                      <Input
                      className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                      value={
                        !filterState.date
                        ? new Date().toDateString()
                        : new Date(filterState.date).toDateString()
                        }
                        type="date"
                        onChange={(date) => {
                          setFilterState((prev) => ({
                            ...prev,
                            }));
                            }}
                            />
                            </>
                            ) : null}
                            </Field.Root>
                            <Field.Root>
                            <Button asChild w={"full"} colorPalette={"blue"}>
                            <Link
                            href={`/dashboard/search/${new Date(
                              Date.now()
                              ).getTime()}/?type=${filterType}&date=${moment(
                                filterState.date
                                ).format("yyyy-MM-DD")}&source=${filterState.source}`}
                                onClick={() => {
                                  //  navigation.refresh()
                                  }}
                                  >
                                  <AiOutlineSearch className={"text-lg"} />
                                  Search
                                  </Link>
                                  </Button>
                                  </Field.Root>
                                  </>
                                  )}
                                  </MenuContent>
                                  </MenuRoot>
                                  
                                  {user?.college === "MANAGEMENT" ? (
                                    <MIFModal>
                                    {({ onOpen }) => (
                                      <Button onClick={onOpen} size={"sm"} variant={"ghost"}>
                                      Manage Intake & Fee <AiOutlineSetting className="text-xl" />
                                      </Button>
                                      )}
                                      </MIFModal>
                                      ) : null}
                                      </HStack>
                                      </HStack> */}

            <Stack
              py={"4"}
              mx={"auto"}
              px={"4"}
              w={"full"}
              flex={"1"}
              maxW={"7xl"}
              spaceY={"2.5"}
            >
              {props.children}
            </Stack>
          </main>
        </Box>
      </HStack>
    </VStack>
  );
}
