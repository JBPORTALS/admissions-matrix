"use client";
import { HStack, Heading, IconButton, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";

const NewEnquiryLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <VStack
      height={"100%"}
      position={"relative"}
      width={"100%"}
      overflowY={"auto"}
    >
      <HStack
        position={"sticky"}
        top={"0"}
        w={"100%"}
        justifyContent={"space-between"}
        px={"8"}
        py={"3"}
        alignItems={"center"}
      >
        <div className="relative flex h-8 w-28">
          <Image
            quality={100}
            alt={"ismart"}
            src={"/nexuss.png"}
            priority
            sizes="24vh"
            fill
          />
        </div>
        <IconButton
          onClick={() => {
            router.back();
          }}
          aria-label="cross"
          size={"md"}
          variant={"unstyled"}
          icon={<MdClose className="text-2xl" />}
        />
      </HStack>
      {children}
    </VStack>
  );
};

export default NewEnquiryLayout;
