import axios, { AxiosResponse } from "axios";

/**
 * Base URL builder for AKSARA.
 * @param base "api" | "local"
 * @param type "json" | "form"
 * @returns Base of URL
 *
 * @example "api"   -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "local" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (
  base: "api" | "local" | string = "api",
  type: "json" | "form" | string = "json"
) => {
  const baseURL =
    base === "api"
      ? process.env.NEXT_PUBLIC_API_URL
      : base === "local"
      ? process.env.NEXT_PUBLIC_APP_URL
      : base;

  const contentType =
    type === "json" ? "application/json" : type === "form" ? "multipart/form-data" : type;
  return axios.create({
    baseURL,
    headers: {
      "Authorization": process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
      "Content-Type": contentType,
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
  base: "api" | "local" | string = "api"
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
 * @param {"json" | "form"} type json | form
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const post = (
  route: string,
  type: "json" | "form" | string = "json",
  payload?: any,
  base: "api" | "local" | string = "api"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, type)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};
