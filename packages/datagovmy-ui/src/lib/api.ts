import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { parseCookies } from "./helpers";

/**
 * Base URL builder for AKSARA.
 * @param base "api" | "app"
 * @param {Record<string, string>} headers Additional headers
 * @returns Base of URL
 *
 * @example "api"   -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "app" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (base: "api" | "app" | string = "api", headers: Record<string, string> = {}) => {
  const BROWSER_RUNTIME = typeof window === "object";

  /**
   * Uncomment & pass to Authorization header once BE supports the rollling token
   */
  // const authorization = !BROWSER_RUNTIME
  //   ? process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN
  //   : process.env.APP_ENV === "development"
  //   ? process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN
  //   : parseCookies(document.cookie).nekot;
  const config: AxiosRequestConfig = {
    baseURL:
      base === "api"
        ? process.env.NEXT_PUBLIC_API_URL
        : base === "app"
        ? process.env.NEXT_PUBLIC_APP_URL
        : base,
    headers: {
      "Authorization": process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
      // Remove below later. For testing only
      "x-csrftoken": BROWSER_RUNTIME ? parseCookies(document.cookie).nekot : "master token",
      ...headers,
    },
  };
  return axios.create(config);
};

/**
 * Universal GET helper function.
 * @param {string} route Endpoint URL
 * @param {Record<string, string>} params Queries
 * @param {"api" | "app"} base api | local
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const get = (
  route: string,
  params?: Record<string, any>,
  base: "api" | "app" | string = "api"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base)
      .get(route, { params })
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

/**
 * Universal POST helper function.
 * @param route Endpoint route
 * @param payload Body payload
 * @param {"api" | "app"} base api | local
 * @param {Record<string, string>} headers Additional headers
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const post = (
  route: string,
  payload?: any,
  base: "api" | "app" | string = "api",
  headers: Record<string, string> = {}
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, headers)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};
