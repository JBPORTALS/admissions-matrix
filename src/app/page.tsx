"use client";
import AddCouncelAddmissionModel from "@/components/modals/AddCouncelAdmissionModal";
import { Image } from "@chakra-ui/next-js";
import Link from "next/link";
import {
  Button,
  Card,
  Center,
  Flex,
  HStack,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { MdOutlineAdd } from "react-icons/md";
import CheckStudentDetails from "@/components/modals/CheckStudentDetails";

export default function Home() {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
          <CheckStudentDetails>
            <Button
              // as={Link}
              // href={"/new-enquiry"}
              size={"sm"}
              colorScheme="facebook"
              leftIcon={<MdOutlineAdd />}
            >
              Add Enquiry
            </Button>
          </CheckStudentDetails>

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
        <Card
          border={"1px"}
          borderColor={"gray.300"}
          shadow={"md"}
          p={"16"}
          alignItems={"center"}
        >
          <Heading>Admission Matrix</Heading>
          <p className="mt-3">To manage admission process details</p>
          <Button
            mt={"4"}
            size={"lg"}
            colorScheme="facebook"
            as={Link}
            href={"/signin"}
            w={"full"}
          >
            Get Signin
          </Button>
        </Card>
      </Center>
    </Flex>
  );
}
