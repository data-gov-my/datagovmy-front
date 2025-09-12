import { metaRepo } from "@lib/data-catalogue";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "repo" },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    signIn: async ({ account }) => {
      if (account?.provider === "github") {
        if (!account.access_token) {
          throw Error("access_token is missing from github sign-in");
        }
        return metaRepo.isCollaborator(account.access_token);
      }
      return false;
    },
    jwt: ({ account, token, trigger }) => {
      if (trigger === "signIn" && account?.provider === "github") {
        if (!account.access_token) {
          throw Error("access_token is missing from github sign-in");
        }
        token.github = {
          accessToken: account.access_token,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      session.github = token.github;
      return session;
    },
  },
};

export default NextAuth(authOptions);
