import { Container, ErrorStatus, Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { ComponentProps, useEffect, useState } from "react";

const ActiveLink = ({ children, className, ...props }: ComponentProps<"a">) => {
  const { asPath, isReady } = useRouter();
  const [legacyPath, setLegacyPath] = useState<string>(props.href as string);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      setLegacyPath(`https://archive.data.gov.my${asPath}`);
    }
  }, [isReady]);

  return (
    <a href={legacyPath} className={className} target="_blank">
      {children}
    </a>
  );
};

const Error404: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Metadata title={t("error.404.title") as string} keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorStatus
          title={t("error.404.title") as string}
          description={
            <>
              {`${t("error.404.description")} ${t("error.404.legacy")}`}
              <ActiveLink className="link-primary">{"https://archive.data.gov.my"}</ActiveLink>
            </>
          }
          code={404}
          reason={t("error.404.reason")}
        />
      </Container>
    </>
  );
};

export default Error404;

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  return {
    props: {
      meta: {
        id: "error-400",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});
