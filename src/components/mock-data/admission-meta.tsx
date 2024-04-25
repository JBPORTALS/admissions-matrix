import { Box, IconButton, Progress, Tag, VStack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/router";
import {
  AiOutlineCheckSquare,
  AiOutlineDownload,
  AiOutlineEye,
} from "react-icons/ai";
import ViewAdmissionDetailsModal from "../drawers/ViewAdmissionDetailsModal";
import ViewUnApprovedAdmModal from "../drawers/ViewUnApprovedAdmModal";
import ViewHostelAdmissionDetailsModal from "../drawers/ViewHostelAdmissionDetailsModal";
import { useAppSelector } from "@/store";

const CustomViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewAdmissionDetailsModal admissionno={data.value.admission_id}>
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewAdmissionDetailsModal>
    </div>
  );
};

const CustomHostelViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewHostelAdmissionDetailsModal admissionno={data.value.admission_id}>
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewHostelAdmissionDetailsModal>
    </div>
  );
};

const CustomUnApproveViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-green-500 h-full w-full">
      <ViewUnApprovedAdmModal admissionno={data.value.admission_id}>
        {({ onOpen }) => <AiOutlineCheckSquare onClick={onOpen} />}
      </ViewUnApprovedAdmModal>
    </div>
  );
};

const CustomSearchButton = (data: any) => {
  return (
    <div
      className={
        "flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl h-full w-full " +
        (data.value.status == "APPROVED"
          ? " text-green-500"
          : " text-orange-500")
      }
    >
      <ViewAdmissionDetailsModal admissionno={data.value.admission_id}>
        {({ onOpen: VeiwAdOpen }) => (
          <ViewUnApprovedAdmModal admissionno={data.value.admission_id}>
            {({ onOpen: ViewUnAdOpen }) => (
              <AiOutlineEye
                onClick={() => {
                  data.value.status == "APPROVED"
                    ? VeiwAdOpen()
                    : ViewUnAdOpen();
                }}
              />
            )}
          </ViewUnApprovedAdmModal>
        )}
      </ViewAdmissionDetailsModal>
    </div>
  );
};

const DownloadProvisional = (data: { value: any }) => {
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <IconButton
        download
        target={"_blank"}
        as={Link}
        href={
          process.env.NEXT_PUBLIC_ADMISSIONS_URL +
          `downloadprovisional.php?admissionno=${data.value.admission_id}&acadyear=${data.value.acadyear}`
        }
        aria-label="Download Provisional"
        variant={"ghost"}
        colorScheme={"green"}
        icon={<AiOutlineDownload className={"text-2xl"} />}
      />
    </div>
  );
};

const PercentageView = (data: { value: any }) => {
  return (
    <Box position={"relative"} zIndex={"base"}>
      <h1>Helo</h1>
    </Box>
  );
};

const StatusView = (data: { value: any }) => {
  return (
    <div className="flex justify-center items-center font-medium text-brand h-full w-full">
      {data.value == "APPROVED" ? (
        <Tag fontWeight={"medium"} colorScheme="whatsapp" size={"lg"}>
          Approved
        </Tag>
      ) : (
        <Tag fontWeight={"medium"} colorScheme="orange" size={"lg"}>
          Un-Approved
        </Tag>
      )}
    </div>
  );
};

export const columns = [
  {
    field: "",
    pinned: "left",
    headerName: "Download",
    width: "120px",
    cellRenderer: DownloadProvisional,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
  {
    field: "",
    pinned: "left",
    headerName: "View",
    width: "90px",
    cellRenderer: CustomViewButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
  {
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "110px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "admission_id",
    headerName: "Application No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "name",
    headerName: "Name",
    resizable: true,
    suppressMovable: true,
  },
  {
    field: "father_name",
    headerName: "Father Name",
    width: "180px",
  },
  {
    field: "phone_no",
    headerName: "Phone No.",
    width: "130px",
  },
  {
    field: "fee_fixed",
    headerName: "Fixed",
    width: "120px",
  },
  {
    field: "fee_paid",
    headerName: "Paid",
    width: "120px",
  },
  {
    field: "remaining_amount",
    headerName: "Payable",
    width: "120px",
  },
  {
    field: "referred_by",
    headerName: "Referred By",
    width: "170px",
  },
  {
    field: "approved_by",
    headerName: "Approved By",
    width: "170px",
  },
];

export const hostelcolumns = [
  {
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "120px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "admission_id",
    headerName: "Application No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "name",
    headerName: "Name",
    filter: true,
    resizable: true,
    suppressMovable: true,
  },
  {
    field: "father_name",
    headerName: "Father Name",
    width: "180px",
  },
  {
    field: "phone_no",
    headerName: "Phone No.",
    width: "130px",
  },
  {
    field: "email",
    headerName: "Email",
    width: "180px",
    resizable: true,
  },
  {
    field: "",
    headerName: "View",
    width: "120px",
    cellRenderer: CustomHostelViewButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];

export const UnAprrovedColumns = [
  {
    field: "slno",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "110px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "admission_id",
    headerName: "App No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "130px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "name",
    headerName: "Name",
    filter: true,
    resizable: true,
    suppressMovable: true,
  },
  {
    field: "father_name",
    headerName: "Father Name",
    width: "180px",
  },
  {
    field: "phone_no",
    headerName: "Phone No.",
    width: "130px",
  },
  {
    field: "email",
    headerName: "Email",
    width: "180px",
    resizable: true,
  },
  {
    field: "enquiry_date",
    headerName: "Enquiry Date",
    filter: true,
    width: "180px",
  },
  {
    field: "",
    headerName: "Approve",
    width: "120px",
    cellRenderer: CustomUnApproveViewButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];

export const SearchColumns = [
  {
    field: "",
    pinned: "left",
    headerName: "Actions",
    width: "120px",
    height: "80px",
    cellRenderer: CustomSearchButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
  {
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "110px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "admission_id",
    headerName: "Application No.",
    height: "80px",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "140px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "name",
    height: "80px",
    headerName: "Name",
    filter: true,
    resizable: true,
    suppressMovable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "college",
    headerName: "College",
    height: "80px",
    filter: true,
    width: 120,
    resizable: true,
    suppressMovable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "branch",
    headerName: "Branch",
    width: 120,
    filter: true,
    height: "80px",
    resizable: true,
    suppressMovable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "father_name",
    headerName: "Father Name",
    width: "180px",
    height: "80px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "phone_no",
    headerName: "Phone No.",
    width: "130px",
    height: "80px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: "180px",
    height: "80px",
    resizable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "status",
    headerName: "Status",
    height: "80px",
    filter: true,
    width: "180px",
    cellRenderer: StatusView,
  },
];

const CollegeLink = (data: { value: string }) => {
  return (
    <Link href={"/admin/verified/admissions/" + data.value}>
      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
        {data.value}
      </div>
    </Link>
  );
};

const BranchLink = (data: { value: string }) => {
  const router = useRouter();

  return (
    <Link href={router.asPath + "/" + data.value}>
      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
        {data.value}
      </div>
    </Link>
  );
};

export const OverallColumn = [
  {
    field: "college",
    headerName: "College",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "140px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
    cellRenderer: CollegeLink,
  },
  {
    field: "total",
    headerName: "Total Seats",
    resizable: true,
    suppressMovable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "allotted_seats",
    headerName: "Allotted Seats",
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "remaining_seats",
    headerName: "Remaining Seats",
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "filled_percentage",
    headerName: "Filled ( % )",
    width: "150px",
    cellRenderer: PercentageView,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];

export const CollegeMatrixCol = [
  {
    field: "branch",
    headerName: "Branch",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "140px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
    cellRenderer: BranchLink,
  },
  {
    field: "total",
    headerName: "Total Seats",
    resizable: true,
    suppressMovable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "allotted_seats",
    headerName: "Allotted Seats",
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "remaining_seats",
    headerName: "Remaining Seats",
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "filled_percentage",
    headerName: "Filled ( % )",
    width: "150px",
    cellRenderer: PercentageView,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];
