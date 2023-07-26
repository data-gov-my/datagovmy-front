import axios, { AxiosResponse } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
  },
});

/**
 * Universal GET helper function.
 * @param url Endpoint route
 * @param params Param queries
 * @returns result
 */
export const get = <T extends any>(
  route: string,
  params?: Record<string, any>
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    API.get(route, { params })
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

/**
 * Universal POST helper function.
 * @param url Endpoint route
 * @param payload Body payload
 * @returns result
 */
export const post = <T extends any>(route: string, payload?: any): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    API.post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};
