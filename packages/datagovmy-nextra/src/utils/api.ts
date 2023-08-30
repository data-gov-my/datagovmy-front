import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Base URL builder for AKSARA.
 * @param base "api" | "app"
 * @param {Record<string, string>} headers Additional headers
 * @returns Base of URL
 *
 * @example "api"   -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "app" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (base: "ai" | "app", headers: Record<string, string> = {}) => {
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
 * @param {"api" | "app"} base api | local
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const get = (
  route: string,
  params?: Record<string, any>,
  base: "ai" | "app" = "app"
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
  base: "ai" | "app" = "ai"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, headers)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

export const stream = (route: string, payload?: any) => {
  // Uncomment when ready
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

/**
 * Parses to a cookie map.
 * @param {string} cookie Cookie string
 * @returns {Record<string, string>} Cookie map
 */
export const parseCookies = (cookie: string) => {
  const cookies = cookie.split(";");
  const parsedCookies: Record<string, string> = {};

  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split("=");
    parsedCookies[name] = decodeURIComponent(value);
  });

  return parsedCookies;
};
