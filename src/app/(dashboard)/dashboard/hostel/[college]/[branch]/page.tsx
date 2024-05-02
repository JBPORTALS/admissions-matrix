"use client";
import { useAppDispatch } from "@/hooks";
import { fetchHostelSearchClass } from "@/store/admissions.slice";
import { VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useParams } from "next/navigation";
import HostelClassDataGrid from "@/components/layouts/HostelClassDataGrid";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useParams();

  useEffect(() => {
    router.college &&
      router.branch &&
      dispatch(
        fetchHostelSearchClass({
          college: router.college as string,
          branch: router.branch as string,
        })
      );

    console.log(router);
  }, [router.college, router.branch, dispatch]);

  return (
    <VStack h={"77vh"} pr={"3"} className="ag">
      <HostelClassDataGrid />
    </VStack>
  );
}
