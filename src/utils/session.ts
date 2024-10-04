import { SessionOptions } from "iron-session";

export type SessionData = {
  id: string;
  email: string;
  fullname: string;
  college: string;
  can_update_total: boolean;
};

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_PASSWORD!,
  cookieName: "authSession",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
