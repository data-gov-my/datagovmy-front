import Image from "next/image";

export default {
  logo: (
    <div className="flex flex-row gap-2">
      <Image src="/assets/logo.png" width={32} height={32} alt="data.gov.my" />
      <h4>data.gov.my</h4>
    </div>
  ),
  project: {
    link: "https://github.com/data-gov-my/datagovmy-front",
  },
  i18n: [
    { locale: "en-GB", text: "English" },
    { locale: "ms-MY", text: "Malay" },
  ],
};
