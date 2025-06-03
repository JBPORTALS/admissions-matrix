"use client";

import { enquiryRootSchema } from "@/app/new-enquiry/forms.client";
import { z } from "zod";
import { createStore } from "zustand/vanilla";

export type EnquiryState = z.infer<typeof enquiryRootSchema>;

export type EnquiryActions = {
  update: <K extends keyof EnquiryState>(
    key: K,
    values: Partial<EnquiryState[K]>
  ) => void;
  reset: () => void;
};

export type EnquiryStore = EnquiryState & EnquiryActions;

export const defaultInitState: EnquiryState = {
  studentVerification: {
    regno: "",
    fatherPhone: "",
    motherPhone: "",
    studentPhone: "",
  },
  studentDetails: {
    aadharNumber: "",
    address: "",
    city: "",
    email: "",
    gender: [],
    panNumber: "",
    state: "",
    studentName: "",
    studentPhone: "",
  },
  courseSelection: {
    branch: "",
    college: "",
    course: "",
  },
  facilities: {
    busFacility: false,
    fixedFee: 0,
    hostelFacility: false,
  },
  academicBackground: {
    board: [],
    overallPercentage: "",
    previousSchoolOrCollege: "",
    exam: [],
    course: "",
    pcmAggregate: "",
    rank: "",
  },
  familyInfo: {
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
  },
  referal: {
    councelledBy: "",
    recommendedBy: "",
    category: [],
    quotedBy: "",
    referalSource: [],
  },
};

export const createEnquiryStore = (
  initState: EnquiryState = defaultInitState
) =>
  createStore<EnquiryStore>()((set) => ({
    ...initState,
    update: (key, values) => set((state) => ({ ...state, [key]: values })),
    reset: () => set(defaultInitState),
  }));
