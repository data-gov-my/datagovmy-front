import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const Login: NextPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");

  const instance = (base: "api" | "local" | string = "api") => {
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
    return axios.create(config);
  };

  const post = (
    route: string,
    payload?: any,
    base: "api" | "local" | string = "api"
  ): Promise<AxiosResponse> => {
    return new Promise((resolve, reject) => {
      instance(base)
        .post(route, payload)
        .then((response: AxiosResponse) => resolve(response))
        .catch(err => reject(err));
    });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    await post("/api/authorize", { password }, `https://${window.location.hostname}`)
      .then(response => {
        if (response.data.authorized) {
          router.reload();
        }
      })
      .catch(e => {
        console.error(e.response?.data?.error ?? e.message);
      });
  };

  return (
    <div className="min-h-[76vh] pt-7 text-black">
      <form onSubmit={submit}>
        <div className="mx-auto max-w-sm space-y-2">
          <input
            className="border-black"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></input>
          <button type="submit">
            <span>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      meta: {
        id: "login",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
};

export default Login;
