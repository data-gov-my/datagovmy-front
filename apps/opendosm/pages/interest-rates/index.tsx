import Metadata from "@components/Metadata";
import InterestRatesDashboard from "@dashboards/interest-rates";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const InterestRates = ({
  last_updated,
  timeseries,
  timeseries_opr,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.interest_rates")}
        description={t("interest_rates.description")}
        keywords={""}
      />
      <InterestRatesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_opr={timeseries_opr}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard", { dashboard: "interest_rates" });

  // Fill the "in-betweens".
  // If date for curr month does not exist, fill.
  // If date in curr month already exists, no need to fill.
  // E.g. if 2022-11-03 exists in OPR, no need to create 2022-11-01.
  // Conversely, since Oct 2022 does not contain an OPR change, fill in 2022-10-01.
  const timeseriesXTimestamps = data.timeseries.data.x;
  const oprXTimestamps = data.timeseries_opr.data.x;
  const firstOprTimestamp = data.timeseries_opr.data.x[0];
  const firstOprDate = new Date(firstOprTimestamp);
  const firstOprMonth = firstOprDate.getMonth();
  const firstOprYear = firstOprDate.getFullYear();

  let indexBeforeOpr = 0;

  for (const timeseriesTimestamp of timeseriesXTimestamps) {
    const date = new Date(timeseriesTimestamp);
    const month = date.getMonth();
    const year = date.getFullYear();

    // Check whether a date with the same month and year exists.
    // This is to indicate that we don't need to fill in for that month.
    let dateFound = false;
    for (const oprTimestamp of oprXTimestamps) {
      const oprDate = new Date(oprTimestamp);
      const oprMonth = oprDate.getMonth();
      const oprYear = oprDate.getFullYear();

      if (month === oprMonth && year === oprYear) {
        dateFound = true;
        break;
      }
    }

    // If date is not found
    if (dateFound === false) {
      // If curr timestamp is before the first OPR date, append (in order) at the start of the array.
      if (timeseriesTimestamp < firstOprTimestamp) {
        if (firstOprMonth === month && firstOprYear === year) {
          continue;
        } else {
          data.timeseries_opr.data.x.splice(indexBeforeOpr, 0, timeseriesTimestamp);
          data.timeseries_opr.data.opr.splice(indexBeforeOpr, 0, null);
          indexBeforeOpr = indexBeforeOpr + 1;
          continue;
        }
      }
      // If curr timestamp is after the first OPR date, do the following:
      // - Handle splicing between values and making sure that it is in order.
      // - Use OPR value from the previous date's value.
      else {
        for (const [oprIndex, oprTimestamp] of oprXTimestamps.entries()) {
          if (oprTimestamp > timeseriesTimestamp) {
            let indexInBetween = data.timeseries_opr.data.x.indexOf(oprTimestamp);
            data.timeseries_opr.data.x.splice(indexInBetween, 0, timeseriesTimestamp);
            data.timeseries_opr.data.opr.splice(
              indexInBetween,
              0,
              data.timeseries_opr.data.opr[oprIndex - 1]
            );
            break;
          }
        }
      }
    }
  }

  // Append recession data into OPR
  data.timeseries_opr.data["recession"] = data.timeseries.data.recession;

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
      timeseries_opr: data.timeseries_opr,
    },
  };
};

export default InterestRates;
