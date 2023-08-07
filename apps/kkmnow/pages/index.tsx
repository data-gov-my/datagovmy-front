import { InferGetStaticPropsType } from "next";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";

import { Page } from "datagovmy-ui/types";
import { Container, Metadata, Hero } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

const Home: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  // TODO: update last image after launch day
  // const imageArr = [
  //   "/static/images/home-citfgithub.png",
  //   "/static/images/home-mohgithub.png",
  //   "/static/images/home-covidnow.png",
  //   "/static/images/home-endemic.jpg",
  //   "/static/images/home-kkmnow.png",
  // ];

  const content: { date: string; title: string; description: string }[] = t(
    "home.timeline.events",
    { returnObjects: true }
  );

  // const timeline = content.map((item, index) => ({
  //   ...item,
  //   image: imageArr[index],
  // }));

  return (
    <>
      <Metadata keywords={""} />

      <Hero
        background="gray"
        className="relative flex min-h-[300px] flex-col items-center justify-center text-left md:text-center"
      >
        <h3 className="mb-3">{t("home.title")}</h3>
        <p className="text-dim max-w-3xl">{t("home.description")}</p>
      </Hero>
      <Container className="min-h-screen py-12">
        <h1 className="mb-8 text-2xl md:text-center">{t("home.timeline.title")}</h1>
        {/* {timeline.map((event, index) => (
          <div className="flex gap-8 md:block md:gap-0">
            
            {isMobile && (
              <div className="w-4">
                <div className="relative flex h-full items-center justify-center pt-1">
                  <div className="absolute top-1 left-0 z-10 h-4 w-4 rounded-full bg-black" />
                  <div className="absolute top-0 left-2 h-full border-l border-dashed border-outlineHover" />
                </div>
              </div>
            )}
            <div
              className={`
              flex flex-col-reverse gap-1 md:flex-row
              ${index === 0 ? "" : ""} 
              ${index % 2 === 0 ? "" : "md:flex-row-reverse"}
            `}
            >
            
              {!isMobile && (
                <div className="w-[10%]">
                  <div className="relative flex h-full items-center justify-center pt-1">
                    <div className="absolute top-1 z-10 h-4 w-4 rounded-full bg-black" />
                    <div className="absolute top-3 w-[80px] border-t border-black" />
                    <div className="absolute top-0 h-full border-l border-dashed border-outlineHover" />
                  </div>
                </div>
              )}
              <div className={`w-[45%] ${index % 2 === 0 ? "" : "md:text-right"}`}>
                <p className="text-dim">{event.date}</p>
              </div>
            </div>
          </div>
        ))} */}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  return {
    props: {
      meta: {
        id: "kkmnow.home",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default Home;
