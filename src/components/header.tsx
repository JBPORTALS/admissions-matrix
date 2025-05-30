"use client";

import {
  HStack,
  InputGroup,
  Input,
  Heading,
  Button,
  Text,
  Kbd,
  VStack,
  Separator,
  Box,
  Collapsible,
  useDisclosure,
} from "@chakra-ui/react";
import { LuLogOut, LuMailOpen, LuSearch, LuX } from "react-icons/lu";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar } from "./ui/avatar";
import { AiOutlineUserAdd } from "react-icons/ai";
import { ColorModeButton } from "./ui/color-mode";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useUser } from "@/utils/auth";
import { useCallback, useEffect, useState } from "react";
import { CloseButton } from "./ui/close-button";
import { sourceOptions } from "@/utils/constants";

export function SearchCommandButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<{ name: string; query: string }[]>([]);

  const setFilterState = useCallback(
    (name: string, query: string) => {
      setFilters((prev) => {
        const existing = prev.find((f) => f.name === name);
        if (existing) {
          return prev.map((f) => (f.name === name ? { name, query } : f));
        }
        return [...prev, { name, query }];
      });
    },
    [filters]
  );

  const getFilterValue = useCallback(
    (name: string) => filters.find((f) => f.name === name)?.query ?? "",
    [filters]
  );

  const isAdvanceFiltersApplied =
    !!getFilterValue("src") ||
    !!getFilterValue("en_date") ||
    !!getFilterValue("ap_date");

  const deleteFilterState = useCallback(
    (name: string) => {
      setFilters((prev) => {
        return prev.filter((f) => f.name !== name);
      });
    },
    [filters]
  );

  const searchWithFilters = useCallback(() => {
    const params = new URLSearchParams();

    filters.forEach((f) => {
      if (f.query) {
        params.set(f.name, f.query);
      }
    });

    router.push(
      `/dashboard/search/${new Date().getTime()}?${params.toString()}`
    );

    setOpen(false);
  }, [filters]);

  const { open, setOpen, onToggle } = useDisclosure();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // Prevent browser search shortcut
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    searchParams.forEach((value, key) => setFilterState(key, value));
  }, []);

  return (
    <DialogRoot open={open} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <Button
          w={"full"}
          variant={"subtle"}
          shadow={"sm"}
          colorPalette={"gray"}
          justifyContent={"start"}
        >
          <LuSearch />
          <Text>{getFilterValue("query") ?? "Search"}</Text>
          <Kbd ml={"auto"}>CTRL+K</Kbd>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
        </DialogHeader>
        <DialogBody asChild spaceY={"3"}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchWithFilters();
            }}
          >
            <InputGroup startElement={<LuSearch size={18} />}>
              <Input
                value={getFilterValue("query")}
                onChange={(e) => setFilterState("query", e.target.value)}
                size={"lg"}
                placeholder="Search here ..."
              />
            </InputGroup>
            <Collapsible.Root defaultOpen={isAdvanceFiltersApplied}>
              <HStack justifyContent={"space-between"}>
                <Collapsible.Trigger asChild>
                  <Button size={"xs"} px={"1"} h={"6"} variant={"ghost"}>
                    Advance Search
                  </Button>
                </Collapsible.Trigger>

                {isAdvanceFiltersApplied && (
                  <Button
                    onClick={() => {
                      deleteFilterState("src");
                      deleteFilterState("en_date");
                      deleteFilterState("ap_date");
                    }}
                    px={"1"}
                    variant={"outline"}
                    h={"6"}
                    size={"xs"}
                  >
                    Clear <LuX />
                  </Button>
                )}
              </HStack>
              <Collapsible.Content
                display={"flex"}
                flexDir={"column"}
                gap={"5"}
                py={"2"}
                justifyContent={"space-between"}
              >
                <Separator w={"full"} />
                <HStack>
                  {/** Enquiry Date */}
                  <VStack alignItems={"start"} flex={"1"}>
                    <Heading size={"xs"} fontWeight={"semibold"}>
                      ENQUIRY DATE
                    </Heading>

                    <Input
                      value={getFilterValue("en_date")}
                      onChange={(e) =>
                        setFilterState("en_date", e.target.value)
                      }
                      type="date"
                      variant={"outline"}
                    />
                  </VStack>

                  {/** Approval Date */}
                  <VStack alignItems={"start"} flex={"1"}>
                    <Heading size={"xs"} fontWeight={"semibold"}>
                      APPROVAL DATE
                    </Heading>
                    <Input
                      value={getFilterValue("ap_date")}
                      onChange={(e) => {
                        setFilterState("ap_date", e.target.value);
                      }}
                      type="date"
                      variant={"outline"}
                    />
                  </VStack>
                </HStack>
                {/** By Source */}
                <VStack alignItems={"start"} flex={"1"}>
                  <Heading size={"xs"} fontWeight={"semibold"}>
                    BY SOURCE
                  </Heading>

                  <Box spaceY={"2"}>
                    {sourceOptions.items.map((item) => (
                      <Button
                        size={"xs"}
                        textTransform={"capitalize"}
                        variant={
                          getFilterValue("src") === item.value
                            ? "surface"
                            : "ghost"
                        }
                        key={item.value}
                        onClick={() => {
                          setFilterState("src", item.value);
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                </VStack>
                <DialogFooter>
                  <Button type="submit">Apply</Button>
                </DialogFooter>
              </Collapsible.Content>
            </Collapsible.Root>
          </form>
        </DialogBody>

        <DialogCloseTrigger>
          <CloseButton size={"xs"} />
        </DialogCloseTrigger>
      </DialogContent>
    </DialogRoot>
  );
}

export default function Header() {
  const router = useRouter();
  const { signOut } = useSignIn();
  const [query, setQuery] = useState<string>("");
  const user = useUser();

  return (
    <HStack
      w={"full"}
      position={"sticky"}
      px={"5"}
      justifyContent={"space-between"}
      h={"16"}
      gap={"3"}
      borderBottomColor={"border"}
      borderBottomWidth={"thin"}
      backdropBlur={"sm"}
      inset={0}
      zIndex={"2"}
      background={"Background"}
    >
      <HStack w={"full"}>
        <Heading size={"lg"} position={"relative"} color={"fg"}>
          Admission Matrix
        </Heading>
      </HStack>
      <HStack w={"full"}>
        {/* <InputGroup
          endElement={
            <IconButton
              onClick={async () => {
                router.push(
                  `/dashboard/search/${new Date().getTime()}?query=${query}&type=QUERY`
                );
              }}
              colorScheme="facebook"
              size={"md"}
              variant={"ghost"}
              aria-label="search"
            >
              <LuSearch />
            </IconButton>
          }
          w={"full"}
        >
          <Input
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            w={"full"}
            fontSize={"sm"}
            type={"text"}
            onKeyDown={(e) => {
              if (e.key == "Enter")
                router.push(
                  `/dashboard/search/${new Date().getTime()}?query=${query}&type=QUERY`
                );
            }}
            placeholder="Search Admission no./Student Name/Phone No."
          />
        </InputGroup> */}

        <SearchCommandButton />
      </HStack>

      <HStack w={"full"} position={"relative"} justifyContent={"end"}>
        <HStack>
          <Heading size={"md"}>{user?.fullname}</Heading>
          <DialogRoot size={"sm"}>
            <DialogTrigger>
              <Avatar size={"sm"} />
            </DialogTrigger>

            <DialogContent
              position={"relative"}
              zIndex={"toast"}
              backdropBlur={"2xl"}
              shadow={"2xl"}
            >
              <DialogHeader fontWeight="semibold" fontSize={"lg"}>
                <DialogTitle>Profile Info</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <HStack gap={"3"} py={"2"}>
                  <AiOutlineUserAdd className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.fullname}
                  </Heading>
                </HStack>
                <HStack gap={"3"} py={"2"}>
                  <LuMailOpen className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.email}
                  </Heading>
                </HStack>
                <HStack gap={"3"} py={"2"}>
                  <Button
                    onClick={async () => {
                      await signOut();
                    }}
                    colorScheme="facebook"
                    w={"full"}
                  >
                    <LuLogOut />
                    SignOut
                  </Button>
                </HStack>
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </HStack>
        <ColorModeButton />
      </HStack>
    </HStack>
  );
}
