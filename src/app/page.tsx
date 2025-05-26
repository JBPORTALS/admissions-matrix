import Image from "next/image";
import Link from "next/link";
import { Button, Card, Center, Flex, HStack, Heading } from "@chakra-ui/react";
import { MdOutlineAdd } from "react-icons/md";
import CheckStudentDetails from "@/components/modals/CheckStudentDetails";

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
          <CheckStudentDetails>
            <Button
              // as={Link}
              // href={"/new-enquiry"}
              size={"sm"}
              colorScheme="facebook"
            >
              Add Enquiry
              <MdOutlineAdd />
            </Button>
          </CheckStudentDetails>

          <Button size={"sm"} variant={"outline"} colorScheme="gray" asChild>
            <Link href={"/signin"}>Signin</Link>
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
            w={"full"}
            asChild
          >
            <Link href="/signin">Get Signin</Link>
          </Button>
        </Card>
      </Center>
    </Flex>
  );
}
