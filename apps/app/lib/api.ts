import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";

/**
 * Base URL builder for AKSARA.
 * @param base "api" | "local"
 * @param {boolean} contentTypeHeader add Content-Type: "multipart/form-data" to header
 * @returns Base of URL
 *
 * @example "api"   -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "local" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (base: "api" | "local" | string = "api", contentTypeHeader?: boolean) => {
  const config: AxiosRequestConfig = {
    baseURL:
      base === "api"
        ? process.env.NEXT_PUBLIC_API_URL
        : base === "local"
        ? process.env.NEXT_PUBLIC_APP_URL
        : base,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
    },
  };
  if (contentTypeHeader)
    config.headers = {
      ...config.headers,
      ["Content-Type"]: "multipart/form-data",
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
 * @param {boolean} contentTypeHeader add Content-Type: "multipart/form-data" to header
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const post = (
  route: string,
  payload?: any,
  base: "api" | "local" | string = "api",
  contentTypeHeader: boolean = false
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, contentTypeHeader)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};
