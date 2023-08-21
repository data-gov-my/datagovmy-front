import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { parseCookies } from "./helpers";

type BaseURL = "api" | "app" | string;

/**
 * Base URL builder for AKSARA.
 * @param base "api" | "app"
 * @param {Record<string, string>} headers Additional headers
 * @returns Base of URL
 *
 * @example "api"   -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "app" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (base: BaseURL, headers: Record<string, string> = {}) => {
  const urls: Record<BaseURL, string> = {
    api: process.env.NEXT_PUBLIC_API_URL,
    app: process.env.NEXT_PUBLIC_APP_URL,
    // ai: process.env.NEXT_PUBLIC_AI_URL,
  };
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
    baseURL: urls[base] || base,
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
  base: BaseURL = "api"
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
  base: BaseURL = "api",
  headers: Record<string, string> = {}
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, headers)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

/**
 * POST for AI service-based endpoints. Axios does not support text-stream requests. [https://github.com/axios/axios/issues/479]
 * Might be a good time to move away from axios in the future.
 * @param route Endpoint
 * @param payload Body
 * @returns {string} Text
 */

export const stream = (route: string, payload?: any) => {
  // Uncomment when ready
  // const authorization = parseCookies(document.cookie).nekot;
  return fetch(process.env.NEXT_PUBLIC_AI_URL + route, {
    method: "POST",
    headers: {
      "Accept": "text/event-stream",
      "Content-Type": "application/json",
      "Authorization": process.env.NEXT_PUBLIC_AI_TOKEN || "",
    },
    body: JSON.stringify(payload),
  });
};
