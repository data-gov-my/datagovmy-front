import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { parseCookies } from "./helpers";
import { getRollingToken } from "./api-edge";

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
  };
  const BROWSER_RUNTIME = typeof window !== "undefined";

  const authorization = !BROWSER_RUNTIME
    ? process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN
    : parseCookies(document.cookie).rolling_token;

  const config: AxiosRequestConfig = {
    baseURL: urls[base] || base,
    headers: {
      Authorization: `Bearer ${authorization}`,
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
  base: BaseURL = "api",
  headers: Record<string, string> = {}
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, headers)
      .get(route, { params })
      .then((response: AxiosResponse) => resolve(response))
      .catch(async (err: AxiosError<{ status: number; message: string }>) => {
        // TODO maybe add retries with axios-retry, for all fetch methods OR refactor away from rolling token
        if (err.response?.data.status === 401 && typeof window !== "undefined") {
          const edgeResponse = await getRollingToken();
          if (edgeResponse) {
            const { token } = await edgeResponse.json();
            return instance(base, { Authorization: `Bearer ${token}`, ...headers })
              .get(route, { params })
              .then((response: AxiosResponse) => resolve(response))
              .catch((err: AxiosError) => reject(err));
          } else {
            reject(err);
          }
        }
        reject(err);
      });
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
      .catch(async (err: AxiosError<{ status: number; message: string }>) => {
        // If gotten unauthorized status, reattempt on making the request, after fetching rolling token from edge
        if (err.response?.data.status === 401 && typeof window !== "undefined") {
          const edgeResponse = await getRollingToken();
          if (edgeResponse) {
            const { token } = await edgeResponse.json();
            return instance(base, { Authorization: `Bearer ${token}`, ...headers })
              .post(route, payload)
              .then((response: AxiosResponse) => resolve(response))
              .catch((err: AxiosError) => reject(err));
          } else {
            reject(err);
          }
        }
        reject(err);
      });
  });
};

/**
 * Universal PUT helper function.
 * @param route Endpoint route
 * @param payload Body payload
 * @param {"api" | "app"} base api | app
 * @param {Record<string, string>} headers Additional headers
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const put = (
  route: string,
  payload?: any,
  base: BaseURL = "api",
  headers: Record<string, string> = {}
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, headers)
      .put(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(async (err: AxiosError<{ status: number; message: string }>) => {
        // If gotten unauthorized status, reattempt on making the request, after fetching rolling token from edge
        if (err.response?.data.status === 401 && typeof window !== "undefined") {
          const edgeResponse = await getRollingToken();
          if (edgeResponse) {
            const { token } = await edgeResponse.json();
            return instance(base, { Authorization: `Bearer ${token}`, ...headers })
              .put(route, payload)
              .then((response: AxiosResponse) => resolve(response))
              .catch((err: AxiosError) => reject(err));
          } else {
            reject(err);
          }
        }
        reject(err);
      });
  });
};

/**
 * POST for AI service-based endpoints. Axios does not support text-stream requests. [https://github.com/axios/axios/issues/479]
 * Might be a good time to move away from axios in the future.
 * @param route Endpoint
 * @param payload Body
 * @returns {Promise<Response>} Text
 */

export const stream = (route: string, payload?: any): Promise<Response> => {
  return fetch(process.env.NEXT_PUBLIC_AI_URL + route, {
    method: "POST",
    headers: {
      "Accept": "text/event-stream",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${parseCookies(document.cookie).rolling_token}`,
    },
    body: JSON.stringify(payload),
  });
};
