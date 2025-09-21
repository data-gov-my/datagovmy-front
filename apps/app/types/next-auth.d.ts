import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's github tokens. */
    github: {
      accessToken: string;
      accessTokenExpiresAt: number;
      refreshToken: string;
    };
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    /** The user's github tokens. */
    github: {
      accessToken: string;
      refreshToken: string;
    };
  }
}
