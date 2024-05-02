import { z } from "zod";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

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
      // console.log(response);
      const data = await response.json();
      return data as Matrix[];
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
