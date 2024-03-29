import { OptionType } from "datagovmy-ui/types";
import { numFormat } from "datagovmy-ui/helpers";

export const STATES: Array<OptionType> = (() => {
  return [
    "Malaysia",
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
  ].map(item => ({ label: item, value: item }));
})();

export const STATE_MAP: Record<string, string> = (() => {
  return STATES.reduce((prev, current) => {
    return { ...prev, ...{ [current.value]: current.label } };
  }, {});
})();

export const PARLIMENS: Record<string, Array<OptionType>> = {
  "Johor": [
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
  ].map(item => ({ label: item, value: item })),
  "Kedah": [
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
  ].map(item => ({ label: item, value: item })),
  "Kelantan": [
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
  ].map(item => ({ label: item, value: item })),
  "Melaka": [
    "P.134 Masjid Tanah",
    "P.135 Alor Gajah",
    "P.136 Tangga Batu",
    "P.137 Hang Tuah Jaya",
    "P.138 Kota Melaka",
    "P.139 Jasin",
  ].map(item => ({ label: item, value: item })),
  "Negeri Sembilan": [
    "P.126 Jelebu",
    "P.127 Jempol",
    "P.128 Seremban",
    "P.129 Kuala Pilah",
    "P.130 Rasah",
    "P.131 Rembau",
    "P.132 Port Dickson",
    "P.133 Tampin",
  ].map(item => ({ label: item, value: item })),
  "Pahang": [
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
  ].map(item => ({ label: item, value: item })),
  "Pulau Pinang": [
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
  ].map(item => ({ label: item, value: item })),
  "Perak": [
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
  ].map(item => ({ label: item, value: item })),
  "Perlis": ["P.001 Padang Besar", "P.002 Kangar", "P.003 Arau"].map(item => ({
    label: item,
    value: item,
  })),
  "Selangor": [
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
  ].map(item => ({ label: item, value: item })),
  "Terengganu": [
    "P.033 Besut",
    "P.034 Setiu",
    "P.035 Kuala Nerus",
    "P.036 Kuala Terengganu",
    "P.037 Marang",
    "P.038 Hulu Terengganu",
    "P.039 Dungun",
    "P.040 Kemaman",
  ].map(item => ({ label: item, value: item })),
  "Sabah": [
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
  ].map(item => ({ label: item, value: item })),
  "Sarawak": [
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
  ].map(item => ({ label: item, value: item })),
  "W.P. Kuala Lumpur": [
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
  ].map(item => ({ label: item, value: item })),
  "W.P. Labuan": ["P.166 Labuan"].map(item => ({ label: item, value: item })),
  "W.P. Putrajaya": ["P.125 Putrajaya"].map(item => ({ label: item, value: item })),
};

export const DUNS: Record<string, Array<OptionType>> = {
  "Johor": [
    "N.01 Buloh Kasap",
    "N.02 Jementah",
    "N.03 Pemanis",
    "N.04 Kemelah",
    "N.05 Tenang",
    "N.06 Bekok",
    "N.07 Bukit Kepong",
    "N.08 Bukit Pasir",
    "N.09 Gambir",
    "N.10 Tangkak",
    "N.11 Serom",
    "N.12 Bentayan",
    "N.13 Simpang Jeram",
    "N.14 Bukit Naning",
    "N.15 Maharani",
    "N.16 Sungai Balang",
    "N.17 Semerah",
    "N.18 Sri Medan",
    "N.19 Yong Peng",
    "N.20 Semarang",
    "N.21 Parit Yaani",
    "N.22 Parit Raja",
    "N.23 Penggaram",
    "N.24 Senggarang",
    "N.25 Rengit",
    "N.26 Machap",
    "N.27 Layang-Layang",
    "N.28 Mengkibol",
    "N.29 Mahkota",
    "N.30 Paloh",
    "N.31 Kahang",
    "N.32 Endau",
    "N.33 Tenggaroh",
    "N.34 Panti",
    "N.35 Pasir Raja",
    "N.36 Sedili",
    "N.37 Johor Lama",
    "N.38 Penawar",
    "N.39 Tanjung Surat",
    "N.40 Tiram",
    "N.41 Puteri Wangsa",
    "N.42 Johor Jaya",
    "N.43 Permas",
    "N.44 Larkin",
    "N.45 Stulang",
    "N.46 Perling",
    "N.47 Kempas",
    "N.48 Skudai",
    "N.49 Kota Iskandar",
    "N.50 Bukit Permai",
    "N.51 Bukit Batu",
    "N.52 Senai",
    "N.53 Benut",
    "N.54 Pulai Sebatang",
    "N.55 Pekan Nanas",
    "N.56 Kukup",
  ].map(item => ({ label: item, value: item })),
  "Kedah": [
    "N.01 Ayer Hangat",
    "N.02 Kuah",
    "N.03 Kota Siputeh",
    "N.04 Ayer Hitam",
    "N.05 Bukit Kayu Hitam",
    "N.06 Jitra",
    "N.07 Kuala Nerang",
    "N.08 Pedu",
    "N.09 Bukit Lada",
    "N.10 Bukit Pinang",
    "N.11 Derga",
    "N.12 Suka Menanti",
    "N.13 Kota Darul Aman",
    "N.14 Alor Mengkudu",
    "N.15 Anak Bukit",
    "N.16 Kubang Rotan",
    "N.17 Pengkalan Kundor",
    "N.18 Tokai",
    "N.19 Sungai Tiang",
    "N.20 Sungai Limau",
    "N.21 Guar Chempedak",
    "N.22 Gurun",
    "N.23 Belantek",
    "N.24 Jeneri",
    "N.25 Bukit Selambau",
    "N.26 Tanjong Dawai",
    "N.27 Pantai Merdeka",
    "N.28 Bakar Arang",
    "N.29 Sidam",
    "N.30 Bayu",
    "N.31 Kupang",
    "N.32 Kuala Ketil",
    "N.33 Merbau Pulas",
    "N.34 Lunas",
    "N.35 Kulim",
    "N.36 Bandar Baharu",
  ].map(item => ({ label: item, value: item })),
  "Kelantan": [
    "N.01 Pengkalan Kubor",
    "N.02 Kelaboran",
    "N.03 Pasir Pekan",
    "N.04 Wakaf Bharu",
    "N.05 Kijang",
    "N.06 Chempaka",
    "N.07 Panchor",
    "N.08 Tanjong Mas",
    "N.09 Kota Lama",
    "N.10 Bunut Payong",
    "N.11 Tendong",
    "N.12 Pengkalan Pasir",
    "N.13 Meranti",
    "N.14 Chetok",
    "N.15 Gual Periok",
    "N.16 Apam Putra",
    "N.17 Salor",
    "N.18 Pasir Tumboh",
    "N.19 Demit",
    "N.20 Tawang",
    "N.21 Pantai Irama",
    "N.22 Jelawat",
    "N.23 Melor",
    "N.24 Kadok",
    "N.25 Kok Lanas",
    "N.26 Bukit Panau",
    "N.27 Gual Ipoh",
    "N.28 Kemahang",
    "N.29 Selising",
    "N.30 Limbongan",
    "N.31 Semerak",
    "N.32 Gaal",
    "N.33 Pulai Chondong",
    "N.34 Temangan",
    "N.35 Kemuning",
    "N.36 Bukit Bunga",
    "N.37 Air Lanas",
    "N.38 Kuala Balah",
    "N.39 Mengkebang",
    "N.40 Guchil",
    "N.41 Manek Urai",
    "N.42 Dabong",
    "N.43 Nenggiri",
    "N.44 Paloh",
    "N.45 Galas",
  ].map(item => ({ label: item, value: item })),
  "Melaka": [
    "N.01 Kuala Linggi",
    "N.02 Tanjung Bidara",
    "N.03 Ayer Limau",
    "N.04 Lendu",
    "N.05 Taboh Naning",
    "N.06 Rembia",
    "N.07 Gadek",
    "N.08 Machap Jaya",
    "N.09 Durian Tunggal",
    "N.10 Asahan",
    "N.11 Sungai Udang",
    "N.12 Pantai Kundor",
    "N.13 Paya Rumput",
    "N.14 Kelebang",
    "N.15 Pengkalan Batu",
    "N.16 Ayer Keroh",
    "N.17 Bukit Katil",
    "N.18 Ayer Molek",
    "N.19 Kesidang",
    "N.20 Kota Laksamana",
    "N.21 Duyong",
    "N.22 Bandar Hilir",
    "N.23 Telok Mas",
    "N.24 Bemban",
    "N.25 Rim",
    "N.26 Serkam",
    "N.27 Merlimau",
    "N.28 Sungai Rambai",
  ].map(item => ({ label: item, value: item })),
  "Negeri Sembilan": [
    "N.01 Chennah",
    "N.02 Pertang",
    "N.03 Sungai Lui",
    "N.04 Klawang",
    "N.05 Serting",
    "N.06 Palong",
    "N.07 Jeram Padang",
    "N.08 Bahau",
    "N.09 Lenggeng",
    "N.10 Nilai",
    "N.11 Lobak",
    "N.12 Temiang",
    "N.13 Sikamat",
    "N.14 Ampangan",
    "N.15 Juasseh",
    "N.16 Seri Menanti",
    "N.17 Senaling",
    "N.18 Pilah",
    "N.19 Johol",
    "N.20 Labu",
    "N.21 Bukit Kepayang",
    "N.22 Rahang",
    "N.23 Mambau",
    "N.24 Seremban Jaya",
    "N.25 Paroi",
    "N.26 Chembong",
    "N.27 Rantau",
    "N.28 Kota",
    "N.29 Chuah",
    "N.30 Lukut",
    "N.31 Bagan Pinang",
    "N.32 Linggi",
    "N.33 Sri Tanjung",
    "N.34 Gemas",
    "N.35 Gemencheh",
    "N.36 Repah",
  ].map(item => ({ label: item, value: item })),
  "Pahang": [
    "N.01 Tanah Rata",
    "N.02 Jelai",
    "N.03 Padang Tengku",
    "N.04 Cheka",
    "N.05 Benta",
    "N.06 Batu Talam",
    "N.07 Tras",
    "N.08 Dong",
    "N.09 Tahan",
    "N.10 Damak",
    "N.11 Pulau Tawar",
    "N.12 Beserah",
    "N.13 Semambu",
    "N.14 Teruntum",
    "N.15 Tanjung Lumpur",
    "N.16 Inderapura",
    "N.17 Sungai Lembing",
    "N.18 Lepar",
    "N.19 Panching",
    "N.20 Pulau Manis",
    "N.21 Peramu Jaya",
    "N.22 Bebar",
    "N.23 Chini",
    "N.24 Luit",
    "N.25 Kuala Sentul",
    "N.26 Chenor",
    "N.27 Jenderak",
    "N.28 Kerdau",
    "N.29 Jengka",
    "N.30 Mentakab",
    "N.31 Lanchang",
    "N.32 Kuala Semantan",
    "N.33 Bilut",
    "N.34 Ketari",
    "N.35 Sabai",
    "N.36 Pelangai",
    "N.37 Guai",
    "N.38 Triang",
    "N.39 Kemayan",
    "N.40 Bukit Ibam",
    "N.41 Muadzam Shah",
    "N.42 Tioman",
  ].map(item => ({ label: item, value: item })),
  "Pulau Pinang": [
    "N.01 Penaga",
    "N.02 Bertam",
    "N.03 Pinang Tunggal",
    "N.04 Permatang Berangan",
    "N.05 Sungai Dua",
    "N.06 Telok Ayer Tawar",
    "N.07 Sungai Puyu",
    "N.08 Bagan Jermal",
    "N.09 Bagan Dalam",
    "N.10 Seberang Jaya",
    "N.11 Permatang Pasir",
    "N.12 Penanti",
    "N.13 Berapit",
    "N.14 Machang Bubuk",
    "N.15 Padang Lalang",
    "N.16 Perai",
    "N.17 Bukit Tengah",
    "N.18 Bukit Tambun",
    "N.19 Jawi",
    "N.20 Sungai Bakap",
    "N.21 Sungai Acheh",
    "N.22 Tanjong Bunga",
    "N.23 Air Putih",
    "N.24 Kebun Bunga",
    "N.25 Pulau Tikus",
    "N.26 Padang Kota",
    "N.27 Pengkalan Kota",
    "N.28 Komtar",
    "N.29 Datok Keramat",
    "N.30 Sungai Pinang",
    "N.31 Batu Lancang",
    "N.32 Seri Delima",
    "N.33 Air Itam",
    "N.34 Paya Terubong",
    "N.35 Batu Uban",
    "N.36 Pantai Jerejak",
    "N.37 Batu Maung",
    "N.38 Bayan Lepas",
    "N.39 Pulau Betong",
    "N.40 Telok Bahang",
  ].map(item => ({ label: item, value: item })),
  "Perak": [
    "N.01 Pengkalan Hulu",
    "N.02 Temengor",
    "N.03 Kenering",
    "N.04 Kota Tampan",
    "N.05 Selama",
    "N.06 Kubu Gajah",
    "N.07 Batu Kurau",
    "N.08 Titi Serong",
    "N.09 Kuala Kurau",
    "N.10 Alor Pongsu",
    "N.11 Gunong Semanggol",
    "N.12 Selinsing",
    "N.13 Kuala Sepetang",
    "N.14 Changkat Jering",
    "N.15 Trong",
    "N.16 Kamunting",
    "N.17 Pokok Assam",
    "N.18 Aulong",
    "N.19 Chenderoh",
    "N.20 Lubok Merbau",
    "N.21 Lintang",
    "N.22 Jalong",
    "N.23 Manjoi",
    "N.24 Hulu Kinta",
    "N.25 Canning",
    "N.26 Tebing Tinggi",
    "N.27 Pasir Pinji",
    "N.28 Bercham",
    "N.29 Kepayang",
    "N.30 Buntong",
    "N.31 Jelapang",
    "N.32 Menglembu",
    "N.33 Tronoh",
    "N.34 Bukit Chandan",
    "N.35 Manong",
    "N.36 Pengkalan Baharu",
    "N.37 Pantai Remis",
    "N.38 Astaka",
    "N.39 Belanja",
    "N.40 Bota",
    "N.41 Malim Nawar",
    "N.42 Keranji",
    "N.43 Tualang Sekah",
    "N.44 Sungai Rapat",
    "N.45 Simpang Pulai",
    "N.46 Teja",
    "N.47 Chenderiang",
    "N.48 Ayer Kuning",
    "N.49 Sungai Manik",
    "N.50 Kampong Gajah",
    "N.51 Pasir Panjang",
    "N.52 Pangkor",
    "N.53 Rungkup",
    "N.54 Hutan Melintang",
    "N.55 Pasir Bedamar",
    "N.56 Changkat Jong",
    "N.57 Sungkai",
    "N.58 Slim",
    "N.59 Behrang",
  ].map(item => ({ label: item, value: item })),
  "Perlis": [
    "N.01 Titi Tinggi",
    "N.02 Beseri",
    "N.03 Chuping",
    "N.04 Mata Ayer",
    "N.05 Santan",
    "N.06 Bintong",
    "N.07 Sena",
    "N.08 Indera Kayangan",
    "N.09 Kuala Perlis",
    "N.10 Kayang",
    "N.11 Pauh",
    "N.12 Tambun Tulang",
    "N.13 Guar Sanji",
    "N.14 Simpang Empat",
    "N.15 Sanglang",
  ].map(item => ({ label: item, value: item })),
  "Selangor": [
    "N.01 Sungai Air Tawar",
    "N.02 Sabak",
    "N.03 Sungai Panjang",
    "N.04 Sekinchan",
    "N.05 Hulu Bernam",
    "N.06 Kuala Kubu Baharu",
    "N.07 Batang Kali",
    "N.08 Sungai Burong",
    "N.09 Permatang",
    "N.10 Bukit Melawati",
    "N.11 Ijok",
    "N.12 Jeram",
    "N.13 Kuang",
    "N.14 Rawang",
    "N.15 Taman Templer",
    "N.16 Sungai Tua",
    "N.17 Gombak Setia",
    "N.18 Hulu Kelang",
    "N.19 Bukit Antarabangsa",
    "N.20 Lembah Jaya",
    "N.21 Pandan Indah",
    "N.22 Teratai",
    "N.23 Dusun Tua",
    "N.24 Semenyih",
    "N.25 Kajang",
    "N.26 Sungai Ramal",
    "N.27 Balakong",
    "N.28 Seri Kembangan",
    "N.29 Seri Serdang",
    "N.30 Kinrara",
    "N.31 Subang Jaya",
    "N.32 Seri Setia",
    "N.33 Taman Medan",
    "N.34 Bukit Gasing",
    "N.35 Kampung Tunku",
    "N.36 Bandar Utama",
    "N.37 Bukit Lanjan",
    "N.38 Paya Jaras",
    "N.39 Kota Damansara",
    "N.40 Kota Anggerik",
    "N.41 Batu Tiga",
    "N.42 Meru",
    "N.43 Sementa",
    "N.44 Selat Klang",
    "N.45 Bandar Baru Klang",
    "N.46 Pelabuhan Klang",
    "N.47 Pandamaran",
    "N.48 Sentosa",
    "N.49 Sungai Kandis",
    "N.50 Kota Kemuning",
    "N.51 Sijangkang",
    "N.52 Banting",
    "N.53 Morib",
    "N.54 Tanjong Sepat",
    "N.55 Dengkil",
    "N.56 Sungai Pelek",
  ].map(item => ({ label: item, value: item })),
  "Terengganu": [
    "N.01 Kuala Besut",
    "N.02 Kota Putera",
    "N.03 Jertih",
    "N.04 Hulu Besut",
    "N.05 Jabi",
    "N.06 Permaisuri",
    "N.07 Langkap",
    "N.08 Batu Rakit",
    "N.09 Tepuh",
    "N.10 Buluh Gading",
    "N.11 Seberang Takir",
    "N.12 Bukit Tunggal",
    "N.13 Wakaf Mempelam",
    "N.14 Bandar",
    "N.15 Ladang",
    "N.16 Batu Buruk",
    "N.17 Alur Limbat",
    "N.18 Bukit Payung",
    "N.19 Ru Rendang",
    "N.20 Pengkalan Berangan",
    "N.21 Telemung",
    "N.22 Manir",
    "N.23 Kuala Berang",
    "N.24 Ajil",
    "N.25 Bukit Besi",
    "N.26 Rantau Abang",
    "N.27 Sura",
    "N.28 Paka",
    "N.29 Kemasik",
    "N.30 Kijal",
    "N.31 Cukai",
    "N.32 Air Putih",
  ].map(item => ({ label: item, value: item })),
  "Sabah": [
    "N.01 Banggi",
    "N.02 Bengkoka",
    "N.03 Pitas",
    "N.04 Tanjong Kapor",
    "N.05 Matunggong",
    "N.06 Bandau",
    "N.07 Tandek",
    "N.08 Pintasan",
    "N.09 Tempasuk",
    "N.10 Usukan",
    "N.11 Kadamaian",
    "N.12 Sulaman",
    "N.13 Pantai Dalit",
    "N.14 Tamparuli",
    "N.15 Kiulu",
    "N.16 Karambunai",
    "N.17 Darau",
    "N.18 Inanam",
    "N.19 Likas",
    "N.20 Api-Api",
    "N.21 Luyang",
    "N.22 Tanjung Aru",
    "N.23 Petagas",
    "N.24 Tanjung Keramat",
    "N.25 Kapayan",
    "N.26 Moyog",
    "N.27 Limbahau",
    "N.28 Kawang",
    "N.29 Pantai Manis",
    "N.30 Bongawan",
    "N.31 Membakut",
    "N.32 Klias",
    "N.33 Kuala Penyu",
    "N.34 Lumadan",
    "N.35 Sindumin",
    "N.36 Kundasang",
    "N.37 Karanaan",
    "N.38 Paginatan",
    "N.39 Tambunan",
    "N.40 Bingkor",
    "N.41 Liawan",
    "N.42 Melalap",
    "N.43 Kemabong",
    "N.44 Tulid",
    "N.45 Sook",
    "N.46 Nabawan",
    "N.47 Telupid",
    "N.48 Sugut",
    "N.49 Labuk",
    "N.50 Gum-Gum",
    "N.51 Sungai Manila",
    "N.52 Sungai Sibuga",
    "N.53 Sekong",
    "N.54 Karamunting",
    "N.55 Elopura",
    "N.56 Tanjong Papat",
    "N.57 Kuamut",
    "N.58 Lamag",
    "N.59 Sukau",
    "N.60 Tungku",
    "N.61 Segama",
    "N.62 Silam",
    "N.63 Kunak",
    "N.64 Sulabayan",
    "N.65 Senallang",
    "N.66 Bugaya",
    "N.67 Balung",
    "N.68 Apas",
    "N.69 Sri Tanjong",
    "N.70 Kukusan",
    "N.71 Tanjung Batu",
    "N.72 Merotai",
    "N.73 Sebatik",
  ].map(item => ({ label: item, value: item })),
  "Sarawak": [
    "N.01 Opar",
    "N.02 Tasik Biru",
    "N.03 Tanjong Datu",
    "N.04 Pantai Damai",
    "N.05 Demak Laut",
    "N.06 Tupong",
    "N.07 Samariang",
    "N.08 Satok",
    "N.09 Padungan",
    "N.10 Pending",
    "N.11 Batu Lintang",
    "N.12 Kota Sentosa",
    "N.13 Batu Kitang",
    "N.14 Batu Kawah",
    "N.15 Asajaya",
    "N.16 Muara Tuang",
    "N.17 Stakan",
    "N.18 Serembu",
    "N.19 Mambong",
    "N.20 Tarat",
    "N.21 Tebedu",
    "N.22 Kedup",
    "N.23 Bukit Semuja",
    "N.24 Sadong Jaya",
    "N.25 Simunjan",
    "N.26 Gedong",
    "N.27 Sebuyau",
    "N.28 Lingga",
    "N.29 Beting Maro",
    "N.30 Balai Ringin",
    "N.31 Bukit Begunan",
    "N.32 Simanggang",
    "N.33 Engkilili",
    "N.34 Batang Ai",
    "N.35 Saribas",
    "N.36 Layar",
    "N.37 Bukit Saban",
    "N.38 Kalaka",
    "N.39 Krian",
    "N.40 Kabong",
    "N.41 Kuala Rajang",
    "N.42 Semop",
    "N.43 Daro",
    "N.44 Jemoreng",
    "N.45 Repok",
    "N.46 Meradong",
    "N.47 Pakan",
    "N.48 Meluan",
    "N.49 Ngemah",
    "N.50 Machan",
    "N.51 Bukit Assek",
    "N.52 Dudong",
    "N.53 Bawang Assan",
    "N.54 Pelawan",
    "N.55 Nangka",
    "N.56 Dalat",
    "N.57 Tellian",
    "N.58 Balingian",
    "N.59 Tamin",
    "N.60 Kakus",
    "N.61 Pelagus",
    "N.62 Katibas",
    "N.63 Bukit Goram",
    "N.64 Baleh",
    "N.65 Belaga",
    "N.66 Murum",
    "N.67 Jepak",
    "N.68 Tanjong Batu",
    "N.69 Kemena",
    "N.70 Samalaju",
    "N.71 Bekenu",
    "N.72 Lambir",
    "N.73 Piasau",
    "N.74 Pujut",
    "N.75 Senadin",
    "N.76 Marudi",
    "N.77 Telang Usan",
    "N.78 Mulu",
    "N.79 Bukit Kota",
    "N.80 Batu Danau",
    "N.81 Ba`Kelalan",
    "N.82 Bukit Sari",
  ].map(item => ({ label: item, value: item })),
};

export const DISTRICTS: Record<string, Array<OptionType>> = {
  "Johor": [
    "Batu Pahat",
    "Johor Bahru",
    "Kluang",
    "Kota Tinggi",
    "Mersing",
    "Muar",
    "Pontian",
    "Segamat",
    "Kulai",
    "Tangkak",
  ].map(item => ({ label: item, value: item })),
  "Kedah": [
    "Baling",
    "Bandar Baharu",
    "Kota Setar",
    "Kuala Muda",
    "Kubang Pasu",
    "Kulim",
    "Langkawi",
    "Padang Terap",
    "Sik",
    "Yan",
    "Pendang",
    "Pokok Sena",
  ].map(item => ({ label: item, value: item })),
  "Kelantan": [
    "Bachok",
    "Kota Bharu",
    "Machang",
    "Pasir Mas",
    "Pasir Puteh",
    "Tanah Merah",
    "Tumpat",
    "Gua Musang",
    "Kuala Krai",
    "Jeli",
    "Kecil Lojing",
  ].map(item => ({ label: item, value: item })),
  "Melaka": ["Alor Gajah", "Jasin", "Melaka Tengah"].map(item => ({ label: item, value: item })),
  "Negeri Sembilan": [
    "Jelebu",
    "Kuala Pilah",
    "Port Dickson",
    "Rembau",
    "Seremban",
    "Tampin",
    "Jempol",
  ].map(item => ({ label: item, value: item })),
  "Pahang": [
    "Bentong",
    "Cameron Highlands",
    "Jerantut",
    "Kuantan",
    "Lipis",
    "Pekan",
    "Raub",
    "Temerloh",
    "Rompin",
    "Maran",
    "Bera",
  ].map(item => ({ label: item, value: item })),
  "Pulau Pinang": [
    "Seberang Perai Tengah",
    "Seberang Perai Utara",
    "Seberang Perai Selatan",
    "Timur Laut",
    "Barat Daya",
  ].map(item => ({ label: item, value: item })),
  "Perak": [
    "Batang Padang",
    "Manjung",
    "Kinta",
    "Kerian",
    "Kuala Kangsar",
    "Larut Dan Matang",
    "Hilir Perak",
    "Hulu Perak",
    "Perak Tengah",
    "Kampar",
    "Muallim",
    "Bagan Datuk",
    "Selama",
  ].map(item => ({ label: item, value: item })),
  "Perlis": ["Perlis"].map(item => ({ label: item, value: item })),
  "Selangor": [
    "Gombak",
    "Klang",
    "Kuala Langat",
    "Kuala Selangor",
    "Petaling",
    "Sabak Bernam",
    "Sepang",
    "Ulu Langat",
    "Ulu Selangor",
  ].map(item => ({ label: item, value: item })),
  "Terengganu": [
    "Besut",
    "Dungun",
    "Kemaman",
    "Kuala Terengganu",
    "Marang",
    "Hulu Terengganu",
    "Setiu",
    "Kuala Nerus",
  ].map(item => ({ label: item, value: item })),
  "Sabah": [
    "Tawau",
    "Lahad Datu",
    "Semporna",
    "Sandakan",
    "Kinabatangan",
    "Beluran",
    "Kota Kinabalu",
    "Ranau",
    "Kota Belud",
    "Tuaran",
    "Penampang",
    "Papar",
    "Kudat",
    "Kota Marudu",
    "Pitas",
    "Beaufort",
    "Kuala Penyu",
    "Sipitang",
    "Tenom",
    "Nabawan",
    "Keningau",
    "Tambunan",
    "Kunak",
    "Tongod",
    "Putatan",
    "Telupid",
    "Kalabakan",
  ].map(item => ({ label: item, value: item })),
  "Sarawak": [
    "Kuching",
    "Bau",
    "Lundu",
    "Samarahan",
    "Serian",
    "Simunjan",
    "Sri Aman",
    "Lubok Antu",
    "Betong",
    "Saratok",
    "Sarikei",
    "Maradong",
    "Daro",
    "Julau",
    "Sibu",
    "Dalat",
    "Mukah",
    "Kanowit",
    "Bintulu",
    "Tatau",
    "Kapit",
    "Song",
    "Belaga",
    "Miri",
    "Marudi",
    "Limbang",
    "Lawas",
    "Matu",
    "Asajaya",
    "Pakan",
    "Selangau",
    "Tebedu",
    "Pusa",
    "Kabong",
    "Tanjung Manis",
    "Sebauh",
    "Bukit Mabong",
    "Subis",
    "Beluru",
    "Telang Usan",
  ].map(item => ({ label: item, value: item })),
  "W.P. Kuala Lumpur": ["W.P. Kuala Lumpur"].map(item => ({ label: item, value: item })),
  "W.P. Labuan": ["W.P. Labuan"].map(item => ({ label: item, value: item })),
  "W.P. Putrajaya": ["W.P. Putrajaya"].map(item => ({ label: item, value: item })),
};

export const jitterTooltipFormats: any = {
  income_mean: (value: number) => `RM ${numFormat(value, "standard", 0)}`,
  expenditure_mean: (value: number) => `RM ${numFormat(value, "standard", 0)}`,
  gini: (value: number) => numFormat(value, "compact", 1),
  poverty: (value: number) => numFormat(value, "compact", 1) + "%",
  labour_urate: (value: number) => numFormat(value, "compact", 1) + "%",
  labour_prate: (value: number) => numFormat(value, "compact", 1) + "%",
  agegroup_working: (value: number) => numFormat(value, "compact", 1) + "%",
  total_area: (value: number) => `${numFormat(value, "standard", 0)} km^2`,
  max_elevation: (value: number) => `${numFormat(value, "standard", 0)} m`,
  ruggedness: (_value: number) => "",
  watercover: (_value: number) => "",
  treecover: (_value: number) => "",
  treeloss: (_value: number) => "",
  nightlights: (_value: number) => "",
  population_density: (value: number) => numFormat(value, "standard", 0) + " /km^2",
  female_male: (value: number) => numFormat(value, "compact", 1),
  household_size: (value: number) => numFormat(value, "compact", 1),
  birth_rate: (value: number) => numFormat(value, "compact", 1),
  death_rate: (value: number) => numFormat(value, "compact", 1),
  dep_young: (value: number) => numFormat(value, "compact", 1),
  dep_old: (value: number) => numFormat(value, "compact", 1),
  electricity: (value: number) => numFormat(value, "compact", 1) + "%",
  water: (value: number) => numFormat(value, "compact", 1) + "%",
  hospital: (value: number) => numFormat(value, "compact", 1),
  clinic: (value: number) => numFormat(value, "compact", 1),
  school: (value: number) => numFormat(value, "compact", 1),
  police_fire: (value: number) => numFormat(value, "compact", 1),
  grocery: (value: number) => numFormat(value, "compact", 1),
};
