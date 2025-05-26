"use client";

import {
  HStack,
  InputGroup,
  Input,
  Heading,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { LuLogOut, LuMailOpen, LuSearch } from "react-icons/lu";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar } from "./ui/avatar";
import { AiOutlineUserAdd } from "react-icons/ai";
import { ColorModeButton } from "./ui/color-mode";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@/utils/auth";
import { useState } from "react";

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
        {/* <Box h={"8"} w={"28"} position={"relative"}>
            <Image
              quality={100}
              alt={"ismart"}
              src={"/nexuss.png"}
              priority
              sizes="24vh"
              fill
            />
          </Box> */}
        <Heading size={"lg"} position={"relative"} color={"fg"}>
          Admission Matrix
        </Heading>
      </HStack>
      <HStack w={"full"}>
        <InputGroup
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
        </InputGroup>
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
