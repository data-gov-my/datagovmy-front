import CodeBlock, { Language } from "@components/CodeBlock";
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

interface SampelCodeProps {
  url: string;
  catalogueId?: string;
}
const SampleCode: FunctionComponent<SampelCodeProps> = ({
  catalogueId = "<catalogue_id>",
  url,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);

  const sampleUrl = `https://api.data.gov.my/data-catalogue?id=${catalogueId}&limit=3`;

  const children: Partial<Record<Language, string>> = {
    javascript: `
import fetch from "node-fetch";

const url = "${sampleUrl}";

const response = fetch(url)
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
    `,
    python: `import requests
import pprint

url = "${sampleUrl}" 

response_json = requests.get(url=url).json()
pprint.pprint(response_json)`,
    dart: `var request = http.Request('GET', Uri.parse("${sampleUrl}"));

http.StreamedResponse response = await request.send();

if (response.statusCode == 200) {
  print(await response.stream.bytesToString());
}
else {
  print(response.reasonPhrase);
}
    `,
    swift: `import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

var request = URLRequest(url: URL(string: "${sampleUrl}")!,
  timeoutInterval: Double.infinity)
request.httpMethod = "GET"

let task = URLSession.shared.dataTask(with: request) { data, response, error in 
  guard let data = data else {
    print(String(describing: error))
    exit(EXIT_SUCCESS)
  }
  print(String(data: data, encoding: .utf8)!)
  exit(EXIT_SUCCESS)
}

task.resume()
dispatchMain()
    `,
    kotlin: `import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.util.concurrent.TimeUnit

val client = OkHttpClient()
val request = Request.Builder()
  .url("${sampleUrl}")
  .build()
val response = client.newCall(request).execute()

println(response.body!!.string())
    `,
    java: `OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
MediaType mediaType = MediaType.parse("text/plain");
RequestBody body = RequestBody.create(mediaType, "");
Request request = new Request.Builder()
  .url("https://api.data.gov.my/data-catalogue?id=<id>&limit=3")
  .method("GET", body)
  .build();
Response response = client.newCall(request).execute();`,
  };

  return <CodeBlock event={{ url }}>{children}</CodeBlock>;
};

export { SampleCode };

export default CatalogueCode;
