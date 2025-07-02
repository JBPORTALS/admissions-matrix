import { z } from "zod";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SessionData } from "@/utils/session";

interface Matrix {
  allotted_seats: string;
  college: string;
  filled_percentage: number;
  remaining_seats: string;
  total: number;
  total_enquiries: string;
}

interface BranchMatrix {
  branch: string;
  allotted_seats: string;
  college: string;
  filled_percentage: number;
  remaining_seats: string;
  total: number;
  total_enquiries: string;
  cet: string;
  comedk: string;
  management: string;
}

type BusStudent = {
  branch: string;
  bus_fee: string;
  fname: string;
  fphone_no: string;
  id: string;
  name: string;
  college: string;
  sphone_no: string;
};

interface BusSingleStudent extends Omit<BusStudent, "fphone_no" | "sphone_no"> {
  boarding_point_id: string;
  bus_fee: string;
  route_amount: string;
  paid_fee: string;
  phone_no: string;
  father_no: string;
  bus_acad_year: string;
  transport: string;
}

export type HostelCollege = {
  id: string;
  hostel_name: string;
  intake: string;
  gender: string;
  fee: string;
  address: string;
  warden_name: string;
  warden_number: string;
  created_at: string;
  updated_at: string;
  total_students: 0;
};

export type HostelStudent = {
  id: string;
  appid: string;
  reg_no: string;
  student_name: string;
  college: string;
  branch: string;
  fee_quoted: string;
  fee_fixed: string;
  fee_paid: string;
  fee_balance: string;
  acadyear: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Hostel = {
  address: string;
  created_at: string;
  fee: number;
  gender: string;
  hostel_name: string;
  id: string;
  intake: string;
  updated_at: string;
  warden_name: string;
  warden_number: string;
};

export type BusRoute = {
  id: string;
  last_point: string;
  driver_name: string;
  driver_number: string;
  route_no: string;
};

export type BusBoardingPoint = {
  created_at: string;
  driver_name: string;
  driver_number: string;
  id: string;
  boarding_point: string;
  route_no: string;
  updated_at: string;
  amount: string;
};

export const appRouter = router({
  getOverallMatrix: procedure
    .input(z.object({ acadyear: z.string(), college: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrieveoverallmatrix.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      return data as Matrix[];
    }),
  getLateralOverallMatrix: procedure
    .input(z.object({ acadyear: z.string(), college: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "leoverallmatrix.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      return data as Matrix[];
    }),
  getBusOverallMatrix: procedure
    .input(z.object({ acadyear: z.string(), college: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busoverallmatrix.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      return data as Matrix[];
    }),
  getHostelOverallMatrix: procedure
    .input(z.object({ gender: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("gender", input.gender);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostelmatrixoverall.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      return data as HostelCollege[];
    }),

  getHostelMatrixBranch: procedure
    .input(z.object({ hostelId: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("hostel_id", input.hostelId);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostelmatrixbranch.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      return data as HostelStudent[];
    }),

  /** Get hostel details by id */
  getHostelById: procedure
    .input(z.object({ hostelId: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("id", input.hostelId);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostelview.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      return data as Hostel;
    }),
  retreiveBranchMatrix: procedure
    .input(z.object({ acadyear: z.string(), college: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college as string);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrievebranchmatrix.php",
        {
          method: "POST",
          body: formData,
        }
      );
      // console.log(response);
      const data = await response.json();
      return data as BranchMatrix[];
    }),
  retreiveBusBranchMatrix: procedure
    .input(z.object({ acadyear: z.string(), college: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college as string);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busbranchmatrix.php",
        {
          method: "POST",
          body: formData,
        }
      );
      // console.log(response);
      const data = await response.json();
      return data as {
        branch: string;
        allotted: string;
        college: string;
        total: string;
      }[];
    }),
  retreiveLateralBranchMatrix: procedure
    .input(z.object({ acadyear: z.string(), college: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college as string);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "lebranchmatrix.php",
        {
          method: "POST",
          body: formData,
        }
      );
      // console.log(response);
      const data = await response.json();
      return data as BranchMatrix[];
    }),
  searchClass: procedure
    .input(
      z.object({
        acadyear: z.string(),
        college: z.string(),
        branch: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college);
      formData.append("branch", input.branch);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "searchclass.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return {
        data: data as [] | any,
        ok: response.ok,
      };
    }),

  busSearchClass: procedure
    .input(
      z.object({
        acadyear: z.string(),
        college: z.string(),
        branch: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college);
      formData.append("branch", input.branch);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busclasslist.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return {
        data: data as [] | any,
        ok: response.ok,
      };
    }),

  busViewStudent: procedure
    .input(
      z.object({
        acadyear: z.string(),
        appId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("appid", input.appId);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busstudentview.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return {
        data: data as BusSingleStudent,
        ok: response.ok,
      };
    }),

  busAddStudent: procedure
    .input(
      z.object({
        acadyear: z.string(),
        appId: z.string(),
        boardingPointId: z.string(),
        amountFixed: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("appid", input.appId);
      formData.append("boarding_point_id", input.boardingPointId);
      formData.append("amount_fixed", input.amountFixed);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busstudentadd.php",
        {
          method: "POST",
          body: formData,
        }
      );

      return {
        ok: response.ok,
      };
    }),

  busStudentDelete: procedure
    .input(
      z.object({
        appId: z.string(),
        acadyear: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("appid", input.appId);
      formData.append("acadyear", input.acadyear);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busstudentdelete.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return {
        data: data as BusSingleStudent,
        ok: response.ok,
      };
    }),

  hostelViewStudnet: procedure
    .input(
      z.object({
        acadyear: z.string(),
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("id", input.id);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostelstudnetview.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return {
        data: data as {
          acadyear: string;
          appid: string;
          created_at: string;
          created_by: string;
          fee_balance: string;
          fee_fixed: string;
          fee_paid: string;
          fee_quoted: string;
          gender: string;
          hostel_id: string;
          hostel_name: string;
          id: string;
          reg_no: string;
          student_name: string;
          updated_at: string;
        },
        ok: response.ok,
      };
    }),

  viewStudent: procedure
    .input(
      z.object({
        acadyear: z.string(),
        appId: z.string(),
        college: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("admissionno", input.appId);
      formData.append("college", input.college);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "searchstudent.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status !== 200)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: data.data,
        });

      return {
        data: data as any,
        ok: response.ok,
      };
    }),

  busRouteView: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("id", input.id);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busrouteview.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return data as BusRoute;
    }),

  busRouteList: procedure.query(async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busrouteslist.php",
      {
        method: "POST",
      }
    );
    const data = await response.json();

    return {
      data: data as {
        created_at: string;
        driver_name: string;
        driver_number: string;
        id: string;
        last_point: string;
        route_no: string;
        updated_at: string;
      }[],
      ok: response.ok,
    };
  }),

  busRouteAdd: procedure
    .input(
      z.object({
        routeNo: z.string().min(1, "Required"),
        lastPoint: z.string().min(1, "Required"),
        driverName: z.string().min(1, "Required"),
        driverNumber: z.string().min(1, "Required"),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("route_no", input.routeNo);
      fd.append("last_point", input.lastPoint);
      fd.append("driver_name", input.driverName);
      fd.append("driver_number", input.driverNumber);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busrouteadd.php",
        {
          method: "POST",
          body: fd,
        }
      );
      const data = await response.json();

      return {
        data: data as {
          created_at: string;
          driver_name: string;
          driver_number: string;
          id: string;
          last_point: string;
          route_no: string;
          updated_at: string;
        }[],
        ok: response.ok,
      };
    }),

  busBoardingPointAdd: procedure
    .input(
      z.object({
        routeId: z.string().min(1, "required"),
        boardingPoint: z.string().min(1, "Required"),
        amount: z.string().min(1, "Required"),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("boarding_point", input.boardingPoint);
      fd.append("amount", input.amount);
      fd.append("route_id", input.routeId);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busboardingadd.php",
        {
          method: "POST",
          body: fd,
        }
      );

      return {
        ok: response.ok,
      };
    }),
  busBoardingList: procedure.query(async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_ADMISSIONS_URL + `busboardinglist.php`,
      {
        method: "GET",
      }
    );
    const data = await response.json();

    return {
      data: data as BusBoardingPoint[],
      ok: response.ok,
    };
  }),
  busBoardingListByRouteId: procedure
    .input(z.object({ routeId: z.string() }))
    .query(async ({ input }) => {
      const fd = new FormData();
      fd.append("route_id", input.routeId);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
          `busboardinglist.php?route_id=${input.routeId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      return {
        data: data as BusBoardingPoint[],
        ok: response.ok,
      };
    }),
  busBoardingPointView: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("id", input.id);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busboardinview.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return data as BusBoardingPoint;
    }),

  busBoardingPointEdit: procedure
    .input(
      z.object({
        id: z.string().min(1, "required"),
        routeId: z.string().min(1, "required"),
        boardingPoint: z.string().min(1, "Required"),
        amount: z.string().min(1, "Required"),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("id", input.id);
      fd.append("boarding_point", input.boardingPoint);
      fd.append("amount", input.amount);
      fd.append("route_id", input.routeId);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busboardingedit.php",
        {
          method: "POST",
          body: fd,
        }
      );

      return {
        ok: response.ok,
      };
    }),

  busBoardingPointDelete: procedure
    .input(
      z.object({
        id: z.string().min(1, "required"),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("id", input.id);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busboardingdelete.php",
        {
          method: "POST",
          body: fd,
        }
      );

      return {
        ok: response.ok,
      };
    }),

  busRouteDelete: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("id", input.id);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busroutedelete.php",
        {
          method: "POST",
          body: fd,
        }
      );

      return {
        ok: response.ok,
      };
    }),

  busRouteEdit: procedure
    .input(
      z.object({
        id: z.string().min(1, "Required"),
        routeNo: z.string().min(1, "Required"),
        lastPoint: z.string().min(1, "Required"),
        driverName: z.string().min(1, "Required"),
        driverNumber: z.string().min(1, "Required"),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("id", input.id);
      fd.append("route_no", input.routeNo);
      fd.append("last_point", input.lastPoint);
      fd.append("driver_name", input.driverName);
      fd.append("driver_number", input.driverNumber);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busrouteedit.php",
        {
          method: "POST",
          body: fd,
        }
      );
      const data = await response.json();

      return {
        data: data as {
          created_at: string;
          driver_name: string;
          driver_number: string;
          id: string;
          last_point: string;
          route_no: string;
          updated_at: string;
        }[],
        ok: response.ok,
      };
    }),

  hostelAdd: procedure
    .input(
      z.object({
        hostelName: z.string().min(1, "Required"),
        intake: z.string().min(1, "Required"),
        gender: z.string().min(1, "Required"),
        fee: z.string().min(1, "Required"),
        address: z.string().min(2, "Required"),
        wardenName: z.string().min(2, "Required"),
        wardenNumber: z
          .string()
          .min(10, "Mobile number should be maximum 10 digits")
          .max(10, "Mobile number should be maximum 10 digits"),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("hostel_name", input.hostelName);
      fd.append("intake", input.intake);
      fd.append("gender", input.gender);
      fd.append("fee", input.fee);
      fd.append("address", input.address);
      fd.append("warden_name", input.wardenName);
      fd.append("warden_number", input.wardenNumber);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hosteladd.php",
        {
          method: "POST",
          body: fd,
        }
      );
      const data = await response.json();

      return {
        data: data as {
          created_at: string;
          driver_name: string;
          driver_number: string;
          id: string;
          last_point: string;
          route_no: string;
          updated_at: string;
        }[],
        ok: response.ok,
      };
    }),

  hostelEdit: procedure
    .input(
      z.object({
        id: z.string().min(1, "Required"),
        hostelName: z.string().min(1, "Required"),
        intake: z.string().min(1, "Required"),
        gender: z.string().min(1, "Required"),
        fee: z.string().min(1, "Required"),
        address: z.string().min(2, "Required"),
        wardenName: z.string().min(2, "Required"),
        wardenNumber: z
          .string()
          .min(10, "Mobile number should be maximum 10 digits")
          .max(10, "Mobile number should be maximum 10 digits"),
      })
    )
    .mutation(async ({ input }) => {
      const fd = new FormData();
      fd.append("id", input.id);
      fd.append("hostel_name", input.hostelName);
      fd.append("intake", input.intake);
      fd.append("gender", input.gender);
      fd.append("fee", input.fee);
      fd.append("address", input.address);
      fd.append("warden_name", input.wardenName);
      fd.append("warden_number", input.wardenNumber);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hosteledit.php",
        {
          method: "POST",
          body: fd,
        }
      );
      const data = await response.json();

      return {
        data: data as {
          created_at: string;
          driver_name: string;
          driver_number: string;
          id: string;
          last_point: string;
          route_no: string;
          updated_at: string;
        }[],
        ok: response.ok,
      };
    }),

  hostelList: procedure.query(async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostellist.php",
      {
        method: "POST",
      }
    );
    const data = await response.json();

    return {
      data: data as Hostel[],
      ok: response.ok,
    };
  }),

  busEditStudent: procedure
    .input(
      z.object({
        acadyear: z.string(),
        appId: z.string(),
        boardingPointId: z.string(),
        amountFixed: z.string(),
        amountPaid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("appid", input.appId);
      formData.append("boarding_point_id", input.boardingPointId);
      formData.append("amount_fixed", input.amountFixed);
      formData.append("amount_paid", input.amountPaid);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "busstuddentedit.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const data = await response.json();

      return {
        ok: response.ok,
      };
    }),

  hostelDeleteStudent: procedure
    .input(
      z.object({
        id: z.string(),
        acadyear: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("id", input.id);
      formData.append("acadyear", input.acadyear);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostelstudnetdelete.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const data = await response.json();

      return {
        ok: response.ok,
      };
    }),

  deleteHostel: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("id", input.id);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hosteldelete.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const data = await response.json();

      return {
        ok: response.ok,
      };
    }),

  hostelAddStudent: procedure
    .input(
      z.object({
        acadyear: z.string(),
        appId: z.string(),
        hostelId: z.string(),
        feeQuoted: z.string(),
        feeFixed: z.string(),
        feePaid: z.string(),
        feeBalance: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("appid", input.appId);
      formData.append("hostel_id", input.hostelId);
      formData.append("fee_quoted", input.feeQuoted);
      formData.append("fee_balance", input.feeBalance);
      formData.append("fee_fixed", input.feeFixed);
      formData.append("fee_paid", input.feePaid);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostelstudnetadd.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const data = await response.json();

      return {
        ok: response.ok,
      };
    }),

  hostelEditStudent: procedure
    .input(
      z.object({
        acadyear: z.string(),
        appId: z.string(),
        id: z.string(),
        hostelId: z.string(),
        feeQuoted: z.string(),
        feeFixed: z.string(),
        feePaid: z.string(),
        feeBalance: z.string(),
        createdBy: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("id", input.id);
      formData.append("appid", input.appId);
      formData.append("hostel_id", input.hostelId);
      formData.append("fee_quoted", input.feeQuoted);
      formData.append("fee_balance", input.feeBalance);
      formData.append("created_by", input.createdBy);
      formData.append("fee_fixed", input.feeFixed);
      formData.append("fee_paid", input.feePaid);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "hostelstudnetedit.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const data = await response.json();

      return {
        ok: response.ok,
      };
    }),

  lateralSearchClass: procedure
    .input(
      z.object({
        acadyear: z.string(),
        college: z.string(),
        branch: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadyear);
      formData.append("college", input.college);
      formData.append("branch", input.branch);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "leclasslist.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return {
        data: data as [] | any,
        ok: response.ok,
      };
    }),
  retrieveBranchList: procedure
    .input(
      z.object({
        college: z.string(),
        acadYear: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadYear);
      formData.append("college", input.college);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrievebrancheslist.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return data as [];
    }),
  seatMatrix: procedure
    .input(
      z.object({
        college: z.string(),
        acadYear: z.string(),
      })
    )
    .query(async ({ input }) => {
      const formData = new FormData();
      formData.append("acadyear", input.acadYear);
      formData.append("college", input.college);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "seatmatrix.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      return data as [];
    }),
  signIn: procedure
    .input(
      z.object({
        email: z.string().min(1, "Email required"),
        password: z.string().min(1, "Password required"),
      })
    )
    .mutation(async ({ input }) => {
      const formData = new FormData();
      formData.append("email", input.email);
      formData.append("password", input.password);

      console.log("data", input);
      const response = await fetch(
        process.env.NEXT_PUBLIC_FEE_URL + "usersignin.php",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(response.status);

      if (!response.ok)
        throw new TRPCError({
          message: "Invalid credentials",
          code: "BAD_REQUEST",
        });

      const user = (await response.json()) as SessionData;

      return user;
    }),
  getUser: procedure
    .input(z.string().min(1, "ID required"))
    .query(async ({ input }) => {
      try {
        // Prepare form data
        const formData = new FormData();
        formData.append("id", input);

        // Fetch user details
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_FEE_URL}usergetdetails.php`,
          {
            method: "POST", // Changed to POST as you're sending form data
            body: formData,
          }
        );

        if (!userResponse.ok) {
          throw new Error(
            `User details fetch failed: ${userResponse.statusText}`
          );
        }

        const userData = await userResponse.json();

        if (!userData) {
          throw new Error("Invalid user data");
        }

        return userData as SessionData;
      } catch (error) {
        console.error("Error in getUser procedure:", error);
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
