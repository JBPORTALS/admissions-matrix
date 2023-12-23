"use client";
import { useSupabase } from "@/app/supabase-provider";
import { useAppDispatch } from "@/hooks";
import { fetchOverallMatrix } from "@/store/admissions.slice";
import React, { useEffect } from "react";

const ApprovedLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user } = useSupabase();

  useEffect(() => {
    user?.college && dispatch(fetchOverallMatrix({ college: user?.college }));
  }, [dispatch, user?.college]);

  return <>{children}</>;
};

export default ApprovedLayout;
