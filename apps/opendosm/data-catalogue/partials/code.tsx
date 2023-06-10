import CodeBlock from "@components/CodeBlock";
import type { CatalogueType } from "@data-catalogue/show";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, useMemo } from "react";

interface CatalogueCodeProps {
  type: CatalogueType;
  url: string;
}

const CatalogueCode: FunctionComponent<CatalogueCodeProps> = ({ type, url }) => {
  const { t } = useTranslation();

  const template = useMemo(() => {
    switch (type) {
      case "GEOJSON":
        return `# ${t("catalogue.code_note")}: pip install pandas matplotlib geopandas
import pandas as pd
import matplotlib.pyplot as plt
import geopandas as gpd

${t("catalogue.code_comments.geojson_1")}
URL_GEOJSON = '${url}'
URL_GEOJSON_LIGHT = URL_GEOJSON.replace('.geojson','_light.geojson')
MAPSIZE = [10,5]

geo = gpd.read_file(URL_GEOJSON_LIGHT)

${t("catalogue.code_comments.geojson_2")}
geo.loc[~geo.code_state.isin([12, 13, 15]), 'geometry'] = geo.geometry.translate(4.5, 0.5)

${t("catalogue.code_comments.geojson_3")}
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
        return `# ${t("catalogue.code_note")}: pip install pandas fastparquet
import pandas as pd

URL_DATA = '${url}'

df = pd.read_parquet(URL_DATA)
if 'date' in df.columns: df['date'] = pd.to_datetime(df['date'])

print(df)`;
    }
  }, [type]);

  return <CodeBlock event={{ url }}>{template}</CodeBlock>;
};

export default CatalogueCode;
