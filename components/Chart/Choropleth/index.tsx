import { ChartHeaderProps, default as ChartHeader } from "@components/Chart/ChartHeader";
import { Chart as ChartJS, ChartTypeRegistry } from "chart.js";
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale } from "chartjs-chart-geo";
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Chart } from "react-chartjs-2";

// import { ArrowPathIcon, MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { BREAKPOINTS } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import type { ChartCrosshairOption } from "@lib/types";
import type { FeatureCollection } from "geojson";
import type { Color } from "@hooks/useColor";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

/**
 *Choropleth component
 */

export type ChoroplethData = {
  labels: string[];
  values: number[];
};

export interface ChoroplethRef {
  toBase64: () => void;
}

interface ChoroplethProps extends ChartHeaderProps {
  className?: string;
  data?: ChoroplethData;
  prefix?: string;
  unit?: string;
  precision?: number | [number, number];
  enableZoom?: boolean;
  type?: "state" | "parlimen" | "dun" | "district";
  color?: Color;
  onReady?: (status: boolean) => void;
  _ref?: ForwardedRef<ChartJSOrUndefined<"choropleth", any[], unknown>>;
}

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  className = "w-full h-[460px]",
  controls,
  menu,
  title,
  type = "state",
  data = dummyData,
  prefix,
  precision = 1,
  unit,
  color,
  enableZoom = true,
  onReady,
  _ref,
}) => {
  const windowWidth = useWindowWidth();
  //   const ref = useRef<ChartJSOrUndefined<"choropleth", any[], unknown>>();
  const [choromap, setChoromap] = useState<FeatureCollection | undefined>(undefined);

  ChartJS.register(ChoroplethController, ProjectionScale, ColorScale, GeoFeature);

  const viewport = useMemo<"desktop" | "mobile">(() => {
    return windowWidth < BREAKPOINTS.MD ? "mobile" : "desktop";
  }, [windowWidth]);

  useEffect(() => {
    import(`@lib/geojson/${type}/_${viewport}`).then(item => {
      setChoromap(item.default as unknown as FeatureCollection);
    });
  }, [type, viewport]);

  const options: ChartCrosshairOption<"choropleth"> = {
    elements: {
      geoFeature: {
        outlineBorderColor: "black",
      },
    },
    maintainAspectRatio: false,
    showOutline: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item: any) {
            //   if (!item.raw.feature.properties[type]) return "";
            //   if (!item.raw.value)
            //     return `${item.raw.feature.properties[type]}: ${t("common.no_data")}`;
            return `${item.raw.feature.properties[type]}${`: ${prefix ?? ""}${numFormat(
              item.raw.value,
              "standard",
              precision
            )}${unit ?? ""}`}`;
          },
        },
      },
      crosshair: false,
    },
    scales: {
      xy: {
        projection: "mercator",
      },
      color: {
        display: false,
        interpolate: color,
        missing: "#fff",
      },
    },
  };

  useEffect(() => {
    if (onReady) onReady(true);
  }, [choromap]);

  return (
    <div className="relative">
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={["p-4 transition-all", className].join(" ")}>
        {choromap && (
          <Chart
            ref={_ref}
            type="choropleth"
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: "",
                  borderWidth: 0.25,
                  borderColor: "#000",
                  outline: choromap.features,
                  data: choromap
                    ? choromap.features.map((feature: any) => ({
                        feature: feature,
                        value: data.values[data.labels.indexOf(feature.properties[type])],
                      }))
                    : [],
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
      {/* {enableZoom && (
          <div className="absolute right-1 top-1 z-10 flex w-fit justify-end gap-2">
            <button className="rounded border bg-white p-1 active:bg-outline" onClick={onReset}>
              <ArrowPathIcon className="h-4 w-4 p-0.5" />
            </button>
            <div>
              <button
                className="rounded rounded-r-none border bg-white p-1 active:bg-outline"
                onClick={zoomIn}
              >
                <PlusSmallIcon className="h-4 w-4" />
              </button>
              <button
                className="rounded rounded-l-none border border-l-0 bg-white p-1 active:bg-outline"
                onClick={zoomOut}
              >
                <MinusSmallIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )} */}
    </div>
  );
};
const dummyData = {
  labels: [
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Pulau Pinang",
    "Perak",
    "Perlis",
    "Selangor",
    "Terengganu",
    "Sabah",
    "Sarawak",
    "W.P. Kuala Lumpur",
    "W.P. Labuan",
    "W.P. Putrajaya",
  ],
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
};

const dummyParlimen = {
  labels: [
    "P.001 Padang Besar",
    "P.002 Kangar",
    "P.003 Arau",
    "P.004 Langkawi",
    "P.005 Jerlun",
    "P.006 Kubang Pasu",
    "P.007 Padang Terap",
    "P.008 Pokok Sena",
    "P.009 Alor Setar",
    "P.010 Kuala Kedah",
    "P.011 Pendang",
    "P.012 Jerai",
    "P.013 Sik",
    "P.014 Merbok",
    "P.015 Sungai Petani",
    "P.016 Baling",
    "P.017 Padang Serai",
    "P.018 Kulim-Bandar Baharu",
    "P.019 Tumpat",
    "P.020 Pengkalan Chepa",
    "P.021 Kota Bharu",
    "P.022 Pasir Mas",
    "P.023 Rantau Panjang",
    "P.024 Kubang Kerian",
    "P.025 Bachok",
    "P.026 Ketereh",
    "P.027 Tanah Merah",
    "P.028 Pasir Puteh",
    "P.029 Machang",
    "P.030 Jeli",
    "P.031 Kuala Krai",
    "P.032 Gua Musang",
    "P.033 Besut",
    "P.034 Setiu",
    "P.035 Kuala Nerus",
    "P.036 Kuala Terengganu",
    "P.037 Marang",
    "P.038 Hulu Terengganu",
    "P.039 Dungun",
    "P.040 Kemaman",
    "P.041 Kepala Batas",
    "P.042 Tasek Gelugor",
    "P.043 Bagan",
    "P.044 Permatang Pauh",
    "P.045 Bukit Mertajam",
    "P.046 Batu Kawan",
    "P.047 Nibong Tebal",
    "P.048 Bukit Bendera",
    "P.049 Tanjong",
    "P.050 Jelutong",
    "P.051 Bukit Gelugor",
    "P.052 Bayan Baru",
    "P.053 Balik Pulau",
    "P.054 Gerik",
    "P.055 Lenggong",
    "P.056 Larut",
    "P.057 Parit Buntar",
    "P.058 Bagan Serai",
    "P.059 Bukit Gantang",
    "P.060 Taiping",
    "P.061 Padang Rengas",
    "P.062 Sungai Siput",
    "P.063 Tambun",
    "P.064 Ipoh Timor",
    "P.065 Ipoh Barat",
    "P.066 Batu Gajah",
    "P.067 Kuala Kangsar",
    "P.068 Beruas",
    "P.069 Parit",
    "P.070 Kampar",
    "P.071 Gopeng",
    "P.072 Tapah",
    "P.073 Pasir Salak",
    "P.074 Lumut",
    "P.075 Bagan Datuk",
    "P.076 Teluk Intan",
    "P.077 Tanjong Malim",
    "P.078 Cameron Highlands",
    "P.079 Lipis",
    "P.080 Raub",
    "P.081 Jerantut",
    "P.082 Indera Mahkota",
    "P.083 Kuantan",
    "P.084 Paya Besar",
    "P.085 Pekan",
    "P.086 Maran",
    "P.087 Kuala Krau",
    "P.088 Temerloh",
    "P.089 Bentong",
    "P.090 Bera",
    "P.091 Rompin",
    "P.092 Sabak Bernam",
    "P.093 Sungai Besar",
    "P.094 Hulu Selangor",
    "P.095 Tanjong Karang",
    "P.096 Kuala Selangor",
    "P.097 Selayang",
    "P.098 Gombak",
    "P.099 Ampang",
    "P.100 Pandan",
    "P.101 Hulu Langat",
    "P.102 Bangi",
    "P.103 Puchong",
    "P.104 Subang",
    "P.105 Petaling Jaya",
    "P.106 Damansara",
    "P.107 Sungai Buloh",
    "P.108 Shah Alam",
    "P.109 Kapar",
    "P.110 Klang",
    "P.111 Kota Raja",
    "P.112 Kuala Langat",
    "P.113 Sepang",
    "P.114 Kepong",
    "P.115 Batu",
    "P.116 Wangsa Maju",
    "P.117 Segambut",
    "P.118 Setiawangsa",
    "P.119 Titiwangsa",
    "P.120 Bukit Bintang",
    "P.121 Lembah Pantai",
    "P.122 Seputeh",
    "P.123 Cheras",
    "P.124 Bandar Tun Razak",
    "P.125 Putrajaya",
    "P.126 Jelebu",
    "P.127 Jempol",
    "P.128 Seremban",
    "P.129 Kuala Pilah",
    "P.130 Rasah",
    "P.131 Rembau",
    "P.132 Port Dickson",
    "P.133 Tampin",
    "P.134 Masjid Tanah",
    "P.135 Alor Gajah",
    "P.136 Tangga Batu",
    "P.137 Hang Tuah Jaya",
    "P.138 Kota Melaka",
    "P.139 Jasin",
    "P.140 Segamat",
    "P.141 Sekijang",
    "P.142 Labis",
    "P.143 Pagoh",
    "P.144 Ledang",
    "P.145 Bakri",
    "P.146 Muar",
    "P.147 Parit Sulong",
    "P.148 Ayer Hitam",
    "P.149 Sri Gading",
    "P.150 Batu Pahat",
    "P.151 Simpang Renggam",
    "P.152 Kluang",
    "P.153 Sembrong",
    "P.154 Mersing",
    "P.155 Tenggara",
    "P.156 Kota Tinggi",
    "P.157 Pengerang",
    "P.158 Tebrau",
    "P.159 Pasir Gudang",
    "P.160 Johor Bahru",
    "P.161 Pulai",
    "P.162 Iskandar Puteri",
    "P.163 Kulai",
    "P.164 Pontian",
    "P.165 Tanjung Piai",
    "P.166 Labuan",
    "P.167 Kudat",
    "P.168 Kota Marudu",
    "P.169 Kota Belud",
    "P.170 Tuaran",
    "P.171 Sepanggar",
    "P.172 Kota Kinabalu",
    "P.173 Putatan",
    "P.174 Penampang",
    "P.175 Papar",
    "P.176 Kimanis",
    "P.177 Beaufort",
    "P.178 Sipitang",
    "P.179 Ranau",
    "P.180 Keningau",
    "P.181 Tenom",
    "P.182 Pensiangan",
    "P.183 Beluran",
    "P.184 Libaran",
    "P.185 Batu Sapi",
    "P.186 Sandakan",
    "P.187 Kinabatangan",
    "P.188 Lahad Datu",
    "P.189 Semporna",
    "P.190 Tawau",
    "P.191 Kalabakan",
    "P.192 Mas Gading",
    "P.193 Santubong",
    "P.194 Petra Jaya",
    "P.195 Bandar Kuching",
    "P.196 Stampin",
    "P.197 Kota Samarahan",
    "P.198 Puncak Borneo",
    "P.199 Serian",
    "P.200 Batang Sadong",
    "P.201 Batang Lupar",
    "P.202 Sri Aman",
    "P.203 Lubok Antu",
    "P.204 Betong",
    "P.205 Saratok",
    "P.206 Tanjong Manis",
    "P.207 Igan",
    "P.208 Sarikei",
    "P.209 Julau",
    "P.210 Kanowit",
    "P.211 Lanang",
    "P.212 Sibu",
    "P.213 Mukah",
    "P.214 Selangau",
    "P.215 Kapit",
    "P.216 Hulu Rajang",
    "P.217 Bintulu",
    "P.218 Sibuti",
    "P.219 Miri",
    "P.220 Baram",
    "P.221 Limbang",
    "P.222 Lawas",
  ],
  values: [
    1.5071114784045931, 1.1976785086176576, 1.530010943682128, 1.0585979828290406,
    1.1680296834772075, 0.9936015384798016, 1.2829621810357077, 0.9271463494316581,
    0.9953703703703705, 0.8007029599352329, 0.8525261004144589, 1.0068567304222302,
    0.8065610640401729, 0.9915903100288691, 0.9047876759838709, 1.035343223991652,
    0.8169775087068321, 1.3161771928101367, 1.164393910777018, 0.8036636858823079,
    0.9156718313436627, 1.24143576062572, 1.0915924503635919, 0.9432928833116274,
    1.1126258850433177, 1.4114990119506916, 0.8874982221590101, 1.2355014574770402,
    1.113186629611068, 1.456822978801505, 1.2156940605097972, 1.5126221498371335,
    1.0169177073549704, 1.2157063673203223, 0.8329183830519217, 0.7881297588343489,
    0.8616928446771378, 1.0892707517753877, 0.7999565241019511, 1.1260414572095505,
    1.0197669104204754, 0.8011351878676796, 1.0635231727000232, 0.7355612059571377,
    0.8202155873043031, 1.2042486005454285, 1.2710229182487023, 1.034176934528523,
    1.013948356930836, 1.1989100817438691, 0.7449347893771838, 1.2874403045841678,
    1.3323246981813692, 1.8989853182926137, 1.575279140886139, 1.4274852689602737,
    1.1066454808860642, 1.4078955666267263, 1.4228650137741046, 1.3307719175689836,
    1.2232213700079344, 1.882598784194529, 1.0919435485788094, 0.8501329886400357,
    0.9781496038114977, 1.0926365795724466, 1.2238921427782075, 1.5348513581729128,
    1.3194553960994586, 1.4143895879677282, 1.0426811801775995, 2.1255528417717344,
    1.5282862471506529, 1.3734893003658943, 1.7557036897943856, 1.1169311354182714,
    1.615476946974511, 2.491572622013777, 1.0705515547829927, 1.286687263024856, 1.2397916913244171,
    0.831545634119921, 0.9226090389367333, 1.0820127351941398, 1.4302211015880752,
    1.0165245459363106, 1.230661040787623, 0.9101155930740084, 1.0024950989128498,
    1.3485305324541932, 1.6589279416950746, 1.0766965212563069, 0.856127817359399,
    1.1496294382639305, 1.1066476109544594, 1.2244012198325585, 0.8133142555915355,
    0.6736796599178615, 0.7922936616507068, 0.521236517520772, 0.8804156431381928,
    0.7838486562884562, 1.000237372207807, 0.524253720915935, 1.1279367704675787,
    0.5531237564663749, 0.7236721190957545, 0.6723291559671956, 0.917902867819479,
    0.8313215835042566, 0.7956814464746195, 1.146086068190525, 1.020964571166181,
    0.36921211787234626, 0.5443776177487646, 0.5341169909264463, 0.4529312452698376,
    0.9223429631592897, 0.8342838520449732, 0.4101290589607555, 0.666847945719872,
    0.4575669276998725, 0.416400632928962, 0.6111568172833438, 0.4563853196055527,
    1.2481756594854816, 1.1483016425945558, 0.8915292661162606, 0.9948932880307624,
    0.7487934723120553, 0.7491248118118663, 1.3399119029455915, 1.2634678228233087,
    0.736107333877255, 0.9847272332691316, 0.7752355896750264, 0.7739726746689349,
    1.0745348099486824, 0.7076045092193317, 1.1436824232015301, 0.9751190671703072,
    1.2336905540237073, 0.7644590403211092, 1.032719206358987, 1.0043041606886656,
    0.6986475379212433, 0.7864088380376025, 0.7672199434680042, 1.0274636510500808,
    0.843133346621487, 1.2044146947547516, 1.2434805060676477, 0.9438528557599225,
    0.8204000507463949, 0.8610703529230056, 0.6673522066693248, 0.7566593135510805,
    0.6000745654785506, 0.8620117148587443, 0.878924708600231, 0.6462487083495672,
    0.7969938482984332, 0.7380931874946172, 1.0788049625028275, 0.7184038702871797,
    0.8572922111866178, 1.5582034830430798, 1.4891225025147434, 1.3671375898952287,
    1.2649856714089498, 1.3678643078606603, 0.8026620500483396, 1.876873305104905,
    0.8695652173913043, 1.5009508285791904, 1.0951228829746593, 1.8492462311557787,
    2.1778645482698265, 0.8973547948735972, 0.7667824074074074, 1.326031549218158,
    1.0215240178166591, 1.7878666130976297, 1.9961265900787888, 1.7408053496147695,
    1.5287111054492182, 1.5164731933167819, 1.404032353789022, 2.0081141078308793,
    1.3564533706990503, 1.0188940548026513, 1.3176929366626833, 1.2390628872071523,
    0.7903720916889003, 0.47122549940509734, 0.73486857158239, 1.5927718157955821,
    1.2356643626674906, 1.2621958750154378, 1.6606782928752957, 1.634721776064532,
    1.3445845697329377, 1.0259567046270648, 1.5769500018422316, 1.2044719223500016,
    1.2345679012345678, 1.3588850174216027, 1.1816038375023712, 1.4474374672030785,
    1.6676658128508364, 1.607478024939139, 1.8311201095694636, 1.1247152619589977,
    1.4645496851902546, 1.706804879138555, 1.3112404081288473, 1.0681358219024062,
    1.0733870026834675, 0.7871216737761527, 1.1024406441972439, 1.138633639632441,
    1.0757361729870696,
  ],
};

export default Choropleth;
