import Button from "@components/Button";
import Container from "@components/Container";
import Input from "@components/Input";
import Metadata from "@components/Metadata";
import { toast } from "@components/Toast";
import { post } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const Login: Page = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    post("/api/authorize", { password }, `https://${window.location.hostname}`)
      .then(response => {
        if (response.data.authorized) router.reload();
      })
      .catch(e => {
        toast.error(e.message);
        setError(e.response.data.error);
      });
  };

  return (
    <div>
      <Metadata title="Polis checkpoint 👮‍♂️" keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <form onSubmit={submit}>
          <div className="mx-auto max-w-sm space-y-2">
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={e => setPassword(e)}
              validation={error}
            />

            <Button type="submit" className="btn btn-primary ml-auto">
              <span>Sign in</span>
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
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
});

export default Login;
