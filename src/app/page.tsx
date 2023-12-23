"use client";
import AddCouncelAddmissionModel from "@/components/modals/AddCouncelAdmissionModal";
import { Image } from "@chakra-ui/next-js";
import Link from "next/link";
import { Button, Card, Center, Flex, HStack, Heading } from "@chakra-ui/react";
import { MdOutlineAdd } from "react-icons/md";

export default function Home() {
  return (
    <Flex className="bg-white flex h-[100vh] flex-col justify-start w-full">
      <HStack
        justifyContent={"space-between"}
        className="backdrop-blur-sm"
        w={"full"}
        px={"16"}
        py={"3"}
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
        <HStack gap={3}>
          <AddCouncelAddmissionModel>
            {({ onOpen }) => (
              <Button
                // as={Link}
                // href={"/new-enquiry"}
                onClick={onOpen}
                size={"sm"}
                colorScheme="facebook"
                leftIcon={<MdOutlineAdd />}
              >
                Add Enquiry
              </Button>
            )}
          </AddCouncelAddmissionModel>

          <Button
            size={"sm"}
            variant={"outline"}
            colorScheme="gray"
            as={Link}
            href={"/signin"}
          >
            Signin
          </Button>
        </HStack>
      </HStack>
      <Center h={"full"}>
        <Card border={"1px"} shadow={"md"} p={"10"}>
          <Heading color={"blue.600"}>Admission Matrix</Heading>
          <p className="mt-3">to manage admission process details</p>
          <Button
            mt={"4"}
            size={"lg"}
            variant={"outline"}
            colorScheme="gray"
            as={Link}
            href={"/signin"}
          >
            Signin To Matrix
          </Button>
        </Card>
      </Center>
    </Flex>
  );
}
