import { post } from "datagovmy-ui/api";
import { Button, Container, Input, Metadata, toast } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
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
        if (response.data.authorized) {
          router.reload();
          toast.success("Welcome in! Give it a moment...");
        }
      })
      .catch(e => {
        toast.error(e.response?.data?.error ?? e.message);
        setError(e.response?.data?.error ?? e.message);
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

            <Button type="submit" className="btn-primary ml-auto">
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
