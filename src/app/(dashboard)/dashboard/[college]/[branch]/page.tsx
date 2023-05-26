"use client";
import AdmissionLayout from "@/components/layouts/AdmissionLayout";
import { useAppDispatch } from "@/hooks";
import { fetchSearchClass } from "@/store/admissions.slice";
import { Stack, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useParams } from "next/navigation";
import ClassDataGrid from "@/components/layouts/ClassDataGrid";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useParams();

  useEffect(() => {
    router.college &&
      router.branch &&
      dispatch(
        fetchSearchClass({ college: router.college, branch: router.branch })
      );
      
      console.log(router)
  }, [router.college, router.branch, dispatch]);

  return (
    <VStack h={"77vh"} pr={"3"} className="ag">
      <ClassDataGrid />
    </VStack>
  );
}
