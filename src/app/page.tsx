import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  HStack,
  Heading,
  Highlight,
  Icon,
  List,
  Separator,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuArmchair,
  LuDatabase,
  LuFilter,
  LuGauge,
  LuLayoutGrid,
  LuMailPlus,
  LuMessageSquare,
  LuPlus,
  LuUserCog,
  LuWorkflow,
} from "react-icons/lu";

const ourSolutions = [
  { title: "Automatic Workflows", icon: LuWorkflow },
  { title: "Centralizes Data", icon: LuDatabase },
  { title: "Improves Communication & Transparency", icon: LuMessageSquare },
  { title: "Accelerates Decision-Making", icon: LuGauge },
];

const keyFeatures = [
  {
    icon: LuMailPlus,
    title: "Enquiry Management",
    description:
      "Capture new student enquiries along with their personal details and course interests.",
  },
  {
    icon: LuLayoutGrid,
    title: "Seat Matrix Views",
    description: [
      "Institution-Wide View: See approved/unapproved student data across all colleges.",
      "College View: View seat data for a specific college.",
      "Branch View: Get insights into available seats within a branch.",
    ],
  },
  {
    icon: LuUserCog,
    title: "Student Profile Handling",
    description: [
      "View, update, approve, or delete student profiles.",
      "Keep data accurate and decisions consistent.",
      "Download comprehensive student details as reports.",
    ],
  },
  {
    icon: LuArmchair,
    title: "Seat Allotment Matrix",
    description:
      "Get a clear picture of how seats are allocated across branches and institutions.",
  },
  {
    icon: LuFilter,
    title: "Advanced Filtering",
    description: [
      "Enquiry Date",
      "Approval Date",
      "Source",
      "Application Number",
    ],
  },
];

export default function Home() {
  return (
    <Container>
      <Center h={"100vh"}>
        <VStack gap={"5"} alignItems={"center"} w={"60%"}>
          <Box h={"12"} w={"40"} position={"relative"}>
            <Box asChild _dark={{ filter: "invert(1)" }}>
              <Image
                quality={100}
                alt={"ismart"}
                src={"/nexuss.png"}
                priority
                sizes="24vh"
                fill
              />
            </Box>
          </Box>
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
              query={"Admission"}
            >
              Revolutionizing the Admission Process in Educational Institutions
            </Highlight>
          </Heading>
          <Text fontSize={"xl"} color={"fg.muted"} textAlign={"center"}>
            Admission Matrix is an intelligent, end-to-end admission management
            system designed to eliminate manual errors, reduce delays, and
            streamline the entire student intake process — from enquiry to seat
            allotment.
          </Text>
          <HStack gap={"3"}>
            <Button size={"lg"} asChild>
              <Link href={`/new-enquiry`}>
                <LuPlus />
                New Enquiry
              </Link>
            </Button>

            <Button size={"lg"} variant={"surface"} asChild>
              <Link href={"/signin"}>Signin to Dashboard</Link>
            </Button>
          </HStack>
        </VStack>
      </Center>

      <Separator />
      <VStack py={16} px={"52"}>
        <Heading size="4xl" textAlign={"center"} mb={4}>
          Say Goodbye to Inefficient Admission Processes
        </Heading>
        <Text fontSize="lg" textAlign={"center"} color={"fg.muted"}>
          The traditional admission workflow is filled with challenges —
          paperwork overload, scattered information, and long wait times. These
          hurdles slow down institutions and frustrate applicants.
        </Text>
      </VStack>

      <HStack>
        <Separator flex="1" />
        <Text
          textAlign={"2xl"}
          fontWeight={"semibold"}
          color={"fg.muted"}
          flexShrink="0"
        >
          NO MORE, BECAUSE
        </Text>
        <Separator flex="1" />
      </HStack>

      <VStack py={16} gap={"10"} px={"52"}>
        <VStack gap={"0"}>
          <Heading size="4xl" mb={4}>
            Smart, Seamless, and Scalable
          </Heading>
          <Text fontSize="lg" textAlign={"center"} color={"fg.muted"}>
            Admission Matrix is a comprehensive admission management platform
            that
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          {ourSolutions.map((item, index) => (
            <VStack
              py={"5"}
              px={"5"}
              borderWidth={"thin"}
              borderColor={"border"}
            >
              <Icon fontSize={"4xl"} color={"fg.muted"}>
                <item.icon strokeWidth={1.24} />
              </Icon>
              <Heading
                fontSize={"md"}
                fontWeight={"semibold"}
                textAlign={"center"}
              >
                {item.title}
              </Heading>
            </VStack>
          ))}
        </SimpleGrid>
      </VStack>

      <HStack>
        <Separator flex="1" />
        <Text
          textAlign={"2xl"}
          fontWeight={"semibold"}
          color={"fg.muted"}
          flexShrink="0"
        >
          KEY FEATURES
        </Text>
        <Separator flex="1" />
      </HStack>

      <VStack py={16} gap={"10"} px={"52"}>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          {keyFeatures.map((item) => (
            <Box p={6} borderWidth={"thin"} borderColor={"border"}>
              <VStack align="start" gap={4}>
                <Icon fontSize={"4xl"} color={"fg.muted"}>
                  <item.icon strokeWidth={1.2} />
                </Icon>
                <Heading size={"lg"}>{item.title}</Heading>

                {Array.isArray(item.description) ? (
                  <List.Root pl={4} color="fg.muted" fontSize={"sm"}>
                    {item.description.map((item, idx) => (
                      <List.Item key={idx}>{item}</List.Item>
                    ))}
                  </List.Root>
                ) : (
                  <Text color="fg.muted" fontSize={"sm"}>
                    {item.description}
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>

      <Separator />
      <HStack justifyContent={"space-between"} px={"32"} py={"16"}>
        <VStack align={"start"} w={"1/2"}>
          <Heading size={"5xl"}>Get Started Today</Heading>
          <Text color={"fg.muted"} fontSize={"lg"}>
            Empower your institution with Admission Matrix — your partner in
            efficient student admissions.
          </Text>
        </VStack>

        <ButtonGroup size={"lg"}>
          <Button variant={"surface"}>Request a Demo</Button>
          <Button>Contact Us</Button>
        </ButtonGroup>
      </HStack>
      <Separator />
      <Center py={"12"} asChild>
        <footer>
          <Text color={"fg.muted"}>
            Powered & Created by JB PORTALS, © 2025-26 All Reserved
          </Text>
        </footer>
      </Center>
    </Container>
  );
}
