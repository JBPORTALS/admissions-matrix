import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Highlight,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineAdd } from "react-icons/md";
import { LuPlus } from "react-icons/lu";

export default function Home() {
  return (
    <VStack h={"svh"} justifyContent={"start"} w={"full"}>
      <HStack
        justifyContent={"space-between"}
        className="backdrop-blur-sm"
        w={"full"}
        px={"16"}
        py={"3"}
      >
        <Box h={"8"} w={"28"} position={"relative"}>
          <Image
            quality={100}
            alt={"ismart"}
            src={"/nexuss.png"}
            priority
            sizes="24vh"
            fill
          />
        </Box>
        <HStack gap={3}></HStack>
      </HStack>
      <Center h={"full"}>
        <VStack gap={"5"} w={"50%"}>
          <Heading textAlign={"center"} size={"5xl"} fontWeight={"semibold"}>
            <Highlight
              styles={{
                px: "3",
                borderStartRadius: "md",
                borderRightColor: "colorPalette",
                borderRightWidth: "2px",
                bg: "colorPalette.subtle",
                color: "colorPalette.500",
              }}
              query={"Precision"}
            >
              Streamline Admissions with Precision
            </Highlight>
          </Heading>
          <Text fontSize={"xl"} color={"fg.muted"} textAlign={"center"}>
            Admission Matrix empowers institutions to manage student
            applications with ease, transparency, and accuracy. From inquiry to
            enrollment, simplify every step with intelligent workflows
          </Text>
          <HStack gap={"3"}>
            <Button size={"lg"}>
              <LuPlus />
              New Enquiry
            </Button>

            <Button size={"lg"} variant={"surface"} asChild>
              <Link href={"/signin"}>Signin to Dashboard</Link>
            </Button>
          </HStack>
        </VStack>
      </Center>
    </VStack>
  );
}
