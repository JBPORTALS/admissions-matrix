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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user data",
        });
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
