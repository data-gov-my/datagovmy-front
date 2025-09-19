import { metaRepo } from "@lib/data-catalogue";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { OAuthApp as GithubOauthApp } from "@octokit/oauth-app";

const ghApp = new GithubOauthApp({
  clientType: "github-app",
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
});

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
    jwt: async ({ account, token, trigger }) => {
      if (trigger === "signIn" && account?.provider === "github") {
        if (!(account.access_token && account.refresh_token && account.expires_at)) {
          throw Error("access_token and refresh_token are missing from github sign-in");
        }
        token.github = {
          accessToken: account.access_token,
          accessTokenExpiresAt: account.expires_at * 1000,
          refreshToken: account.refresh_token,
        };
      }

      // Github access token has expired, we need to refresh it
      const now = Date.now();
      if (now > token.github.accessTokenExpiresAt) {
        const { data: refreshed } = await ghApp.refreshToken({
          refreshToken: token.github.refreshToken,
        });

        token.github = {
          accessToken: refreshed.access_token,
          accessTokenExpiresAt: now + refreshed.expires_in * 1000,
          refreshToken: refreshed.refresh_token,
        };
      }

      return token;
    },
    session: ({ session, token }) => {
      session.github = {
        accessToken: token.github.accessToken,
        refreshToken: token.github.refreshToken,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
