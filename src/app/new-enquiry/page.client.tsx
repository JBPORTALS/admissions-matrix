"use client";

import {
  Button,
  ButtonGroup,
  EmptyState,
  Heading,
  Highlight,
  HStack,
  Icon,
  IconButton,
  Stack,
  Steps,
  useSteps,
  VStack,
} from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import {
  AcademicBackgroundForm,
  CourseSelectionForm,
  FacilitiesForm,
  FamilyInfoSchema,
  ReferalForm,
  StudentDetailsForm,
  StudentVerificationForm,
} from "./forms.client";
import React from "react";
import { useRouter } from "next/navigation";
import { LucideCheckCircle2 } from "lucide-react";
import { useEnquiryStore } from "@/providers/enquiry-store-provider";

const items = [
  {
    title: "Verify Student",
    description:
      "Enter register number and contact details to begin the enquiry process.",
    form: StudentVerificationForm,
  },
  {
    title: "Student Details",
    description:
      "Fill in personal details such as name, gender, Aadhar, PAN, and contact address.",
    form: StudentDetailsForm,
  },
  {
    title: "Course & College Preference",
    description: "Choose the desired course, college, branch.",
    form: CourseSelectionForm,
  },
  {
    title: "Final Fee & Facilities",
    description: "View applicable fees and facilities.",
    form: FacilitiesForm,
  },
  {
    title: "Academic Background",
    description:
      "Enter the student's previous academic history including board, percentage, and category.",
    form: AcademicBackgroundForm,
  },
  {
    title: "Family Information",
    description: "Add guardian details like father’s and mother’s names.",
    form: FamilyInfoSchema,
  },
  {
    title: "Referral & Internal Tracking",
    description:
      "Mention referral source, counselor's name, and recommendation if applicable.",
    form: ReferalForm,
  },
];

export function PageClient() {
  const steps = useSteps({ defaultStep: 0, count: items.length });
  const router = useRouter();
  const enquiryStore = useEnquiryStore((s) => s);

  return (
    <Steps.RootProvider
      size={"sm"}
      orientation="vertical"
      height="600px"
      value={steps}
      w={"full"}
    >
      <Steps.List>
        {items.map((step, index) => (
          <Steps.Item key={index} index={index} title={step.title}>
            <Steps.Indicator />
            <VStack alignItems={"start"}>
              <Steps.Title>{step.title}</Steps.Title>
              <Steps.Description w={"80%"}>
                {step.description}
              </Steps.Description>
            </VStack>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
      <Stack w={"full"} spaceY={"5"} pb={"5"}>
        <HStack gap={"5"}>
          <IconButton
            onClick={() => router.back()}
            variant={"surface"}
            size={"sm"}
            rounded={"full"}
          >
            <LuArrowLeft />
          </IconButton>

          {items.map((step, index) => (
            <Steps.Content key={index} asChild index={index}>
              <Heading
                color={"fg.muted"}
                fontSize={"2xl"}
                fontWeight={"medium"}
              >
                <Highlight
                  styles={{
                    color: "fg",
                  }}
                  query={step.title}
                >
                  {`New Enquiry / ${step.title}`}
                </Highlight>
              </Heading>
            </Steps.Content>
          ))}
        </HStack>

        {items.map((step, index) => (
          <Steps.Content key={index} index={index}>
            <React.Fragment>{step.form && <step.form />}</React.Fragment>
          </Steps.Content>
        ))}

        {/** Final Step */}
        <Steps.CompletedContent>
          <EmptyState.Root>
            <EmptyState.Content>
              <Icon
                color={"fg.success"}
                data-state="open"
                animationDuration="slowest"
                animationStyle={"scale-fade-in"}
              >
                <LucideCheckCircle2 size={100} strokeWidth={1.25} />
              </Icon>

              <VStack>
                <EmptyState.Title>Enquiry Added Successful</EmptyState.Title>
                <EmptyState.Description>
                  You can use this enquiry application number while student
                  willing to pay the fee
                </EmptyState.Description>
              </VStack>
              <ButtonGroup variant={"subtle"}>
                <Button
                  onClick={() => {
                    enquiryStore.reset();
                    steps.resetStep();
                  }}
                >
                  Create New One
                </Button>
              </ButtonGroup>
            </EmptyState.Content>
          </EmptyState.Root>
        </Steps.CompletedContent>
      </Stack>
    </Steps.RootProvider>
  );
}
