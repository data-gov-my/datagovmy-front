import type { OptionType } from "@components/types";
import { numFormat } from "@lib/helpers";

export const STATES: Array<OptionType> = [
  {
    label: "Malaysia",
    value: "malaysia",
  },
  {
    label: "Johor",
    value: "johor",
  },
  {
    label: "Kedah",
    value: "kedah",
  },
  {
    label: "Kelantan",
    value: "kelantan",
  },
  {
    label: "Melaka",
    value: "melaka",
  },
  {
    label: "Negeri Sembilan",
    value: "negeri_sembilan",
  },
  {
    label: "Pahang",
    value: "pahang",
  },
  {
    label: "Pulau Pinang",
    value: "pulau_pinang",
  },
  {
    label: "Perak",
    value: "perak",
  },
  {
    label: "Perlis",
    value: "perlis",
  },
  {
    label: "Selangor",
    value: "selangor",
  },
  {
    label: "Terengganu",
    value: "terengganu",
  },
  {
    label: "Sabah",
    value: "sabah",
  },
  {
    label: "Sarawak",
    value: "sarawak",
  },
  {
    label: "W.P. Kuala Lumpur",
    value: "w.p._kuala_lumpur",
  },
  {
    label: "W.P. Labuan",
    value: "w.p._labuan",
  },
  {
    label: "W.P. Putrajaya",
    value: "w.p._putrajaya",
  },
];

export const STATE_MAP: Record<string, string> = (() => {
  return STATES.reduce((prev, current) => {
    return { ...prev, ...{ [current.value]: current.label } };
  }, {});
})();

export const PARLIMENS: Record<string, Array<OptionType>> = {
  "johor": [
    {
      label: "P.140 Segamat",
      value: "p.140_segamat",
    },
    {
      label: "P.141 Sekijang",
      value: "p.141_sekijang",
    },
    {
      label: "P.142 Labis",
      value: "p.142_labis",
    },
    {
      label: "P.143 Pagoh",
      value: "p.143_pagoh",
    },
    {
      label: "P.144 Ledang",
      value: "p.144_ledang",
    },
    {
      label: "P.145 Bakri",
      value: "p.145_bakri",
    },
    {
      label: "P.146 Muar",
      value: "p.146_muar",
    },
    {
      label: "P.147 Parit Sulong",
      value: "p.147_parit_sulong",
    },
    {
      label: "P.148 Ayer Hitam",
      value: "p.148_ayer_hitam",
    },
    {
      label: "P.149 Sri Gading",
      value: "p.149_sri_gading",
    },
    {
      label: "P.150 Batu Pahat",
      value: "p.150_batu_pahat",
    },
    {
      label: "P.151 Simpang Renggam",
      value: "p.151_simpang_renggam",
    },
    {
      label: "P.152 Kluang",
      value: "p.152_kluang",
    },
    {
      label: "P.153 Sembrong",
      value: "p.153_sembrong",
    },
    {
      label: "P.154 Mersing",
      value: "p.154_mersing",
    },
    {
      label: "P.155 Tenggara",
      value: "p.155_tenggara",
    },
    {
      label: "P.156 Kota Tinggi",
      value: "p.156_kota_tinggi",
    },
    {
      label: "P.157 Pengerang",
      value: "p.157_pengerang",
    },
    {
      label: "P.158 Tebrau",
      value: "p.158_tebrau",
    },
    {
      label: "P.159 Pasir Gudang",
      value: "p.159_pasir_gudang",
    },
    {
      label: "P.160 Johor Bahru",
      value: "p.160_johor_bahru",
    },
    {
      label: "P.161 Pulai",
      value: "p.161_pulai",
    },
    {
      label: "P.162 Iskandar Puteri",
      value: "p.162_iskandar_puteri",
    },
    {
      label: "P.163 Kulai",
      value: "p.163_kulai",
    },
    {
      label: "P.164 Pontian",
      value: "p.164_pontian",
    },
    {
      label: "P.165 Tanjung Piai",
      value: "p.165_tanjung_piai",
    },
  ],
  "kedah": [
    {
      label: "P.004 Langkawi",
      value: "p.004_langkawi",
    },
    {
      label: "P.005 Jerlun",
      value: "p.005_jerlun",
    },
    {
      label: "P.006 Kubang Pasu",
      value: "p.006_kubang_pasu",
    },
    {
      label: "P.007 Padang Terap",
      value: "p.007_padang_terap",
    },
    {
      label: "P.008 Pokok Sena",
      value: "p.008_pokok_sena",
    },
    {
      label: "P.009 Alor Setar",
      value: "p.009_alor_setar",
    },
    {
      label: "P.010 Kuala Kedah",
      value: "p.010_kuala_kedah",
    },
    {
      label: "P.011 Pendang",
      value: "p.011_pendang",
    },
    {
      label: "P.012 Jerai",
      value: "p.012_jerai",
    },
    {
      label: "P.013 Sik",
      value: "p.013_sik",
    },
    {
      label: "P.014 Merbok",
      value: "p.014_merbok",
    },
    {
      label: "P.015 Sungai Petani",
      value: "p.015_sungai_petani",
    },
    {
      label: "P.016 Baling",
      value: "p.016_baling",
    },
    {
      label: "P.017 Padang Serai",
      value: "p.017_padang_serai",
    },
    {
      label: "P.018 Kulim-Bandar Baharu",
      value: "p.018_kulim-bandar_baharu",
    },
  ],
  "kelantan": [
    {
      label: "P.019 Tumpat",
      value: "p.019_tumpat",
    },
    {
      label: "P.020 Pengkalan Chepa",
      value: "p.020_pengkalan_chepa",
    },
    {
      label: "P.021 Kota Bharu",
      value: "p.021_kota_bharu",
    },
    {
      label: "P.022 Pasir Mas",
      value: "p.022_pasir_mas",
    },
    {
      label: "P.023 Rantau Panjang",
      value: "p.023_rantau_panjang",
    },
    {
      label: "P.024 Kubang Kerian",
      value: "p.024_kubang_kerian",
    },
    {
      label: "P.025 Bachok",
      value: "p.025_bachok",
    },
    {
      label: "P.026 Ketereh",
      value: "p.026_ketereh",
    },
    {
      label: "P.027 Tanah Merah",
      value: "p.027_tanah_merah",
    },
    {
      label: "P.028 Pasir Puteh",
      value: "p.028_pasir_puteh",
    },
    {
      label: "P.029 Machang",
      value: "p.029_machang",
    },
    {
      label: "P.030 Jeli",
      value: "p.030_jeli",
    },
    {
      label: "P.031 Kuala Krai",
      value: "p.031_kuala_krai",
    },
    {
      label: "P.032 Gua Musang",
      value: "p.032_gua_musang",
    },
  ],
  "melaka": [
    {
      label: "P.134 Masjid Tanah",
      value: "p.134_masjid_tanah",
    },
    {
      label: "P.135 Alor Gajah",
      value: "p.135_alor_gajah",
    },
    {
      label: "P.136 Tangga Batu",
      value: "p.136_tangga_batu",
    },
    {
      label: "P.137 Hang Tuah Jaya",
      value: "p.137_hang_tuah_jaya",
    },
    {
      label: "P.138 Kota Melaka",
      value: "p.138_kota_melaka",
    },
    {
      label: "P.139 Jasin",
      value: "p.139_jasin",
    },
  ],
  "negeri_sembilan": [
    {
      label: "P.126 Jelebu",
      value: "p.126_jelebu",
    },
    {
      label: "P.127 Jempol",
      value: "p.127_jempol",
    },
    {
      label: "P.128 Seremban",
      value: "p.128_seremban",
    },
    {
      label: "P.129 Kuala Pilah",
      value: "p.129_kuala_pilah",
    },
    {
      label: "P.130 Rasah",
      value: "p.130_rasah",
    },
    {
      label: "P.131 Rembau",
      value: "p.131_rembau",
    },
    {
      label: "P.132 Port Dickson",
      value: "p.132_port_dickson",
    },
    {
      label: "P.133 Tampin",
      value: "p.133_tampin",
    },
  ],
  "pahang": [
    {
      label: "P.078 Cameron Highlands",
      value: "p.078_cameron_highlands",
    },
    {
      label: "P.079 Lipis",
      value: "p.079_lipis",
    },
    {
      label: "P.080 Raub",
      value: "p.080_raub",
    },
    {
      label: "P.081 Jerantut",
      value: "p.081_jerantut",
    },
    {
      label: "P.082 Indera Mahkota",
      value: "p.082_indera_mahkota",
    },
    {
      label: "P.083 Kuantan",
      value: "p.083_kuantan",
    },
    {
      label: "P.084 Paya Besar",
      value: "p.084_paya_besar",
    },
    {
      label: "P.085 Pekan",
      value: "p.085_pekan",
    },
    {
      label: "P.086 Maran",
      value: "p.086_maran",
    },
    {
      label: "P.087 Kuala Krau",
      value: "p.087_kuala_krau",
    },
    {
      label: "P.088 Temerloh",
      value: "p.088_temerloh",
    },
    {
      label: "P.089 Bentong",
      value: "p.089_bentong",
    },
    {
      label: "P.090 Bera",
      value: "p.090_bera",
    },
    {
      label: "P.091 Rompin",
      value: "p.091_rompin",
    },
  ],
  "pulau_pinang": [
    {
      label: "P.041 Kepala Batas",
      value: "p.041_kepala_batas",
    },
    {
      label: "P.042 Tasek Gelugor",
      value: "p.042_tasek_gelugor",
    },
    {
      label: "P.043 Bagan",
      value: "p.043_bagan",
    },
    {
      label: "P.044 Permatang Pauh",
      value: "p.044_permatang_pauh",
    },
    {
      label: "P.045 Bukit Mertajam",
      value: "p.045_bukit_mertajam",
    },
    {
      label: "P.046 Batu Kawan",
      value: "p.046_batu_kawan",
    },
    {
      label: "P.047 Nibong Tebal",
      value: "p.047_nibong_tebal",
    },
    {
      label: "P.048 Bukit Bendera",
      value: "p.048_bukit_bendera",
    },
    {
      label: "P.049 Tanjong",
      value: "p.049_tanjong",
    },
    {
      label: "P.050 Jelutong",
      value: "p.050_jelutong",
    },
    {
      label: "P.051 Bukit Gelugor",
      value: "p.051_bukit_gelugor",
    },
    {
      label: "P.052 Bayan Baru",
      value: "p.052_bayan_baru",
    },
    {
      label: "P.053 Balik Pulau",
      value: "p.053_balik_pulau",
    },
  ],
  "perak": [
    {
      label: "P.054 Gerik",
      value: "p.054_gerik",
    },
    {
      label: "P.055 Lenggong",
      value: "p.055_lenggong",
    },
    {
      label: "P.056 Larut",
      value: "p.056_larut",
    },
    {
      label: "P.057 Parit Buntar",
      value: "p.057_parit_buntar",
    },
    {
      label: "P.058 Bagan Serai",
      value: "p.058_bagan_serai",
    },
    {
      label: "P.059 Bukit Gantang",
      value: "p.059_bukit_gantang",
    },
    {
      label: "P.060 Taiping",
      value: "p.060_taiping",
    },
    {
      label: "P.061 Padang Rengas",
      value: "p.061_padang_rengas",
    },
    {
      label: "P.062 Sungai Siput",
      value: "p.062_sungai_siput",
    },
    {
      label: "P.063 Tambun",
      value: "p.063_tambun",
    },
    {
      label: "P.064 Ipoh Timor",
      value: "p.064_ipoh_timor",
    },
    {
      label: "P.065 Ipoh Barat",
      value: "p.065_ipoh_barat",
    },
    {
      label: "P.066 Batu Gajah",
      value: "p.066_batu_gajah",
    },
    {
      label: "P.067 Kuala Kangsar",
      value: "p.067_kuala_kangsar",
    },
    {
      label: "P.068 Beruas",
      value: "p.068_beruas",
    },
    {
      label: "P.069 Parit",
      value: "p.069_parit",
    },
    {
      label: "P.070 Kampar",
      value: "p.070_kampar",
    },
    {
      label: "P.071 Gopeng",
      value: "p.071_gopeng",
    },
    {
      label: "P.072 Tapah",
      value: "p.072_tapah",
    },
    {
      label: "P.073 Pasir Salak",
      value: "p.073_pasir_salak",
    },
    {
      label: "P.074 Lumut",
      value: "p.074_lumut",
    },
    {
      label: "P.075 Bagan Datuk",
      value: "p.075_bagan_datuk",
    },
    {
      label: "P.076 Teluk Intan",
      value: "p.076_teluk_intan",
    },
    {
      label: "P.077 Tanjong Malim",
      value: "p.077_tanjong_malim",
    },
  ],
  "perlis": [
    {
      label: "P.001 Padang Besar",
      value: "p.001_padang_besar",
    },
    {
      label: "P.002 Kangar",
      value: "p.002_kangar",
    },
    {
      label: "P.003 Arau",
      value: "p.003_arau",
    },
  ],
  "selangor": [
    {
      label: "P.092 Sabak Bernam",
      value: "p.092_sabak_bernam",
    },
    {
      label: "P.093 Sungai Besar",
      value: "p.093_sungai_besar",
    },
    {
      label: "P.094 Hulu Selangor",
      value: "p.094_hulu_selangor",
    },
    {
      label: "P.095 Tanjong Karang",
      value: "p.095_tanjong_karang",
    },
    {
      label: "P.096 Kuala Selangor",
      value: "p.096_kuala_selangor",
    },
    {
      label: "P.097 Selayang",
      value: "p.097_selayang",
    },
    {
      label: "P.098 Gombak",
      value: "p.098_gombak",
    },
    {
      label: "P.099 Ampang",
      value: "p.099_ampang",
    },
    {
      label: "P.100 Pandan",
      value: "p.100_pandan",
    },
    {
      label: "P.101 Hulu Langat",
      value: "p.101_hulu_langat",
    },
    {
      label: "P.102 Bangi",
      value: "p.102_bangi",
    },
    {
      label: "P.103 Puchong",
      value: "p.103_puchong",
    },
    {
      label: "P.104 Subang",
      value: "p.104_subang",
    },
    {
      label: "P.105 Petaling Jaya",
      value: "p.105_petaling_jaya",
    },
    {
      label: "P.106 Damansara",
      value: "p.106_damansara",
    },
    {
      label: "P.107 Sungai Buloh",
      value: "p.107_sungai_buloh",
    },
    {
      label: "P.108 Shah Alam",
      value: "p.108_shah_alam",
    },
    {
      label: "P.109 Kapar",
      value: "p.109_kapar",
    },
    {
      label: "P.110 Klang",
      value: "p.110_klang",
    },
    {
      label: "P.111 Kota Raja",
      value: "p.111_kota_raja",
    },
    {
      label: "P.112 Kuala Langat",
      value: "p.112_kuala_langat",
    },
    {
      label: "P.113 Sepang",
      value: "p.113_sepang",
    },
  ],
  "terengganu": [
    {
      label: "P.033 Besut",
      value: "p.033_besut",
    },
    {
      label: "P.034 Setiu",
      value: "p.034_setiu",
    },
    {
      label: "P.035 Kuala Nerus",
      value: "p.035_kuala_nerus",
    },
    {
      label: "P.036 Kuala Terengganu",
      value: "p.036_kuala_terengganu",
    },
    {
      label: "P.037 Marang",
      value: "p.037_marang",
    },
    {
      label: "P.038 Hulu Terengganu",
      value: "p.038_hulu_terengganu",
    },
    {
      label: "P.039 Dungun",
      value: "p.039_dungun",
    },
    {
      label: "P.040 Kemaman",
      value: "p.040_kemaman",
    },
  ],
  "sabah": [
    {
      label: "P.167 Kudat",
      value: "p.167_kudat",
    },
    {
      label: "P.168 Kota Marudu",
      value: "p.168_kota_marudu",
    },
    {
      label: "P.169 Kota Belud",
      value: "p.169_kota_belud",
    },
    {
      label: "P.170 Tuaran",
      value: "p.170_tuaran",
    },
    {
      label: "P.171 Sepanggar",
      value: "p.171_sepanggar",
    },
    {
      label: "P.172 Kota Kinabalu",
      value: "p.172_kota_kinabalu",
    },
    {
      label: "P.173 Putatan",
      value: "p.173_putatan",
    },
    {
      label: "P.174 Penampang",
      value: "p.174_penampang",
    },
    {
      label: "P.175 Papar",
      value: "p.175_papar",
    },
    {
      label: "P.176 Kimanis",
      value: "p.176_kimanis",
    },
    {
      label: "P.177 Beaufort",
      value: "p.177_beaufort",
    },
    {
      label: "P.178 Sipitang",
      value: "p.178_sipitang",
    },
    {
      label: "P.179 Ranau",
      value: "p.179_ranau",
    },
    {
      label: "P.180 Keningau",
      value: "p.180_keningau",
    },
    {
      label: "P.181 Tenom",
      value: "p.181_tenom",
    },
    {
      label: "P.182 Pensiangan",
      value: "p.182_pensiangan",
    },
    {
      label: "P.183 Beluran",
      value: "p.183_beluran",
    },
    {
      label: "P.184 Libaran",
      value: "p.184_libaran",
    },
    {
      label: "P.185 Batu Sapi",
      value: "p.185_batu_sapi",
    },
    {
      label: "P.186 Sandakan",
      value: "p.186_sandakan",
    },
    {
      label: "P.187 Kinabatangan",
      value: "p.187_kinabatangan",
    },
    {
      label: "P.188 Lahad Datu",
      value: "p.188_lahad_datu",
    },
    {
      label: "P.189 Semporna",
      value: "p.189_semporna",
    },
    {
      label: "P.190 Tawau",
      value: "p.190_tawau",
    },
    {
      label: "P.191 Kalabakan",
      value: "p.191_kalabakan",
    },
  ],
  "sarawak": [
    {
      label: "P.192 Mas Gading",
      value: "p.192_mas_gading",
    },
    {
      label: "P.193 Santubong",
      value: "p.193_santubong",
    },
    {
      label: "P.194 Petra Jaya",
      value: "p.194_petra_jaya",
    },
    {
      label: "P.195 Bandar Kuching",
      value: "p.195_bandar_kuching",
    },
    {
      label: "P.196 Stampin",
      value: "p.196_stampin",
    },
    {
      label: "P.197 Kota Samarahan",
      value: "p.197_kota_samarahan",
    },
    {
      label: "P.198 Puncak Borneo",
      value: "p.198_puncak_borneo",
    },
    {
      label: "P.199 Serian",
      value: "p.199_serian",
    },
    {
      label: "P.200 Batang Sadong",
      value: "p.200_batang_sadong",
    },
    {
      label: "P.201 Batang Lupar",
      value: "p.201_batang_lupar",
    },
    {
      label: "P.202 Sri Aman",
      value: "p.202_sri_aman",
    },
    {
      label: "P.203 Lubok Antu",
      value: "p.203_lubok_antu",
    },
    {
      label: "P.204 Betong",
      value: "p.204_betong",
    },
    {
      label: "P.205 Saratok",
      value: "p.205_saratok",
    },
    {
      label: "P.206 Tanjong Manis",
      value: "p.206_tanjong_manis",
    },
    {
      label: "P.207 Igan",
      value: "p.207_igan",
    },
    {
      label: "P.208 Sarikei",
      value: "p.208_sarikei",
    },
    {
      label: "P.209 Julau",
      value: "p.209_julau",
    },
    {
      label: "P.210 Kanowit",
      value: "p.210_kanowit",
    },
    {
      label: "P.211 Lanang",
      value: "p.211_lanang",
    },
    {
      label: "P.212 Sibu",
      value: "p.212_sibu",
    },
    {
      label: "P.213 Mukah",
      value: "p.213_mukah",
    },
    {
      label: "P.214 Selangau",
      value: "p.214_selangau",
    },
    {
      label: "P.215 Kapit",
      value: "p.215_kapit",
    },
    {
      label: "P.216 Hulu Rajang",
      value: "p.216_hulu_rajang",
    },
    {
      label: "P.217 Bintulu",
      value: "p.217_bintulu",
    },
    {
      label: "P.218 Sibuti",
      value: "p.218_sibuti",
    },
    {
      label: "P.219 Miri",
      value: "p.219_miri",
    },
    {
      label: "P.220 Baram",
      value: "p.220_baram",
    },
    {
      label: "P.221 Limbang",
      value: "p.221_limbang",
    },
    {
      label: "P.222 Lawas",
      value: "p.222_lawas",
    },
  ],
  "w.p._kuala_lumpur": [
    {
      label: "P.114 Kepong",
      value: "p.114_kepong",
    },
    {
      label: "P.115 Batu",
      value: "p.115_batu",
    },
    {
      label: "P.116 Wangsa Maju",
      value: "p.116_wangsa_maju",
    },
    {
      label: "P.117 Segambut",
      value: "p.117_segambut",
    },
    {
      label: "P.118 Setiawangsa",
      value: "p.118_setiawangsa",
    },
    {
      label: "P.119 Titiwangsa",
      value: "p.119_titiwangsa",
    },
    {
      label: "P.120 Bukit Bintang",
      value: "p.120_bukit_bintang",
    },
    {
      label: "P.121 Lembah Pantai",
      value: "p.121_lembah_pantai",
    },
    {
      label: "P.122 Seputeh",
      value: "p.122_seputeh",
    },
    {
      label: "P.123 Cheras",
      value: "p.123_cheras",
    },
    {
      label: "P.124 Bandar Tun Razak",
      value: "p.124_bandar_tun_razak",
    },
  ],
  "w.p._labuan": [
    {
      label: "P.166 Labuan",
      value: "p.166_labuan",
    },
  ],
  "w.p._putrajaya": [
    {
      label: "P.125 Putrajaya",
      value: "p.125_putrajaya",
    },
  ],
};

export const DUNS: Record<string, Array<OptionType>> = {
  johor: [
    {
      label: "N.01 Buloh Kasap",
      value: "n.01_buloh_kasap",
    },
    {
      label: "N.02 Jementah",
      value: "n.02_jementah",
    },
    {
      label: "N.03 Pemanis",
      value: "n.03_pemanis",
    },
    {
      label: "N.04 Kemelah",
      value: "n.04_kemelah",
    },
    {
      label: "N.05 Tenang",
      value: "n.05_tenang",
    },
    {
      label: "N.06 Bekok",
      value: "n.06_bekok",
    },
    {
      label: "N.07 Bukit Kepong",
      value: "n.07_bukit_kepong",
    },
    {
      label: "N.08 Bukit Pasir",
      value: "n.08_bukit_pasir",
    },
    {
      label: "N.09 Gambir",
      value: "n.09_gambir",
    },
    {
      label: "N.10 Tangkak",
      value: "n.10_tangkak",
    },
    {
      label: "N.11 Serom",
      value: "n.11_serom",
    },
    {
      label: "N.12 Bentayan",
      value: "n.12_bentayan",
    },
    {
      label: "N.13 Simpang Jeram",
      value: "n.13_simpang_jeram",
    },
    {
      label: "N.14 Bukit Naning",
      value: "n.14_bukit_naning",
    },
    {
      label: "N.15 Maharani",
      value: "n.15_maharani",
    },
    {
      label: "N.16 Sungai Balang",
      value: "n.16_sungai_balang",
    },
    {
      label: "N.17 Semerah",
      value: "n.17_semerah",
    },
    {
      label: "N.18 Sri Medan",
      value: "n.18_sri_medan",
    },
    {
      label: "N.19 Yong Peng",
      value: "n.19_yong_peng",
    },
    {
      label: "N.20 Semarang",
      value: "n.20_semarang",
    },
    {
      label: "N.21 Parit Yaani",
      value: "n.21_parit_yaani",
    },
    {
      label: "N.22 Parit Raja",
      value: "n.22_parit_raja",
    },
    {
      label: "N.23 Penggaram",
      value: "n.23_penggaram",
    },
    {
      label: "N.24 Senggarang",
      value: "n.24_senggarang",
    },
    {
      label: "N.25 Rengit",
      value: "n.25_rengit",
    },
    {
      label: "N.26 Machap",
      value: "n.26_machap",
    },
    {
      label: "N.27 Layang-Layang",
      value: "n.27_layang-layang",
    },
    {
      label: "N.28 Mengkibol",
      value: "n.28_mengkibol",
    },
    {
      label: "N.29 Mahkota",
      value: "n.29_mahkota",
    },
    {
      label: "N.30 Paloh",
      value: "n.30_paloh",
    },
    {
      label: "N.31 Kahang",
      value: "n.31_kahang",
    },
    {
      label: "N.32 Endau",
      value: "n.32_endau",
    },
    {
      label: "N.33 Tenggaroh",
      value: "n.33_tenggaroh",
    },
    {
      label: "N.34 Panti",
      value: "n.34_panti",
    },
    {
      label: "N.35 Pasir Raja",
      value: "n.35_pasir_raja",
    },
    {
      label: "N.36 Sedili",
      value: "n.36_sedili",
    },
    {
      label: "N.37 Johor Lama",
      value: "n.37_johor_lama",
    },
    {
      label: "N.38 Penawar",
      value: "n.38_penawar",
    },
    {
      label: "N.39 Tanjung Surat",
      value: "n.39_tanjung_surat",
    },
    {
      label: "N.40 Tiram",
      value: "n.40_tiram",
    },
    {
      label: "N.41 Puteri Wangsa",
      value: "n.41_puteri_wangsa",
    },
    {
      label: "N.42 Johor Jaya",
      value: "n.42_johor_jaya",
    },
    {
      label: "N.43 Permas",
      value: "n.43_permas",
    },
    {
      label: "N.44 Larkin",
      value: "n.44_larkin",
    },
    {
      label: "N.45 Stulang",
      value: "n.45_stulang",
    },
    {
      label: "N.46 Perling",
      value: "n.46_perling",
    },
    {
      label: "N.47 Kempas",
      value: "n.47_kempas",
    },
    {
      label: "N.48 Skudai",
      value: "n.48_skudai",
    },
    {
      label: "N.49 Kota Iskandar",
      value: "n.49_kota_iskandar",
    },
    {
      label: "N.50 Bukit Permai",
      value: "n.50_bukit_permai",
    },
    {
      label: "N.51 Bukit Batu",
      value: "n.51_bukit_batu",
    },
    {
      label: "N.52 Senai",
      value: "n.52_senai",
    },
    {
      label: "N.53 Benut",
      value: "n.53_benut",
    },
    {
      label: "N.54 Pulai Sebatang",
      value: "n.54_pulai_sebatang",
    },
    {
      label: "N.55 Pekan Nanas",
      value: "n.55_pekan_nanas",
    },
    {
      label: "N.56 Kukup",
      value: "n.56_kukup",
    },
  ],
  kedah: [
    {
      label: "N.01 Ayer Hangat",
      value: "n.01_ayer_hangat",
    },
    {
      label: "N.02 Kuah",
      value: "n.02_kuah",
    },
    {
      label: "N.03 Kota Siputeh",
      value: "n.03_kota_siputeh",
    },
    {
      label: "N.04 Ayer Hitam",
      value: "n.04_ayer_hitam",
    },
    {
      label: "N.05 Bukit Kayu Hitam",
      value: "n.05_bukit_kayu_hitam",
    },
    {
      label: "N.06 Jitra",
      value: "n.06_jitra",
    },
    {
      label: "N.07 Kuala Nerang",
      value: "n.07_kuala_nerang",
    },
    {
      label: "N.08 Pedu",
      value: "n.08_pedu",
    },
    {
      label: "N.09 Bukit Lada",
      value: "n.09_bukit_lada",
    },
    {
      label: "N.10 Bukit Pinang",
      value: "n.10_bukit_pinang",
    },
    {
      label: "N.11 Derga",
      value: "n.11_derga",
    },
    {
      label: "N.12 Suka Menanti",
      value: "n.12_suka_menanti",
    },
    {
      label: "N.13 Kota Darul Aman",
      value: "n.13_kota_darul_aman",
    },
    {
      label: "N.14 Alor Mengkudu",
      value: "n.14_alor_mengkudu",
    },
    {
      label: "N.15 Anak Bukit",
      value: "n.15_anak_bukit",
    },
    {
      label: "N.16 Kubang Rotan",
      value: "n.16_kubang_rotan",
    },
    {
      label: "N.17 Pengkalan Kundor",
      value: "n.17_pengkalan_kundor",
    },
    {
      label: "N.18 Tokai",
      value: "n.18_tokai",
    },
    {
      label: "N.19 Sungai Tiang",
      value: "n.19_sungai_tiang",
    },
    {
      label: "N.20 Sungai Limau",
      value: "n.20_sungai_limau",
    },
    {
      label: "N.21 Guar Chempedak",
      value: "n.21_guar_chempedak",
    },
    {
      label: "N.22 Gurun",
      value: "n.22_gurun",
    },
    {
      label: "N.23 Belantek",
      value: "n.23_belantek",
    },
    {
      label: "N.24 Jeneri",
      value: "n.24_jeneri",
    },
    {
      label: "N.25 Bukit Selambau",
      value: "n.25_bukit_selambau",
    },
    {
      label: "N.26 Tanjong Dawai",
      value: "n.26_tanjong_dawai",
    },
    {
      label: "N.27 Pantai Merdeka",
      value: "n.27_pantai_merdeka",
    },
    {
      label: "N.28 Bakar Arang",
      value: "n.28_bakar_arang",
    },
    {
      label: "N.29 Sidam",
      value: "n.29_sidam",
    },
    {
      label: "N.30 Bayu",
      value: "n.30_bayu",
    },
    {
      label: "N.31 Kupang",
      value: "n.31_kupang",
    },
    {
      label: "N.32 Kuala Ketil",
      value: "n.32_kuala_ketil",
    },
    {
      label: "N.33 Merbau Pulas",
      value: "n.33_merbau_pulas",
    },
    {
      label: "N.34 Lunas",
      value: "n.34_lunas",
    },
    {
      label: "N.35 Kulim",
      value: "n.35_kulim",
    },
    {
      label: "N.36 Bandar Baharu",
      value: "n.36_bandar_baharu",
    },
  ],
  kelantan: [
    {
      label: "N.01 Pengkalan Kubor",
      value: "n.01_pengkalan_kubor",
    },
    {
      label: "N.02 Kelaboran",
      value: "n.02_kelaboran",
    },
    {
      label: "N.03 Pasir Pekan",
      value: "n.03_pasir_pekan",
    },
    {
      label: "N.04 Wakaf Bharu",
      value: "n.04_wakaf_bharu",
    },
    {
      label: "N.05 Kijang",
      value: "n.05_kijang",
    },
    {
      label: "N.06 Chempaka",
      value: "n.06_chempaka",
    },
    {
      label: "N.07 Panchor",
      value: "n.07_panchor",
    },
    {
      label: "N.08 Tanjong Mas",
      value: "n.08_tanjong_mas",
    },
    {
      label: "N.09 Kota Lama",
      value: "n.09_kota_lama",
    },
    {
      label: "N.10 Bunut Payong",
      value: "n.10_bunut_payong",
    },
    {
      label: "N.11 Tendong",
      value: "n.11_tendong",
    },
    {
      label: "N.12 Pengkalan Pasir",
      value: "n.12_pengkalan_pasir",
    },
    {
      label: "N.13 Meranti",
      value: "n.13_meranti",
    },
    {
      label: "N.14 Chetok",
      value: "n.14_chetok",
    },
    {
      label: "N.15 Gual Periok",
      value: "n.15_gual_periok",
    },
    {
      label: "N.16 Apam Putra",
      value: "n.16_apam_putra",
    },
    {
      label: "N.17 Salor",
      value: "n.17_salor",
    },
    {
      label: "N.18 Pasir Tumboh",
      value: "n.18_pasir_tumboh",
    },
    {
      label: "N.19 Demit",
      value: "n.19_demit",
    },
    {
      label: "N.20 Tawang",
      value: "n.20_tawang",
    },
    {
      label: "N.21 Pantai Irama",
      value: "n.21_pantai_irama",
    },
    {
      label: "N.22 Jelawat",
      value: "n.22_jelawat",
    },
    {
      label: "N.23 Melor",
      value: "n.23_melor",
    },
    {
      label: "N.24 Kadok",
      value: "n.24_kadok",
    },
    {
      label: "N.25 Kok Lanas",
      value: "n.25_kok_lanas",
    },
    {
      label: "N.26 Bukit Panau",
      value: "n.26_bukit_panau",
    },
    {
      label: "N.27 Gual Ipoh",
      value: "n.27_gual_ipoh",
    },
    {
      label: "N.28 Kemahang",
      value: "n.28_kemahang",
    },
    {
      label: "N.29 Selising",
      value: "n.29_selising",
    },
    {
      label: "N.30 Limbongan",
      value: "n.30_limbongan",
    },
    {
      label: "N.31 Semerak",
      value: "n.31_semerak",
    },
    {
      label: "N.32 Gaal",
      value: "n.32_gaal",
    },
    {
      label: "N.33 Pulai Chondong",
      value: "n.33_pulai_chondong",
    },
    {
      label: "N.34 Temangan",
      value: "n.34_temangan",
    },
    {
      label: "N.35 Kemuning",
      value: "n.35_kemuning",
    },
    {
      label: "N.36 Bukit Bunga",
      value: "n.36_bukit_bunga",
    },
    {
      label: "N.37 Air Lanas",
      value: "n.37_air_lanas",
    },
    {
      label: "N.38 Kuala Balah",
      value: "n.38_kuala_balah",
    },
    {
      label: "N.39 Mengkebang",
      value: "n.39_mengkebang",
    },
    {
      label: "N.40 Guchil",
      value: "n.40_guchil",
    },
    {
      label: "N.41 Manek Urai",
      value: "n.41_manek_urai",
    },
    {
      label: "N.42 Dabong",
      value: "n.42_dabong",
    },
    {
      label: "N.43 Nenggiri",
      value: "n.43_nenggiri",
    },
    {
      label: "N.44 Paloh",
      value: "n.44_paloh",
    },
    {
      label: "N.45 Galas",
      value: "n.45_galas",
    },
  ],
  melaka: [
    {
      label: "N.01 Kuala Linggi",
      value: "n.01_kuala_linggi",
    },
    {
      label: "N.02 Tanjung Bidara",
      value: "n.02_tanjung_bidara",
    },
    {
      label: "N.03 Ayer Limau",
      value: "n.03_ayer_limau",
    },
    {
      label: "N.04 Lendu",
      value: "n.04_lendu",
    },
    {
      label: "N.05 Taboh Naning",
      value: "n.05_taboh_naning",
    },
    {
      label: "N.06 Rembia",
      value: "n.06_rembia",
    },
    {
      label: "N.07 Gadek",
      value: "n.07_gadek",
    },
    {
      label: "N.08 Machap Jaya",
      value: "n.08_machap_jaya",
    },
    {
      label: "N.09 Durian Tunggal",
      value: "n.09_durian_tunggal",
    },
    {
      label: "N.10 Asahan",
      value: "n.10_asahan",
    },
    {
      label: "N.11 Sungai Udang",
      value: "n.11_sungai_udang",
    },
    {
      label: "N.12 Pantai Kundor",
      value: "n.12_pantai_kundor",
    },
    {
      label: "N.13 Paya Rumput",
      value: "n.13_paya_rumput",
    },
    {
      label: "N.14 Kelebang",
      value: "n.14_kelebang",
    },
    {
      label: "N.15 Pengkalan Batu",
      value: "n.15_pengkalan_batu",
    },
    {
      label: "N.16 Ayer Keroh",
      value: "n.16_ayer_keroh",
    },
    {
      label: "N.17 Bukit Katil",
      value: "n.17_bukit_katil",
    },
    {
      label: "N.18 Ayer Molek",
      value: "n.18_ayer_molek",
    },
    {
      label: "N.19 Kesidang",
      value: "n.19_kesidang",
    },
    {
      label: "N.20 Kota Laksamana",
      value: "n.20_kota_laksamana",
    },
    {
      label: "N.21 Duyong",
      value: "n.21_duyong",
    },
    {
      label: "N.22 Bandar Hilir",
      value: "n.22_bandar_hilir",
    },
    {
      label: "N.23 Telok Mas",
      value: "n.23_telok_mas",
    },
    {
      label: "N.24 Bemban",
      value: "n.24_bemban",
    },
    {
      label: "N.25 Rim",
      value: "n.25_rim",
    },
    {
      label: "N.26 Serkam",
      value: "n.26_serkam",
    },
    {
      label: "N.27 Merlimau",
      value: "n.27_merlimau",
    },
    {
      label: "N.28 Sungai Rambai",
      value: "n.28_sungai_rambai",
    },
  ],
  negeri_sembilan: [
    {
      label: "N.01 Chennah",
      value: "n.01_chennah",
    },
    {
      label: "N.02 Pertang",
      value: "n.02_pertang",
    },
    {
      label: "N.03 Sungai Lui",
      value: "n.03_sungai_lui",
    },
    {
      label: "N.04 Klawang",
      value: "n.04_klawang",
    },
    {
      label: "N.05 Serting",
      value: "n.05_serting",
    },
    {
      label: "N.06 Palong",
      value: "n.06_palong",
    },
    {
      label: "N.07 Jeram Padang",
      value: "n.07_jeram_padang",
    },
    {
      label: "N.08 Bahau",
      value: "n.08_bahau",
    },
    {
      label: "N.09 Lenggeng",
      value: "n.09_lenggeng",
    },
    {
      label: "N.10 Nilai",
      value: "n.10_nilai",
    },
    {
      label: "N.11 Lobak",
      value: "n.11_lobak",
    },
    {
      label: "N.12 Temiang",
      value: "n.12_temiang",
    },
    {
      label: "N.13 Sikamat",
      value: "n.13_sikamat",
    },
    {
      label: "N.14 Ampangan",
      value: "n.14_ampangan",
    },
    {
      label: "N.15 Juasseh",
      value: "n.15_juasseh",
    },
    {
      label: "N.16 Seri Menanti",
      value: "n.16_seri_menanti",
    },
    {
      label: "N.17 Senaling",
      value: "n.17_senaling",
    },
    {
      label: "N.18 Pilah",
      value: "n.18_pilah",
    },
    {
      label: "N.19 Johol",
      value: "n.19_johol",
    },
    {
      label: "N.20 Labu",
      value: "n.20_labu",
    },
    {
      label: "N.21 Bukit Kepayang",
      value: "n.21_bukit_kepayang",
    },
    {
      label: "N.22 Rahang",
      value: "n.22_rahang",
    },
    {
      label: "N.23 Mambau",
      value: "n.23_mambau",
    },
    {
      label: "N.24 Seremban Jaya",
      value: "n.24_seremban_jaya",
    },
    {
      label: "N.25 Paroi",
      value: "n.25_paroi",
    },
    {
      label: "N.26 Chembong",
      value: "n.26_chembong",
    },
    {
      label: "N.27 Rantau",
      value: "n.27_rantau",
    },
    {
      label: "N.28 Kota",
      value: "n.28_kota",
    },
    {
      label: "N.29 Chuah",
      value: "n.29_chuah",
    },
    {
      label: "N.30 Lukut",
      value: "n.30_lukut",
    },
    {
      label: "N.31 Bagan Pinang",
      value: "n.31_bagan_pinang",
    },
    {
      label: "N.32 Linggi",
      value: "n.32_linggi",
    },
    {
      label: "N.33 Sri Tanjung",
      value: "n.33_sri_tanjung",
    },
    {
      label: "N.34 Gemas",
      value: "n.34_gemas",
    },
    {
      label: "N.35 Gemencheh",
      value: "n.35_gemencheh",
    },
    {
      label: "N.36 Repah",
      value: "n.36_repah",
    },
  ],
  pahang: [
    {
      label: "N.01 Tanah Rata",
      value: "n.01_tanah_rata",
    },
    {
      label: "N.02 Jelai",
      value: "n.02_jelai",
    },
    {
      label: "N.03 Padang Tengku",
      value: "n.03_padang_tengku",
    },
    {
      label: "N.04 Cheka",
      value: "n.04_cheka",
    },
    {
      label: "N.05 Benta",
      value: "n.05_benta",
    },
    {
      label: "N.06 Batu Talam",
      value: "n.06_batu_talam",
    },
    {
      label: "N.07 Tras",
      value: "n.07_tras",
    },
    {
      label: "N.08 Dong",
      value: "n.08_dong",
    },
    {
      label: "N.09 Tahan",
      value: "n.09_tahan",
    },
    {
      label: "N.10 Damak",
      value: "n.10_damak",
    },
    {
      label: "N.11 Pulau Tawar",
      value: "n.11_pulau_tawar",
    },
    {
      label: "N.12 Beserah",
      value: "n.12_beserah",
    },
    {
      label: "N.13 Semambu",
      value: "n.13_semambu",
    },
    {
      label: "N.14 Teruntum",
      value: "n.14_teruntum",
    },
    {
      label: "N.15 Tanjung Lumpur",
      value: "n.15_tanjung_lumpur",
    },
    {
      label: "N.16 Inderapura",
      value: "n.16_inderapura",
    },
    {
      label: "N.17 Sungai Lembing",
      value: "n.17_sungai_lembing",
    },
    {
      label: "N.18 Lepar",
      value: "n.18_lepar",
    },
    {
      label: "N.19 Panching",
      value: "n.19_panching",
    },
    {
      label: "N.20 Pulau Manis",
      value: "n.20_pulau_manis",
    },
    {
      label: "N.21 Peramu Jaya",
      value: "n.21_peramu_jaya",
    },
    {
      label: "N.22 Bebar",
      value: "n.22_bebar",
    },
    {
      label: "N.23 Chini",
      value: "n.23_chini",
    },
    {
      label: "N.24 Luit",
      value: "n.24_luit",
    },
    {
      label: "N.25 Kuala Sentul",
      value: "n.25_kuala_sentul",
    },
    {
      label: "N.26 Chenor",
      value: "n.26_chenor",
    },
    {
      label: "N.27 Jenderak",
      value: "n.27_jenderak",
    },
    {
      label: "N.28 Kerdau",
      value: "n.28_kerdau",
    },
    {
      label: "N.29 Jengka",
      value: "n.29_jengka",
    },
    {
      label: "N.30 Mentakab",
      value: "n.30_mentakab",
    },
    {
      label: "N.31 Lanchang",
      value: "n.31_lanchang",
    },
    {
      label: "N.32 Kuala Semantan",
      value: "n.32_kuala_semantan",
    },
    {
      label: "N.33 Bilut",
      value: "n.33_bilut",
    },
    {
      label: "N.34 Ketari",
      value: "n.34_ketari",
    },
    {
      label: "N.35 Sabai",
      value: "n.35_sabai",
    },
    {
      label: "N.36 Pelangai",
      value: "n.36_pelangai",
    },
    {
      label: "N.37 Guai",
      value: "n.37_guai",
    },
    {
      label: "N.38 Triang",
      value: "n.38_triang",
    },
    {
      label: "N.39 Kemayan",
      value: "n.39_kemayan",
    },
    {
      label: "N.40 Bukit Ibam",
      value: "n.40_bukit_ibam",
    },
    {
      label: "N.41 Muadzam Shah",
      value: "n.41_muadzam_shah",
    },
    {
      label: "N.42 Tioman",
      value: "n.42_tioman",
    },
  ],
  pulau_pinang: [
    {
      label: "N.01 Penaga",
      value: "n.01_penaga",
    },
    {
      label: "N.02 Bertam",
      value: "n.02_bertam",
    },
    {
      label: "N.03 Pinang Tunggal",
      value: "n.03_pinang_tunggal",
    },
    {
      label: "N.04 Permatang Berangan",
      value: "n.04_permatang_berangan",
    },
    {
      label: "N.05 Sungai Dua",
      value: "n.05_sungai_dua",
    },
    {
      label: "N.06 Telok Ayer Tawar",
      value: "n.06_telok_ayer_tawar",
    },
    {
      label: "N.07 Sungai Puyu",
      value: "n.07_sungai_puyu",
    },
    {
      label: "N.08 Bagan Jermal",
      value: "n.08_bagan_jermal",
    },
    {
      label: "N.09 Bagan Dalam",
      value: "n.09_bagan_dalam",
    },
    {
      label: "N.10 Seberang Jaya",
      value: "n.10_seberang_jaya",
    },
    {
      label: "N.11 Permatang Pasir",
      value: "n.11_permatang_pasir",
    },
    {
      label: "N.12 Penanti",
      value: "n.12_penanti",
    },
    {
      label: "N.13 Berapit",
      value: "n.13_berapit",
    },
    {
      label: "N.14 Machang Bubuk",
      value: "n.14_machang_bubuk",
    },
    {
      label: "N.15 Padang Lalang",
      value: "n.15_padang_lalang",
    },
    {
      label: "N.16 Perai",
      value: "n.16_perai",
    },
    {
      label: "N.17 Bukit Tengah",
      value: "n.17_bukit_tengah",
    },
    {
      label: "N.18 Bukit Tambun",
      value: "n.18_bukit_tambun",
    },
    {
      label: "N.19 Jawi",
      value: "n.19_jawi",
    },
    {
      label: "N.20 Sungai Bakap",
      value: "n.20_sungai_bakap",
    },
    {
      label: "N.21 Sungai Acheh",
      value: "n.21_sungai_acheh",
    },
    {
      label: "N.22 Tanjong Bunga",
      value: "n.22_tanjong_bunga",
    },
    {
      label: "N.23 Air Putih",
      value: "n.23_air_putih",
    },
    {
      label: "N.24 Kebun Bunga",
      value: "n.24_kebun_bunga",
    },
    {
      label: "N.25 Pulau Tikus",
      value: "n.25_pulau_tikus",
    },
    {
      label: "N.26 Padang Kota",
      value: "n.26_padang_kota",
    },
    {
      label: "N.27 Pengkalan Kota",
      value: "n.27_pengkalan_kota",
    },
    {
      label: "N.28 Komtar",
      value: "n.28_komtar",
    },
    {
      label: "N.29 Datok Keramat",
      value: "n.29_datok_keramat",
    },
    {
      label: "N.30 Sungai Pinang",
      value: "n.30_sungai_pinang",
    },
    {
      label: "N.31 Batu Lancang",
      value: "n.31_batu_lancang",
    },
    {
      label: "N.32 Seri Delima",
      value: "n.32_seri_delima",
    },
    {
      label: "N.33 Air Itam",
      value: "n.33_air_itam",
    },
    {
      label: "N.34 Paya Terubong",
      value: "n.34_paya_terubong",
    },
    {
      label: "N.35 Batu Uban",
      value: "n.35_batu_uban",
    },
    {
      label: "N.36 Pantai Jerejak",
      value: "n.36_pantai_jerejak",
    },
    {
      label: "N.37 Batu Maung",
      value: "n.37_batu_maung",
    },
    {
      label: "N.38 Bayan Lepas",
      value: "n.38_bayan_lepas",
    },
    {
      label: "N.39 Pulau Betong",
      value: "n.39_pulau_betong",
    },
    {
      label: "N.40 Telok Bahang",
      value: "n.40_telok_bahang",
    },
  ],
  perak: [
    {
      label: "N.01 Pengkalan Hulu",
      value: "n.01_pengkalan_hulu",
    },
    {
      label: "N.02 Temengor",
      value: "n.02_temengor",
    },
    {
      label: "N.03 Kenering",
      value: "n.03_kenering",
    },
    {
      label: "N.04 Kota Tampan",
      value: "n.04_kota_tampan",
    },
    {
      label: "N.05 Selama",
      value: "n.05_selama",
    },
    {
      label: "N.06 Kubu Gajah",
      value: "n.06_kubu_gajah",
    },
    {
      label: "N.07 Batu Kurau",
      value: "n.07_batu_kurau",
    },
    {
      label: "N.08 Titi Serong",
      value: "n.08_titi_serong",
    },
    {
      label: "N.09 Kuala Kurau",
      value: "n.09_kuala_kurau",
    },
    {
      label: "N.10 Alor Pongsu",
      value: "n.10_alor_pongsu",
    },
    {
      label: "N.11 Gunong Semanggol",
      value: "n.11_gunong_semanggol",
    },
    {
      label: "N.12 Selinsing",
      value: "n.12_selinsing",
    },
    {
      label: "N.13 Kuala Sepetang",
      value: "n.13_kuala_sepetang",
    },
    {
      label: "N.14 Changkat Jering",
      value: "n.14_changkat_jering",
    },
    {
      label: "N.15 Trong",
      value: "n.15_trong",
    },
    {
      label: "N.16 Kamunting",
      value: "n.16_kamunting",
    },
    {
      label: "N.17 Pokok Assam",
      value: "n.17_pokok_assam",
    },
    {
      label: "N.18 Aulong",
      value: "n.18_aulong",
    },
    {
      label: "N.19 Chenderoh",
      value: "n.19_chenderoh",
    },
    {
      label: "N.20 Lubok Merbau",
      value: "n.20_lubok_merbau",
    },
    {
      label: "N.21 Lintang",
      value: "n.21_lintang",
    },
    {
      label: "N.22 Jalong",
      value: "n.22_jalong",
    },
    {
      label: "N.23 Manjoi",
      value: "n.23_manjoi",
    },
    {
      label: "N.24 Hulu Kinta",
      value: "n.24_hulu_kinta",
    },
    {
      label: "N.25 Canning",
      value: "n.25_canning",
    },
    {
      label: "N.26 Tebing Tinggi",
      value: "n.26_tebing_tinggi",
    },
    {
      label: "N.27 Pasir Pinji",
      value: "n.27_pasir_pinji",
    },
    {
      label: "N.28 Bercham",
      value: "n.28_bercham",
    },
    {
      label: "N.29 Kepayang",
      value: "n.29_kepayang",
    },
    {
      label: "N.30 Buntong",
      value: "n.30_buntong",
    },
    {
      label: "N.31 Jelapang",
      value: "n.31_jelapang",
    },
    {
      label: "N.32 Menglembu",
      value: "n.32_menglembu",
    },
    {
      label: "N.33 Tronoh",
      value: "n.33_tronoh",
    },
    {
      label: "N.34 Bukit Chandan",
      value: "n.34_bukit_chandan",
    },
    {
      label: "N.35 Manong",
      value: "n.35_manong",
    },
    {
      label: "N.36 Pengkalan Baharu",
      value: "n.36_pengkalan_baharu",
    },
    {
      label: "N.37 Pantai Remis",
      value: "n.37_pantai_remis",
    },
    {
      label: "N.38 Astaka",
      value: "n.38_astaka",
    },
    {
      label: "N.39 Belanja",
      value: "n.39_belanja",
    },
    {
      label: "N.40 Bota",
      value: "n.40_bota",
    },
    {
      label: "N.41 Malim Nawar",
      value: "n.41_malim_nawar",
    },
    {
      label: "N.42 Keranji",
      value: "n.42_keranji",
    },
    {
      label: "N.43 Tualang Sekah",
      value: "n.43_tualang_sekah",
    },
    {
      label: "N.44 Sungai Rapat",
      value: "n.44_sungai_rapat",
    },
    {
      label: "N.45 Simpang Pulai",
      value: "n.45_simpang_pulai",
    },
    {
      label: "N.46 Teja",
      value: "n.46_teja",
    },
    {
      label: "N.47 Chenderiang",
      value: "n.47_chenderiang",
    },
    {
      label: "N.48 Ayer Kuning",
      value: "n.48_ayer_kuning",
    },
    {
      label: "N.49 Sungai Manik",
      value: "n.49_sungai_manik",
    },
    {
      label: "N.50 Kampong Gajah",
      value: "n.50_kampong_gajah",
    },
    {
      label: "N.51 Pasir Panjang",
      value: "n.51_pasir_panjang",
    },
    {
      label: "N.52 Pangkor",
      value: "n.52_pangkor",
    },
    {
      label: "N.53 Rungkup",
      value: "n.53_rungkup",
    },
    {
      label: "N.54 Hutan Melintang",
      value: "n.54_hutan_melintang",
    },
    {
      label: "N.55 Pasir Bedamar",
      value: "n.55_pasir_bedamar",
    },
    {
      label: "N.56 Changkat Jong",
      value: "n.56_changkat_jong",
    },
    {
      label: "N.57 Sungkai",
      value: "n.57_sungkai",
    },
    {
      label: "N.58 Slim",
      value: "n.58_slim",
    },
    {
      label: "N.59 Behrang",
      value: "n.59_behrang",
    },
  ],
  perlis: [
    {
      label: "N.01 Titi Tinggi",
      value: "n.01_titi_tinggi",
    },
    {
      label: "N.02 Beseri",
      value: "n.02_beseri",
    },
    {
      label: "N.03 Chuping",
      value: "n.03_chuping",
    },
    {
      label: "N.04 Mata Ayer",
      value: "n.04_mata_ayer",
    },
    {
      label: "N.05 Santan",
      value: "n.05_santan",
    },
    {
      label: "N.06 Bintong",
      value: "n.06_bintong",
    },
    {
      label: "N.07 Sena",
      value: "n.07_sena",
    },
    {
      label: "N.08 Indera Kayangan",
      value: "n.08_indera_kayangan",
    },
    {
      label: "N.09 Kuala Perlis",
      value: "n.09_kuala_perlis",
    },
    {
      label: "N.10 Kayang",
      value: "n.10_kayang",
    },
    {
      label: "N.11 Pauh",
      value: "n.11_pauh",
    },
    {
      label: "N.12 Tambun Tulang",
      value: "n.12_tambun_tulang",
    },
    {
      label: "N.13 Guar Sanji",
      value: "n.13_guar_sanji",
    },
    {
      label: "N.14 Simpang Empat",
      value: "n.14_simpang_empat",
    },
    {
      label: "N.15 Sanglang",
      value: "n.15_sanglang",
    },
  ],
  selangor: [
    {
      label: "N.01 Sungai Air Tawar",
      value: "n.01_sungai_air_tawar",
    },
    {
      label: "N.02 Sabak",
      value: "n.02_sabak",
    },
    {
      label: "N.03 Sungai Panjang",
      value: "n.03_sungai_panjang",
    },
    {
      label: "N.04 Sekinchan",
      value: "n.04_sekinchan",
    },
    {
      label: "N.05 Hulu Bernam",
      value: "n.05_hulu_bernam",
    },
    {
      label: "N.06 Kuala Kubu Baharu",
      value: "n.06_kuala_kubu_baharu",
    },
    {
      label: "N.07 Batang Kali",
      value: "n.07_batang_kali",
    },
    {
      label: "N.08 Sungai Burong",
      value: "n.08_sungai_burong",
    },
    {
      label: "N.09 Permatang",
      value: "n.09_permatang",
    },
    {
      label: "N.10 Bukit Melawati",
      value: "n.10_bukit_melawati",
    },
    {
      label: "N.11 Ijok",
      value: "n.11_ijok",
    },
    {
      label: "N.12 Jeram",
      value: "n.12_jeram",
    },
    {
      label: "N.13 Kuang",
      value: "n.13_kuang",
    },
    {
      label: "N.14 Rawang",
      value: "n.14_rawang",
    },
    {
      label: "N.15 Taman Templer",
      value: "n.15_taman_templer",
    },
    {
      label: "N.16 Sungai Tua",
      value: "n.16_sungai_tua",
    },
    {
      label: "N.17 Gombak Setia",
      value: "n.17_gombak_setia",
    },
    {
      label: "N.18 Hulu Kelang",
      value: "n.18_hulu_kelang",
    },
    {
      label: "N.19 Bukit Antarabangsa",
      value: "n.19_bukit_antarabangsa",
    },
    {
      label: "N.20 Lembah Jaya",
      value: "n.20_lembah_jaya",
    },
    {
      label: "N.21 Pandan Indah",
      value: "n.21_pandan_indah",
    },
    {
      label: "N.22 Teratai",
      value: "n.22_teratai",
    },
    {
      label: "N.23 Dusun Tua",
      value: "n.23_dusun_tua",
    },
    {
      label: "N.24 Semenyih",
      value: "n.24_semenyih",
    },
    {
      label: "N.25 Kajang",
      value: "n.25_kajang",
    },
    {
      label: "N.26 Sungai Ramal",
      value: "n.26_sungai_ramal",
    },
    {
      label: "N.27 Balakong",
      value: "n.27_balakong",
    },
    {
      label: "N.28 Seri Kembangan",
      value: "n.28_seri_kembangan",
    },
    {
      label: "N.29 Seri Serdang",
      value: "n.29_seri_serdang",
    },
    {
      label: "N.30 Kinrara",
      value: "n.30_kinrara",
    },
    {
      label: "N.31 Subang Jaya",
      value: "n.31_subang_jaya",
    },
    {
      label: "N.32 Seri Setia",
      value: "n.32_seri_setia",
    },
    {
      label: "N.33 Taman Medan",
      value: "n.33_taman_medan",
    },
    {
      label: "N.34 Bukit Gasing",
      value: "n.34_bukit_gasing",
    },
    {
      label: "N.35 Kampung Tunku",
      value: "n.35_kampung_tunku",
    },
    {
      label: "N.36 Bandar Utama",
      value: "n.36_bandar_utama",
    },
    {
      label: "N.37 Bukit Lanjan",
      value: "n.37_bukit_lanjan",
    },
    {
      label: "N.38 Paya Jaras",
      value: "n.38_paya_jaras",
    },
    {
      label: "N.39 Kota Damansara",
      value: "n.39_kota_damansara",
    },
    {
      label: "N.40 Kota Anggerik",
      value: "n.40_kota_anggerik",
    },
    {
      label: "N.41 Batu Tiga",
      value: "n.41_batu_tiga",
    },
    {
      label: "N.42 Meru",
      value: "n.42_meru",
    },
    {
      label: "N.43 Sementa",
      value: "n.43_sementa",
    },
    {
      label: "N.44 Selat Klang",
      value: "n.44_selat_klang",
    },
    {
      label: "N.45 Bandar Baru Klang",
      value: "n.45_bandar_baru_klang",
    },
    {
      label: "N.46 Pelabuhan Klang",
      value: "n.46_pelabuhan_klang",
    },
    {
      label: "N.47 Pandamaran",
      value: "n.47_pandamaran",
    },
    {
      label: "N.48 Sentosa",
      value: "n.48_sentosa",
    },
    {
      label: "N.49 Sungai Kandis",
      value: "n.49_sungai_kandis",
    },
    {
      label: "N.50 Kota Kemuning",
      value: "n.50_kota_kemuning",
    },
    {
      label: "N.51 Sijangkang",
      value: "n.51_sijangkang",
    },
    {
      label: "N.52 Banting",
      value: "n.52_banting",
    },
    {
      label: "N.53 Morib",
      value: "n.53_morib",
    },
    {
      label: "N.54 Tanjong Sepat",
      value: "n.54_tanjong_sepat",
    },
    {
      label: "N.55 Dengkil",
      value: "n.55_dengkil",
    },
    {
      label: "N.56 Sungai Pelek",
      value: "n.56_sungai_pelek",
    },
  ],
  terengganu: [
    {
      label: "N.01 Kuala Besut",
      value: "n.01_kuala_besut",
    },
    {
      label: "N.02 Kota Putera",
      value: "n.02_kota_putera",
    },
    {
      label: "N.03 Jertih",
      value: "n.03_jertih",
    },
    {
      label: "N.04 Hulu Besut",
      value: "n.04_hulu_besut",
    },
    {
      label: "N.05 Jabi",
      value: "n.05_jabi",
    },
    {
      label: "N.06 Permaisuri",
      value: "n.06_permaisuri",
    },
    {
      label: "N.07 Langkap",
      value: "n.07_langkap",
    },
    {
      label: "N.08 Batu Rakit",
      value: "n.08_batu_rakit",
    },
    {
      label: "N.09 Tepuh",
      value: "n.09_tepuh",
    },
    {
      label: "N.10 Buluh Gading",
      value: "n.10_buluh_gading",
    },
    {
      label: "N.11 Seberang Takir",
      value: "n.11_seberang_takir",
    },
    {
      label: "N.12 Bukit Tunggal",
      value: "n.12_bukit_tunggal",
    },
    {
      label: "N.13 Wakaf Mempelam",
      value: "n.13_wakaf_mempelam",
    },
    {
      label: "N.14 Bandar",
      value: "n.14_bandar",
    },
    {
      label: "N.15 Ladang",
      value: "n.15_ladang",
    },
    {
      label: "N.16 Batu Buruk",
      value: "n.16_batu_buruk",
    },
    {
      label: "N.17 Alur Limbat",
      value: "n.17_alur_limbat",
    },
    {
      label: "N.18 Bukit Payung",
      value: "n.18_bukit_payung",
    },
    {
      label: "N.19 Ru Rendang",
      value: "n.19_ru_rendang",
    },
    {
      label: "N.20 Pengkalan Berangan",
      value: "n.20_pengkalan_berangan",
    },
    {
      label: "N.21 Telemung",
      value: "n.21_telemung",
    },
    {
      label: "N.22 Manir",
      value: "n.22_manir",
    },
    {
      label: "N.23 Kuala Berang",
      value: "n.23_kuala_berang",
    },
    {
      label: "N.24 Ajil",
      value: "n.24_ajil",
    },
    {
      label: "N.25 Bukit Besi",
      value: "n.25_bukit_besi",
    },
    {
      label: "N.26 Rantau Abang",
      value: "n.26_rantau_abang",
    },
    {
      label: "N.27 Sura",
      value: "n.27_sura",
    },
    {
      label: "N.28 Paka",
      value: "n.28_paka",
    },
    {
      label: "N.29 Kemasik",
      value: "n.29_kemasik",
    },
    {
      label: "N.30 Kijal",
      value: "n.30_kijal",
    },
    {
      label: "N.31 Cukai",
      value: "n.31_cukai",
    },
    {
      label: "N.32 Air Putih",
      value: "n.32_air_putih",
    },
  ],
  sabah: [
    {
      label: "N.01 Banggi",
      value: "n.01_banggi",
    },
    {
      label: "N.02 Bengkoka",
      value: "n.02_bengkoka",
    },
    {
      label: "N.03 Pitas",
      value: "n.03_pitas",
    },
    {
      label: "N.04 Tanjong Kapor",
      value: "n.04_tanjong_kapor",
    },
    {
      label: "N.05 Matunggong",
      value: "n.05_matunggong",
    },
    {
      label: "N.06 Bandau",
      value: "n.06_bandau",
    },
    {
      label: "N.07 Tandek",
      value: "n.07_tandek",
    },
    {
      label: "N.08 Pintasan",
      value: "n.08_pintasan",
    },
    {
      label: "N.09 Tempasuk",
      value: "n.09_tempasuk",
    },
    {
      label: "N.10 Usukan",
      value: "n.10_usukan",
    },
    {
      label: "N.11 Kadamaian",
      value: "n.11_kadamaian",
    },
    {
      label: "N.12 Sulaman",
      value: "n.12_sulaman",
    },
    {
      label: "N.13 Pantai Dalit",
      value: "n.13_pantai_dalit",
    },
    {
      label: "N.14 Tamparuli",
      value: "n.14_tamparuli",
    },
    {
      label: "N.15 Kiulu",
      value: "n.15_kiulu",
    },
    {
      label: "N.16 Karambunai",
      value: "n.16_karambunai",
    },
    {
      label: "N.17 Darau",
      value: "n.17_darau",
    },
    {
      label: "N.18 Inanam",
      value: "n.18_inanam",
    },
    {
      label: "N.19 Likas",
      value: "n.19_likas",
    },
    {
      label: "N.20 Api-Api",
      value: "n.20_api-api",
    },
    {
      label: "N.21 Luyang",
      value: "n.21_luyang",
    },
    {
      label: "N.22 Tanjung Aru",
      value: "n.22_tanjung_aru",
    },
    {
      label: "N.23 Petagas",
      value: "n.23_petagas",
    },
    {
      label: "N.24 Tanjung Keramat",
      value: "n.24_tanjung_keramat",
    },
    {
      label: "N.25 Kapayan",
      value: "n.25_kapayan",
    },
    {
      label: "N.26 Moyog",
      value: "n.26_moyog",
    },
    {
      label: "N.27 Limbahau",
      value: "n.27_limbahau",
    },
    {
      label: "N.28 Kawang",
      value: "n.28_kawang",
    },
    {
      label: "N.29 Pantai Manis",
      value: "n.29_pantai_manis",
    },
    {
      label: "N.30 Bongawan",
      value: "n.30_bongawan",
    },
    {
      label: "N.31 Membakut",
      value: "n.31_membakut",
    },
    {
      label: "N.32 Klias",
      value: "n.32_klias",
    },
    {
      label: "N.33 Kuala Penyu",
      value: "n.33_kuala_penyu",
    },
    {
      label: "N.34 Lumadan",
      value: "n.34_lumadan",
    },
    {
      label: "N.35 Sindumin",
      value: "n.35_sindumin",
    },
    {
      label: "N.36 Kundasang",
      value: "n.36_kundasang",
    },
    {
      label: "N.37 Karanaan",
      value: "n.37_karanaan",
    },
    {
      label: "N.38 Paginatan",
      value: "n.38_paginatan",
    },
    {
      label: "N.39 Tambunan",
      value: "n.39_tambunan",
    },
    {
      label: "N.40 Bingkor",
      value: "n.40_bingkor",
    },
    {
      label: "N.41 Liawan",
      value: "n.41_liawan",
    },
    {
      label: "N.42 Melalap",
      value: "n.42_melalap",
    },
    {
      label: "N.43 Kemabong",
      value: "n.43_kemabong",
    },
    {
      label: "N.44 Tulid",
      value: "n.44_tulid",
    },
    {
      label: "N.45 Sook",
      value: "n.45_sook",
    },
    {
      label: "N.46 Nabawan",
      value: "n.46_nabawan",
    },
    {
      label: "N.47 Telupid",
      value: "n.47_telupid",
    },
    {
      label: "N.48 Sugut",
      value: "n.48_sugut",
    },
    {
      label: "N.49 Labuk",
      value: "n.49_labuk",
    },
    {
      label: "N.50 Gum-Gum",
      value: "n.50_gum-gum",
    },
    {
      label: "N.51 Sungai Manila",
      value: "n.51_sungai_manila",
    },
    {
      label: "N.52 Sungai Sibuga",
      value: "n.52_sungai_sibuga",
    },
    {
      label: "N.53 Sekong",
      value: "n.53_sekong",
    },
    {
      label: "N.54 Karamunting",
      value: "n.54_karamunting",
    },
    {
      label: "N.55 Elopura",
      value: "n.55_elopura",
    },
    {
      label: "N.56 Tanjong Papat",
      value: "n.56_tanjong_papat",
    },
    {
      label: "N.57 Kuamut",
      value: "n.57_kuamut",
    },
    {
      label: "N.58 Lamag",
      value: "n.58_lamag",
    },
    {
      label: "N.59 Sukau",
      value: "n.59_sukau",
    },
    {
      label: "N.60 Tungku",
      value: "n.60_tungku",
    },
    {
      label: "N.61 Segama",
      value: "n.61_segama",
    },
    {
      label: "N.62 Silam",
      value: "n.62_silam",
    },
    {
      label: "N.63 Kunak",
      value: "n.63_kunak",
    },
    {
      label: "N.64 Sulabayan",
      value: "n.64_sulabayan",
    },
    {
      label: "N.65 Senallang",
      value: "n.65_senallang",
    },
    {
      label: "N.66 Bugaya",
      value: "n.66_bugaya",
    },
    {
      label: "N.67 Balung",
      value: "n.67_balung",
    },
    {
      label: "N.68 Apas",
      value: "n.68_apas",
    },
    {
      label: "N.69 Sri Tanjong",
      value: "n.69_sri_tanjong",
    },
    {
      label: "N.70 Kukusan",
      value: "n.70_kukusan",
    },
    {
      label: "N.71 Tanjung Batu",
      value: "n.71_tanjung_batu",
    },
    {
      label: "N.72 Merotai",
      value: "n.72_merotai",
    },
    {
      label: "N.73 Sebatik",
      value: "n.73_sebatik",
    },
  ],
  sarawak: [
    {
      label: "N.01 Opar",
      value: "n.01_opar",
    },
    {
      label: "N.02 Tasik Biru",
      value: "n.02_tasik_biru",
    },
    {
      label: "N.03 Tanjong Datu",
      value: "n.03_tanjong_datu",
    },
    {
      label: "N.04 Pantai Damai",
      value: "n.04_pantai_damai",
    },
    {
      label: "N.05 Demak Laut",
      value: "n.05_demak_laut",
    },
    {
      label: "N.06 Tupong",
      value: "n.06_tupong",
    },
    {
      label: "N.07 Samariang",
      value: "n.07_samariang",
    },
    {
      label: "N.08 Satok",
      value: "n.08_satok",
    },
    {
      label: "N.09 Padungan",
      value: "n.09_padungan",
    },
    {
      label: "N.10 Pending",
      value: "n.10_pending",
    },
    {
      label: "N.11 Batu Lintang",
      value: "n.11_batu_lintang",
    },
    {
      label: "N.12 Kota Sentosa",
      value: "n.12_kota_sentosa",
    },
    {
      label: "N.13 Batu Kitang",
      value: "n.13_batu_kitang",
    },
    {
      label: "N.14 Batu Kawah",
      value: "n.14_batu_kawah",
    },
    {
      label: "N.15 Asajaya",
      value: "n.15_asajaya",
    },
    {
      label: "N.16 Muara Tuang",
      value: "n.16_muara_tuang",
    },
    {
      label: "N.17 Stakan",
      value: "n.17_stakan",
    },
    {
      label: "N.18 Serembu",
      value: "n.18_serembu",
    },
    {
      label: "N.19 Mambong",
      value: "n.19_mambong",
    },
    {
      label: "N.20 Tarat",
      value: "n.20_tarat",
    },
    {
      label: "N.21 Tebedu",
      value: "n.21_tebedu",
    },
    {
      label: "N.22 Kedup",
      value: "n.22_kedup",
    },
    {
      label: "N.23 Bukit Semuja",
      value: "n.23_bukit_semuja",
    },
    {
      label: "N.24 Sadong Jaya",
      value: "n.24_sadong_jaya",
    },
    {
      label: "N.25 Simunjan",
      value: "n.25_simunjan",
    },
    {
      label: "N.26 Gedong",
      value: "n.26_gedong",
    },
    {
      label: "N.27 Sebuyau",
      value: "n.27_sebuyau",
    },
    {
      label: "N.28 Lingga",
      value: "n.28_lingga",
    },
    {
      label: "N.29 Beting Maro",
      value: "n.29_beting_maro",
    },
    {
      label: "N.30 Balai Ringin",
      value: "n.30_balai_ringin",
    },
    {
      label: "N.31 Bukit Begunan",
      value: "n.31_bukit_begunan",
    },
    {
      label: "N.32 Simanggang",
      value: "n.32_simanggang",
    },
    {
      label: "N.33 Engkilili",
      value: "n.33_engkilili",
    },
    {
      label: "N.34 Batang Ai",
      value: "n.34_batang_ai",
    },
    {
      label: "N.35 Saribas",
      value: "n.35_saribas",
    },
    {
      label: "N.36 Layar",
      value: "n.36_layar",
    },
    {
      label: "N.37 Bukit Saban",
      value: "n.37_bukit_saban",
    },
    {
      label: "N.38 Kalaka",
      value: "n.38_kalaka",
    },
    {
      label: "N.39 Krian",
      value: "n.39_krian",
    },
    {
      label: "N.40 Kabong",
      value: "n.40_kabong",
    },
    {
      label: "N.41 Kuala Rajang",
      value: "n.41_kuala_rajang",
    },
    {
      label: "N.42 Semop",
      value: "n.42_semop",
    },
    {
      label: "N.43 Daro",
      value: "n.43_daro",
    },
    {
      label: "N.44 Jemoreng",
      value: "n.44_jemoreng",
    },
    {
      label: "N.45 Repok",
      value: "n.45_repok",
    },
    {
      label: "N.46 Meradong",
      value: "n.46_meradong",
    },
    {
      label: "N.47 Pakan",
      value: "n.47_pakan",
    },
    {
      label: "N.48 Meluan",
      value: "n.48_meluan",
    },
    {
      label: "N.49 Ngemah",
      value: "n.49_ngemah",
    },
    {
      label: "N.50 Machan",
      value: "n.50_machan",
    },
    {
      label: "N.51 Bukit Assek",
      value: "n.51_bukit_assek",
    },
    {
      label: "N.52 Dudong",
      value: "n.52_dudong",
    },
    {
      label: "N.53 Bawang Assan",
      value: "n.53_bawang_assan",
    },
    {
      label: "N.54 Pelawan",
      value: "n.54_pelawan",
    },
    {
      label: "N.55 Nangka",
      value: "n.55_nangka",
    },
    {
      label: "N.56 Dalat",
      value: "n.56_dalat",
    },
    {
      label: "N.57 Tellian",
      value: "n.57_tellian",
    },
    {
      label: "N.58 Balingian",
      value: "n.58_balingian",
    },
    {
      label: "N.59 Tamin",
      value: "n.59_tamin",
    },
    {
      label: "N.60 Kakus",
      value: "n.60_kakus",
    },
    {
      label: "N.61 Pelagus",
      value: "n.61_pelagus",
    },
    {
      label: "N.62 Katibas",
      value: "n.62_katibas",
    },
    {
      label: "N.63 Bukit Goram",
      value: "n.63_bukit_goram",
    },
    {
      label: "N.64 Baleh",
      value: "n.64_baleh",
    },
    {
      label: "N.65 Belaga",
      value: "n.65_belaga",
    },
    {
      label: "N.66 Murum",
      value: "n.66_murum",
    },
    {
      label: "N.67 Jepak",
      value: "n.67_jepak",
    },
    {
      label: "N.68 Tanjong Batu",
      value: "n.68_tanjong_batu",
    },
    {
      label: "N.69 Kemena",
      value: "n.69_kemena",
    },
    {
      label: "N.70 Samalaju",
      value: "n.70_samalaju",
    },
    {
      label: "N.71 Bekenu",
      value: "n.71_bekenu",
    },
    {
      label: "N.72 Lambir",
      value: "n.72_lambir",
    },
    {
      label: "N.73 Piasau",
      value: "n.73_piasau",
    },
    {
      label: "N.74 Pujut",
      value: "n.74_pujut",
    },
    {
      label: "N.75 Senadin",
      value: "n.75_senadin",
    },
    {
      label: "N.76 Marudi",
      value: "n.76_marudi",
    },
    {
      label: "N.77 Telang Usan",
      value: "n.77_telang_usan",
    },
    {
      label: "N.78 Mulu",
      value: "n.78_mulu",
    },
    {
      label: "N.79 Bukit Kota",
      value: "n.79_bukit_kota",
    },
    {
      label: "N.80 Batu Danau",
      value: "n.80_batu_danau",
    },
    {
      label: "N.81 Ba'Kelalan",
      value: "n.81_ba'kelalan",
    },
    {
      label: "N.82 Bukit Sari",
      value: "n.82_bukit_sari",
    },
  ],
};

export const DISTRICTS: Record<string, Array<OptionType>> = {
  "johor": [
    {
      label: "Batu Pahat",
      value: "batu_pahat",
    },
    {
      label: "Johor Bahru",
      value: "johor_bahru",
    },
    {
      label: "Kluang",
      value: "kluang",
    },
    {
      label: "Kota Tinggi",
      value: "kota_tinggi",
    },
    {
      label: "Mersing",
      value: "mersing",
    },
    {
      label: "Muar",
      value: "muar",
    },
    {
      label: "Pontian",
      value: "pontian",
    },
    {
      label: "Segamat",
      value: "segamat",
    },
    {
      label: "Kulai",
      value: "kulai",
    },
    {
      label: "Tangkak",
      value: "tangkak",
    },
  ],
  "kedah": [
    {
      label: "Baling",
      value: "baling",
    },
    {
      label: "Bandar Baharu",
      value: "bandar_baharu",
    },
    {
      label: "Kota Setar",
      value: "kota_setar",
    },
    {
      label: "Kuala Muda",
      value: "kuala_muda",
    },
    {
      label: "Kubang Pasu",
      value: "kubang_pasu",
    },
    {
      label: "Kulim",
      value: "kulim",
    },
    {
      label: "Langkawi",
      value: "langkawi",
    },
    {
      label: "Padang Terap",
      value: "padang_terap",
    },
    {
      label: "Sik",
      value: "sik",
    },
    {
      label: "Yan",
      value: "yan",
    },
    {
      label: "Pendang",
      value: "pendang",
    },
    {
      label: "Pokok Sena",
      value: "pokok_sena",
    },
  ],
  "kelantan": [
    {
      label: "Bachok",
      value: "bachok",
    },
    {
      label: "Kota Bharu",
      value: "kota_bharu",
    },
    {
      label: "Machang",
      value: "machang",
    },
    {
      label: "Pasir Mas",
      value: "pasir_mas",
    },
    {
      label: "Pasir Puteh",
      value: "pasir_puteh",
    },
    {
      label: "Tanah Merah",
      value: "tanah_merah",
    },
    {
      label: "Tumpat",
      value: "tumpat",
    },
    {
      label: "Gua Musang",
      value: "gua_musang",
    },
    {
      label: "Kuala Krai",
      value: "kuala_krai",
    },
    {
      label: "Jeli",
      value: "jeli",
    },
    {
      label: "Kecil Lojing",
      value: "kecil_lojing",
    },
  ],
  "melaka": [
    {
      label: "Alor Gajah",
      value: "alor_gajah",
    },
    {
      label: "Jasin",
      value: "jasin",
    },
    {
      label: "Melaka Tengah",
      value: "melaka_tengah",
    },
  ],
  "negeri_sembilan": [
    {
      label: "Jelebu",
      value: "jelebu",
    },
    {
      label: "Kuala Pilah",
      value: "kuala_pilah",
    },
    {
      label: "Port Dickson",
      value: "port_dickson",
    },
    {
      label: "Rembau",
      value: "rembau",
    },
    {
      label: "Seremban",
      value: "seremban",
    },
    {
      label: "Tampin",
      value: "tampin",
    },
    {
      label: "Jempol",
      value: "jempol",
    },
  ],
  "pahang": [
    {
      label: "Bentong",
      value: "bentong",
    },
    {
      label: "Cameron Highlands",
      value: "cameron_highlands",
    },
    {
      label: "Jerantut",
      value: "jerantut",
    },
    {
      label: "Kuantan",
      value: "kuantan",
    },
    {
      label: "Lipis",
      value: "lipis",
    },
    {
      label: "Pekan",
      value: "pekan",
    },
    {
      label: "Raub",
      value: "raub",
    },
    {
      label: "Temerloh",
      value: "temerloh",
    },
    {
      label: "Rompin",
      value: "rompin",
    },
    {
      label: "Maran",
      value: "maran",
    },
    {
      label: "Bera",
      value: "bera",
    },
  ],
  "pulau_pinang": [
    {
      label: "Seberang Perai Tengah",
      value: "seberang_perai_tengah",
    },
    {
      label: "Seberang Perai Utara",
      value: "seberang_perai_utara",
    },
    {
      label: "Seberang Perai Selatan",
      value: "seberang_perai_selatan",
    },
    {
      label: "Timur Laut",
      value: "timur_laut",
    },
    {
      label: "Barat Daya",
      value: "barat_daya",
    },
  ],
  "perak": [
    {
      label: "Batang Padang",
      value: "batang_padang",
    },
    {
      label: "Manjung",
      value: "manjung",
    },
    {
      label: "Kinta",
      value: "kinta",
    },
    {
      label: "Kerian",
      value: "kerian",
    },
    {
      label: "Kuala Kangsar",
      value: "kuala_kangsar",
    },
    {
      label: "Larut Dan Matang",
      value: "larut_dan_matang",
    },
    {
      label: "Hilir Perak",
      value: "hilir_perak",
    },
    {
      label: "Hulu Perak",
      value: "hulu_perak",
    },
    {
      label: "Perak Tengah",
      value: "perak_tengah",
    },
    {
      label: "Kampar",
      value: "kampar",
    },
    {
      label: "Muallim",
      value: "muallim",
    },
    {
      label: "Bagan Datuk",
      value: "bagan_datuk",
    },
    {
      label: "Selama",
      value: "selama",
    },
  ],
  "perlis": [
    {
      label: "Perlis",
      value: "perlis",
    },
  ],
  "selangor": [
    {
      label: "Gombak",
      value: "gombak",
    },
    {
      label: "Klang",
      value: "klang",
    },
    {
      label: "Kuala Langat",
      value: "kuala_langat",
    },
    {
      label: "Kuala Selangor",
      value: "kuala_selangor",
    },
    {
      label: "Petaling",
      value: "petaling",
    },
    {
      label: "Sabak Bernam",
      value: "sabak_bernam",
    },
    {
      label: "Sepang",
      value: "sepang",
    },
    {
      label: "Ulu Langat",
      value: "ulu_langat",
    },
    {
      label: "Ulu Selangor",
      value: "ulu_selangor",
    },
  ],
  "terengganu": [
    {
      label: "Besut",
      value: "besut",
    },
    {
      label: "Dungun",
      value: "dungun",
    },
    {
      label: "Kemaman",
      value: "kemaman",
    },
    {
      label: "Kuala Terengganu",
      value: "kuala_terengganu",
    },
    {
      label: "Marang",
      value: "marang",
    },
    {
      label: "Hulu Terengganu",
      value: "hulu_terengganu",
    },
    {
      label: "Setiu",
      value: "setiu",
    },
    {
      label: "Kuala Nerus",
      value: "kuala_nerus",
    },
  ],
  "sabah": [
    {
      label: "Tawau",
      value: "tawau",
    },
    {
      label: "Lahad Datu",
      value: "lahad_datu",
    },
    {
      label: "Semporna",
      value: "semporna",
    },
    {
      label: "Sandakan",
      value: "sandakan",
    },
    {
      label: "Kinabatangan",
      value: "kinabatangan",
    },
    {
      label: "Beluran",
      value: "beluran",
    },
    {
      label: "Kota Kinabalu",
      value: "kota_kinabalu",
    },
    {
      label: "Ranau",
      value: "ranau",
    },
    {
      label: "Kota Belud",
      value: "kota_belud",
    },
    {
      label: "Tuaran",
      value: "tuaran",
    },
    {
      label: "Penampang",
      value: "penampang",
    },
    {
      label: "Papar",
      value: "papar",
    },
    {
      label: "Kudat",
      value: "kudat",
    },
    {
      label: "Kota Marudu",
      value: "kota_marudu",
    },
    {
      label: "Pitas",
      value: "pitas",
    },
    {
      label: "Beaufort",
      value: "beaufort",
    },
    {
      label: "Kuala Penyu",
      value: "kuala_penyu",
    },
    {
      label: "Sipitang",
      value: "sipitang",
    },
    {
      label: "Tenom",
      value: "tenom",
    },
    {
      label: "Nabawan",
      value: "nabawan",
    },
    {
      label: "Keningau",
      value: "keningau",
    },
    {
      label: "Tambunan",
      value: "tambunan",
    },
    {
      label: "Kunak",
      value: "kunak",
    },
    {
      label: "Tongod",
      value: "tongod",
    },
    {
      label: "Putatan",
      value: "putatan",
    },
    {
      label: "Telupid",
      value: "telupid",
    },
    {
      label: "Kalabakan",
      value: "kalabakan",
    },
  ],
  "sarawak": [
    {
      label: "Kuching",
      value: "kuching",
    },
    {
      label: "Bau",
      value: "bau",
    },
    {
      label: "Lundu",
      value: "lundu",
    },
    {
      label: "Samarahan",
      value: "samarahan",
    },
    {
      label: "Serian",
      value: "serian",
    },
    {
      label: "Simunjan",
      value: "simunjan",
    },
    {
      label: "Sri Aman",
      value: "sri_aman",
    },
    {
      label: "Lubok Antu",
      value: "lubok_antu",
    },
    {
      label: "Betong",
      value: "betong",
    },
    {
      label: "Saratok",
      value: "saratok",
    },
    {
      label: "Sarikei",
      value: "sarikei",
    },
    {
      label: "Maradong",
      value: "maradong",
    },
    {
      label: "Daro",
      value: "daro",
    },
    {
      label: "Julau",
      value: "julau",
    },
    {
      label: "Sibu",
      value: "sibu",
    },
    {
      label: "Dalat",
      value: "dalat",
    },
    {
      label: "Mukah",
      value: "mukah",
    },
    {
      label: "Kanowit",
      value: "kanowit",
    },
    {
      label: "Bintulu",
      value: "bintulu",
    },
    {
      label: "Tatau",
      value: "tatau",
    },
    {
      label: "Kapit",
      value: "kapit",
    },
    {
      label: "Song",
      value: "song",
    },
    {
      label: "Belaga",
      value: "belaga",
    },
    {
      label: "Miri",
      value: "miri",
    },
    {
      label: "Marudi",
      value: "marudi",
    },
    {
      label: "Limbang",
      value: "limbang",
    },
    {
      label: "Lawas",
      value: "lawas",
    },
    {
      label: "Matu",
      value: "matu",
    },
    {
      label: "Asajaya",
      value: "asajaya",
    },
    {
      label: "Pakan",
      value: "pakan",
    },
    {
      label: "Selangau",
      value: "selangau",
    },
    {
      label: "Tebedu",
      value: "tebedu",
    },
    {
      label: "Pusa",
      value: "pusa",
    },
    {
      label: "Kabong",
      value: "kabong",
    },
    {
      label: "Tanjung Manis",
      value: "tanjung_manis",
    },
    {
      label: "Sebauh",
      value: "sebauh",
    },
    {
      label: "Bukit Mabong",
      value: "bukit_mabong",
    },
    {
      label: "Subis",
      value: "subis",
    },
    {
      label: "Beluru",
      value: "beluru",
    },
    {
      label: "Telang Usan",
      value: "telang_usan",
    },
  ],
  "w.p._kuala_lumpur": [
    {
      label: "W.P. Kuala Lumpur",
      value: "w.p._kuala_lumpur",
    },
  ],
  "w.p._labuan": [
    {
      label: "W.P. Labuan",
      value: "w.p._labuan",
    },
  ],
  "w.p._putrajaya": [
    {
      label: "W.P. Putrajaya",
      value: "w.p._putrajaya",
    },
  ],
};

export const jitterTooltipFormats: any = {
  income_mean: (value: number) => `RM ${numFormat(value, "standard", 0)}`,
  expenditure_mean: (value: number) => `RM ${numFormat(value, "standard", 0)}`,
  gini: (value: number) => numFormat(value, "compact", [1, 1]),
  poverty: (value: number) => numFormat(value, "compact", [1, 1]) + "%",
  labour_urate: (value: number) => numFormat(value, "compact", [1, 1]) + "%",
  labour_prate: (value: number) => numFormat(value, "compact", [1, 1]) + "%",
  agegroup_working: (value: number) => numFormat(value, "compact", [1, 1]) + "%",

  total_area: (value: number) => `${numFormat(value, "standard", 0)} km^2`,
  max_elevation: (value: number) => `${numFormat(value, "standard", 0)} m`,
  ruggedness: (_value: number) => "",
  watercover: (_value: number) => "",
  treecover: (_value: number) => "",
  treeloss: (_value: number) => "",
  nightlights: (_value: number) => "",

  population_density: (value: number) => numFormat(value, "standard", 0) + " /km^2",
  female_male: (value: number) => numFormat(value, "compact", [1, 1]),
  household_size: (value: number) => numFormat(value, "compact", [1, 1]),
  birth_rate: (value: number) => numFormat(value, "compact", [1, 1]),
  death_rate: (value: number) => numFormat(value, "compact", [1, 1]),
  dep_young: (value: number) => numFormat(value, "compact", [1, 1]),
  dep_old: (value: number) => numFormat(value, "compact", [1, 1]),

  electricity: (value: number) => numFormat(value, "compact", [1, 1]) + "%",
  water: (value: number) => numFormat(value, "compact", [1, 1]) + "%",
  hospital: (value: number) => numFormat(value, "compact", [1, 1]),
  clinic: (value: number) => numFormat(value, "compact", [1, 1]),
  school: (value: number) => numFormat(value, "compact", [1, 1]),
  police_fire: (value: number) => numFormat(value, "compact", [1, 1]),
  grocery: (value: number) => numFormat(value, "compact", [1, 1]),
};
