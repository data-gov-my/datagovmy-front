export default {
  name: "instance",
  token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  host: process.env.NEXT_PUBLIC_APP_URL.concat("/mp"),
} as const;
