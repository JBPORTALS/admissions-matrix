"use client";
import AddCouncelAddmissionModel from "@/components/modals/AddCouncelAdmissionModal";
import { Image } from "@chakra-ui/next-js";
import Link from "next/link";
import { Button, Card, Center, Flex, HStack, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex className="bg-gradient-to-r from-gray-50 to-gray-100 flex h-[100vh] flex-col justify-start w-full">
      <HStack
        justifyContent={"space-between"}
        className="backdrop-blur-sm"
        w={"full"}
        px={"16"}
        py={"3"}
      >
        <div className="relative h-10 w-32">
        <Image alt={"ismart"} src={"/nexuss.png"} priority sizes="10vh" fill/>
        </div>
        <HStack>
          <AddCouncelAddmissionModel>
            {({ onOpen }) => (
              <Button
                size={"sm"}
                variant={"outline"}
                colorScheme="blue"
                onClick={onOpen}
              >
                Add Enquiry
              </Button>
            )}
          </AddCouncelAddmissionModel>
          <Button
            size={"sm"}
            variant={"ghost"}
            colorScheme="blue"
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
            size={"md"}
            variant={"outline"}
            colorScheme="blue"
            as={Link}
            href={"/signin"}
          >
            Signin
          </Button>
        </Card>
      </Center>
    </Flex>
  );
}
