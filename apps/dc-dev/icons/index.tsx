import { FunctionComponent } from "react";

export interface IconProps {
  className?: string;
  fillColor?: string;
  transform?: string;
}

export const CheckMarkIcon: FunctionComponent<IconProps> = ({
  className,
  fillColor = "#16A34A",
}) => {
  return (
    <svg
      width="50"
      height="60"
      viewBox="0 0 50 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M50 25.457C50 11.6499 38.8071 0.457031 25 0.457031C11.1929 0.457031 0 11.6499 0 25.457C0 37.2979 8.23481 47.209 19.2881 49.7936L25 59.5431L30.7119 49.7936C41.7652 47.209 50 37.2979 50 25.457Z"
        fill={fillColor}
      />
      <path
        d="M35.427 19.9209L21.5243 33.8235L14.573 26.8722"
        stroke="white"
        strokeWidth="4.86592"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AtomIcon: FunctionComponent<IconProps> = ({ className, transform }) => {
  return (
    <svg
      width="62"
      height="60"
      viewBox="0 0 62 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      transform={transform}
    >
      <path
        d="M55.6469 15.75C56.0002 16.3616 56.0841 17.3714 55.4425 18.9583C54.8098 20.5234 53.5618 22.3996 51.7191 24.4655C48.045 28.5849 42.2389 33.2012 35.1607 37.2857C28.0825 41.3703 21.1797 44.0878 15.7734 45.2084C13.062 45.7704 10.8123 45.9126 9.13981 45.6778C7.44409 45.4397 6.61109 44.8622 6.25782 44.2506C5.90455 43.639 5.82064 42.6292 6.46221 41.0424C7.095 39.4772 8.343 37.601 10.1857 35.5351C13.8598 31.4157 19.6659 26.7994 26.744 22.7149C33.8222 18.6303 40.7251 15.9128 46.1314 14.7922C48.8428 14.2302 51.0924 14.088 52.7649 14.3228C54.4607 14.5609 55.2937 15.1385 55.6469 15.75Z"
        stroke="url(#paint0_linear_3006_31715)"
        strokeWidth="3"
      />
      <path
        d="M30.9524 1.5C31.6597 1.5 32.5768 1.93268 33.6308 3.28125C34.6704 4.61148 35.672 6.62973 36.5407 9.2576C38.2729 14.4974 39.3696 21.831 39.3696 30C39.3696 38.169 38.2729 45.5026 36.5407 50.7424C35.672 53.3703 34.6704 55.3885 33.6308 56.7188C32.5768 58.0673 31.6597 58.5 30.9524 58.5C30.2451 58.5 29.328 58.0673 28.274 56.7188C27.2344 55.3885 26.2328 53.3703 25.364 50.7424C23.6319 45.5026 22.5352 38.169 22.5352 30C22.5352 21.831 23.6319 14.4974 25.364 9.2576C26.2328 6.62973 27.2343 4.61148 28.274 3.28125C29.328 1.93268 30.2451 1.5 30.9524 1.5Z"
        stroke="url(#paint1_linear_3006_31715)"
        strokeWidth="3"
      />
      <path
        d="M55.6469 44.2506C55.2937 44.8622 54.4607 45.4397 52.7649 45.6778C51.0924 45.9126 48.8428 45.7704 46.1314 45.2084C40.7251 44.0878 33.8222 41.3703 26.744 37.2857C19.6659 33.2012 13.8598 28.5849 10.1857 24.4655C8.343 22.3996 7.095 20.5234 6.46221 18.9583C5.82063 17.3714 5.90455 16.3616 6.25782 15.75C6.61108 15.1385 7.44409 14.5609 9.13981 14.3228C10.8123 14.088 13.062 14.2302 15.7734 14.7922C21.1797 15.9128 28.0825 18.6303 35.1607 22.7149C42.2389 26.7994 48.045 31.4157 51.7191 35.5351C53.5618 37.601 54.8098 39.4772 55.4425 41.0424C56.0841 42.6292 56.0002 43.639 55.6469 44.2506Z"
        stroke="url(#paint2_linear_3006_31715)"
        strokeWidth="3"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3006_31715"
          x1="9.91724"
          y1="53.5846"
          x2="6.64572"
          y2="33.0777"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#94A3B8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3006_31715"
          x1="20.9988"
          y1="-2.92356"
          x2="48.4096"
          y2="12.1925"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A98FE" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_3006_31715"
          x1="-4.51243e-06"
          y1="23.5846"
          x2="16.1242"
          y2="10.4889"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#94A3B8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const BarChartIcon: FunctionComponent<IconProps> = ({ className, transform }) => {
  return (
    <svg
      width="61"
      height="43"
      viewBox="0 0 61 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      transform={transform}
    >
      <rect y="12" width="8" height="31" rx="4" fill="url(#paint0)" />
      <rect x="13" y="19" width="8" height="24" rx="4" fill="url(#paint1)" />
      <rect x="26" y="28" width="9" height="15" rx="4.5" fill="url(#paint2)" />
      <rect x="40" y="12" width="8" height="31" rx="4" fill="url(#paint3)" />
      <rect x="53" width="8" height="43" rx="4" fill="url(#paint4)" />
      <defs>
        <linearGradient
          id="paint0"
          x1="4"
          y1="9.18182"
          x2="15.8964"
          y2="38.2083"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A98FE" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="paint1" x1="17" y1="19" x2="17" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient
          id="paint2"
          x1="30.5"
          y1="26.6364"
          x2="33.3046"
          y2="42.5463"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A98FE" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="paint3" x1="44" y1="12" x2="44" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient
          id="paint4"
          x1="57"
          y1="-3.90909"
          x2="77.2041"
          y2="31.6306"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A98FE" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LineChartIcon: FunctionComponent<IconProps> = ({ className, transform }) => {
  return (
    <svg
      width="67"
      height="60"
      viewBox="0 0 67 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      transform={transform}
    >
      <path
        d="M10 48L18.481 36.5528L24.0506 42.05L38.9873 23.9095L45.8228 31.1153L60 14"
        stroke="url(#paint0)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 2V57H64"
        stroke="url(#paint1)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0"
          x1="62.4363"
          y1="13.9377"
          x2="32.0399"
          y2="40.7335"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A98FE" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient
          id="paint1"
          x1="3"
          y1="57"
          x2="33.8129"
          y2="27.479"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#94A3B8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const PieChartIcon: FunctionComponent<IconProps> = ({ className, transform }) => {
  return (
    <svg
      width="60"
      height="55"
      viewBox="0 0 60 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      transform={transform}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.6815 7.95862L26.7546 27.3035L50.9012 38.8465C46.593 47.9784 37.3998 54.2857 26.7546 54.2857C11.9784 54.2857 0 42.1334 0 27.1429C0 12.1523 11.9784 0 26.7546 0C34.147 0 40.8392 3.04164 45.6815 7.95862Z"
        fill="url(#paint0_radial)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M57.3919 37.633C59.0638 34.0893 60 30.1203 60 25.9294C60 18.4385 57.0089 11.6563 52.1723 6.74512L33.2454 26.09L57.3919 37.633Z"
        fill="url(#paint1_linear)"
      />
      <defs>
        <radialGradient
          id="paint0_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(18 8.62185) rotate(79.147) scale(46.4955 45.8671)"
        >
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </radialGradient>
        <linearGradient
          id="paint1_linear"
          x1="46.6227"
          y1="3.93712"
          x2="50.6868"
          y2="37.2205"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A98FE" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  );
};
