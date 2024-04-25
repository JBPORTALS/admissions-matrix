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
        fetchSearchClass({
          college: router.college as string,
          branch: router.branch as string,
        })
      );

    console.log(router);
  }, [router.college, router.branch, dispatch]);

  return (
    <VStack h={"77vh"} w={"full"} pr={"3"} className="ag">
      <ClassDataGrid />
    </VStack>
  );
}
