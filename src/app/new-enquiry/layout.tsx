"use client";
import { useSupabase } from "@/app/supabase-provider";
import { useAppDispatch } from "@/hooks";
import { fetchOverallMatrix } from "@/store/admissions.slice";
import { HStack, Heading, IconButton, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { MdClose, MdCloseFullscreen } from "react-icons/md";

const NewEnquiryLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useSupabase();
  useEffect(() => {
    user?.college && dispatch(fetchOverallMatrix({ college: user?.college }));
  }, [dispatch, user?.college]);
  return (
    <VStack height={"100%"} width={"100%"}>
      <HStack
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
        <Heading size={"md"} position={"relative"}>
          New Enquiry
        </Heading>
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
