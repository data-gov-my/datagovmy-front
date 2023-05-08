export default {
  name: "instance",
  id: process.env.MIXPANEL_PROJECT_ID,
  token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  host: process.env.NEXT_PUBLIC_MIXPANEL_HOST,
  user: process.env.MIXPANEL_SA_USER,
  secret: process.env.MIXPANEL_SA_SECRET,
} as const;
