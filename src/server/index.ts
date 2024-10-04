import { appRouter } from "./routers";
import { createCallerFactory } from "./trpc";

export const createCaller = createCallerFactory(appRouter);
