import Button from "@components/Button";
import Container from "@components/Container";
import Input from "@components/Input";
import Metadata from "@components/Metadata";
import { post } from "@lib/api";
import { Page } from "@lib/types";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const Login: Page = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    post("/api/authorize", { password }, "local")
      .then(response => {
        if (response.data.authorized) router.reload();
      })
      .catch(e => {
        setError(e.response.data.error);
      });
  };

  return (
    <div>
      <Metadata title="Polis checkpoint. Lesen mana lesen" keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <form action="/api/authorize" onSubmit={submit}>
          <div className="mx-auto max-w-sm">
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={e => setPassword(e)}
              validation={error}
            />

            <Button type="submit" className="btn btn-primary ml-auto">
              Sign in
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Login;
