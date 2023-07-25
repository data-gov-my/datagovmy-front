import Image from "next/image";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Metadata, Hero, Container } from "@components/index";

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={"About"} keywords={""} />
      <Hero background="hero-light-1" className="text-center">
        <div className="mb-3 flex flex-col gap-2">
          <h1>👋</h1>
          <h3>{t("about.title")}</h3>
          <p className="text-center text-dim">{t("about.description")}</p>
        </div>
        {/* TEAM STATS */}
        <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
          <TeamStats
            arrLen={t("about.dev.team", { returnObjects: true }).length}
            text={t("about.web_devs")}
          />
          <TeamStats
            arrLen={t("about.data.team", { returnObjects: true }).length}
            text={t("about.data_scientists")}
          />
          <TeamStats
            arrLen={t("about.project.team", { returnObjects: true }).length}
            text={t("about.project_leads")}
          />
        </div>
      </Hero>
      <div className="divide-y">
        {/* ENGINEERING TEAM */}
        <Section title={t("about.dev.title")} desc={t("about.dev.description")}>
          <Team teamArr={t("about.dev.team", { returnObjects: true })} />
        </Section>
        {/* DATA TEAM */}
        <Section title={t("about.data.title")} desc={t("about.data.description")}>
          <Team teamArr={t("about.data.team", { returnObjects: true })} />
        </Section>
        {/* STRATEGIC PARTNERS */}
        <Section title={t("about.project.title")} desc={t("about.project.description")}>
          <Team teamArr={t("about.data.team", { returnObjects: true })} />
        </Section>
      </div>
    </>
  );
};

const TeamStats: React.FC<{
  arrLen: number;
  text: string;
}> = ({ arrLen, text }) => {
  return (
    <div className="flex items-center gap-2 text-dim">
      <UserGroupIcon className="h-4 w-4" />
      <p className="font-bold">
        {arrLen} {text}
      </p>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  desc?: string;
  children: React.ReactNode;
}> = ({ title, desc, children }) => {
  return (
    <Container className="py-12 text-center">
      <div className="mb-12 flex flex-col gap-2">
        <h4>{title}</h4>
        {desc && <p className="text-dim">{desc}</p>}
      </div>
      {children}
    </Container>
  );
};

const Team: React.FC<{
  teamArr: TeamProfileProps[];
}> = ({ teamArr }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      {teamArr?.map(profile => <TeamProfile {...profile} />)}
    </div>
  );
};

type TeamProfileProps = {
  image: string;
  name: string;
  title: string;
  quote: string;
  linkedin: string;
};

const TeamProfile: React.FC<TeamProfileProps> = ({ image, name, title, quote, linkedin }) => {
  return (
    <div className="flex w-[250px] flex-col items-center">
      <div className="mb-4 h-[120px] w-[120px]">
        <Image height={120} width={120} src={`/static/team/${image}`} className="rounded-full" />
      </div>
      <p className="mb-1 font-medium">{name}</p>
      <p className="mb-4 text-sm font-medium text-dim">{title}</p>
      <p className="text-sm text-dim">{quote}</p>
      {/* LINKEDIN ICON */}
      {linkedin && (
        <a href={linkedin} target="_blank">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#94A3B8"
            className="mt-4 h-4 w-5"
          >
            <title>LinkedIn</title>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translation = await serverSideTranslations(locale!, ["common"]);

  return {
    notFound: true, // disable page
    props: {
      ...translation,
    },
  };
};

export default About;
