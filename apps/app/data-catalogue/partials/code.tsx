import CodeBlock from "@components/CodeBlock";
import type { DCChartKeys } from "@lib/types";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, useMemo } from "react";

interface CatalogueCodeProps {
  type: DCChartKeys;
  url: string;
}

const CatalogueCode: FunctionComponent<CatalogueCodeProps> = ({ type, url }) => {
  const { t } = useTranslation(["catalogue", "common"]);

  const template = useMemo(() => {
    switch (type) {
      case "GEOJSON":
        return `# ${t("code_note")}: pip install pandas matplotlib geopandas
import pandas as pd
import matplotlib.pyplot as plt
import geopandas as gpd

${t("code_comments.geojson_1")}
URL_GEOJSON = '${url}'
URL_GEOJSON_LIGHT = URL_GEOJSON.replace('.geojson','_light.geojson')
MAPSIZE = [10,5]

geo = gpd.read_file(URL_GEOJSON_LIGHT)

${t("code_comments.geojson_2")}
geo.loc[~geo.code_state.isin([12, 13, 15]), 'geometry'] = geo.geometry.translate(4.5, 0.5)

${t("code_comments.geojson_3")}
# geo.loc[~geo.code_state.isin([12, 13, 15]), 'geometry'] = geo.geometry.translate(9, 4.5)
# MAPSIZE = [7,7]

plt.rcParams.update({'font.size': 11,
                     'font.family': 'sans-serif',
                     'figure.figsize': MAPSIZE,
                     'figure.autolayout': True })
fig, ax = plt.subplots()

ax.axis('off')
ax.set_title('Your Map Title')
geo.plot(facecolor='#ffffff', linewidth=0.5, edgecolor='black', ax=ax)`;

      default: // TIMESERIES | CHOROPLETH | TABLE
        return `# ${t("code_note")}: pip install pandas fastparquet
import pandas as pd

URL_DATA = '${url}'

df = pd.read_parquet(URL_DATA)
if 'date' in df.columns: df['date'] = pd.to_datetime(df['date'])

print(df)`;
    }
  }, [type]);

  return <CodeBlock event={{ url }}>{{ python: template }}</CodeBlock>;
};

const generalQuery: APIQuery[] = [
  { param: "id", value: "<catalogue_id>", comment: "ID of data catalogue" },
  {
    param: "filter",
    value: "<value>@<column>",
    comment: "filter(s) of the response",
  },
  { param: "limit", value: "<int>", comment: "response limit (length of data)" },
  { param: "sort", value: "<column>@<order>", comment: "order of response (asc/desc)" },
  {
    param: "exclude",
    value: "<column1>,<column2>",
    comment: "columns to exclude (comma-separated)",
  },
  { param: "include", value: "<column1>,<column2>", comment: "alternative to exclude" },
  { param: "start", value: "<date>", comment: "data start date range (YYY-MM-DD)" },
  { param: "end", value: "<date>", comment: "data end date range (YYY-MM-DD)" },
];

interface SampelCodeProps {
  url: string;
  queries?: APIQuery[];
}

export type APIQuery = {
  param: string;
  value: string;
  comment?: string;
};

const SampleCode: FunctionComponent<SampelCodeProps> = ({ url, queries = [] }) => {
  const { t } = useTranslation(["catalogue", "common"]);

  const generateQueryString = (queries: APIQuery[], commentSymbol: string) => {
    return `{\n${queries
      .map(q => `\t"${q.param}": "${q.value}" ${q.comment ? `${commentSymbol} ${q.comment}` : ""}`)
      .join("\n")}\n}`;
  };

  if (queries.length === 0) {
    queries = generalQuery;
  }

  const children = {
    javascript: `
import fetch from "node-fetch";

const ENDPOINT = "https://api.data.gov.my/data-catalogue";
const params = new URLSearchParams(${generateQueryString(queries, "//")});
const response = fetch()
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
    `,
    python: `import requests
import pprint

ENDPOINT = "https://api.data.gov.my/data-catalogue" 

query_params = ${generateQueryString(queries, "#")}

response_json = requests.get(url=ENDPOINT, params=query_params).json()
pprint.pprint(response_json)`,
  };

  return <CodeBlock event={{ url }}>{children}</CodeBlock>;
};

export { SampleCode };

export default CatalogueCode;
