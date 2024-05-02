"use client";
import { useSupabase } from "@/app/supabase-provider";
import { useAppDispatch } from "@/hooks";
import { fetchOverallMatrix } from "@/store/admissions.slice";
import React, { useEffect } from "react";

const ApprovedLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ApprovedLayout;
