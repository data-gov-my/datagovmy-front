import axios, { AxiosResponse } from "axios";

/**
 * Base URL builder for AKSARA.
 * @param base "api" | "local"
 * @returns Base of URL
 *
 * @example "api" -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "local" -> "https://[NEXT_PUBLIC_APP_URL]/""
 */
const instance = (base: "api" | "local" = "api") => {
  return axios.create({
    baseURL: base === "api" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_APP_URL,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
    },
  });
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
  base: "api" | "local" = "api"
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
 * @param {"api" | "local"} base api | local
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const post = (
  route: string,
  payload?: any,
  base: "api" | "local" = "api"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};
