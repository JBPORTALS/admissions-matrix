import { IconButton, Progress } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/router";
import {
  AiOutlineCheckSquare,
  AiOutlineDownload,
  AiOutlineEye,
} from "react-icons/ai";
import ViewAdmissionDetailsModal from "../drawers/ViewAdmissionDetailsModal";
import ViewUnApprovedAdmModal from "../drawers/ViewUnApprovedAdmModal";

const CustomViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewAdmissionDetailsModal admissionno={data.value.admission_id}>
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewAdmissionDetailsModal>
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
    <div className={"flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl h-full w-full "+(data.value.status == "APPROVED"?" text-green-500":" text-orange-500")}>
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
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <IconButton
        download
        target={"_blank"}
        as={Link}
        href={
          process.env.NEXT_PUBLIC_ADMISSIONS_URL +
          `downloadprovisional.php?admissionno=${data.value.admission_id}`
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
    <div className="flex flex-col justify-center items-center relative text-xl text-black h-full w-full">
      <h3 className="z-2 text-brand drop-shadow-lg">
        {data.value.filled_percentage} %
      </h3>
      <Progress
        w={"full"}
        hasStripe
        value={data.value.filled_percentage}
        rounded={"full"}
        isAnimated
        isIndeterminate={data.value.filled_percentage == undefined}
        size="sm"
        colorScheme="blue"
      />
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
    field: "admission_id",
    headerName: "ADD No.",
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
    headerName: "Name",
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
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "branch",
    headerName: "Branch",
    width: "100px",
    resizable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "college",
    headerName: "College",
    resizable: true,
    filter: true,
    width: "120px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "fee_fixed",
    headerName: "Fixed",
    resizable: true,
    filter: true,
    width: "120px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "fee_paid",
    headerName: "Paid",
    resizable: true,
    filter: true,
    width: "120px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "remaining_amount",
    headerName: "Payable",
    resizable: true,
    filter: true,
    width: "120px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
];

export const UnAprrovedColumns = [
  {
    field: "",
    pinned: "left",
    headerName: "Approve",
    width: "120px",
    cellRenderer: CustomUnApproveViewButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
  {
    field: "admission_id",
    headerName: "ADD No.",
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
    field: "father_name",
    headerName: "Father Name",
    width: "180px",
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
    resizable: true,
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
  {
    field: "enquiry_date",
    headerName: "Enquiry Date",
    filter: true,
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
  },
];

export const SearchColumns = [
  {
    field: "",
    pinned: "left",
    headerName: "Actions",
    width: "120px",
    cellRenderer: CustomSearchButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
  {
    field: "admission_id",
    headerName: "ADD No.",
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
    field: "father_name",
    headerName: "Father Name",
    width: "180px",
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
    filter: true,
    width: "180px",
    cellStyle: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
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
