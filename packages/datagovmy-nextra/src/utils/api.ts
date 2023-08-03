import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Base URL builder for AKSARA.
 * @param base "api" | "local"
 * @param {Record<string, string>} headers Additional headers
 * @returns Base of URL
 *
 * @example "api"   -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "local" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (base: "ai" | "local", headers: Record<string, string> = {}) => {
  const config: AxiosRequestConfig = {
    baseURL: base === "ai" ? process.env.NEXT_PUBLIC_AI_URL : process.env.NEXT_PUBLIC_APP_URL,
    headers,
  };
  return axios.create(config);
};

/**
 * Universal GET helper function.
 * @param {string} route Endpoint URL
 * @param {Record<string, string>} params Queries
 * @param {"api" | "local"} base api | local
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const get = (
  route: string,
  params?: Record<string, any>,
  base: "ai" | "local" = "local"
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
 * @param {Record<string, string>} headers Additional headers
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const post = (
  route: string,
  payload?: any,
  headers: Record<string, string> = {},
  base: "ai" | "local" = "ai"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, headers)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

export const stream = (route: string, payload?: any) => {
  return fetch(process.env.NEXT_PUBLIC_AI_URL + route, {
    method: "POST",
    headers: {
      "Accept": "text/event-stream",
      "Content-Type": "application/json",
      "Authorization": process.env.NEXT_PUBLIC_AI_TOKEN,
    },
    body: JSON.stringify(payload),
  });
};
