import { z } from "zod";
import { procedure, router } from "../trpc";

interface Matrix {
  allotted_seats: string;
  college: string;
  filled_percentage: number;
  remaining_seats: string;
  total: number;
  total_enquiries: string;
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
      console.log(response);
      const data = await response.json();
      return data as Matrix[];
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
