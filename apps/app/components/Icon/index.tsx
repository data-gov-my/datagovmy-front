import { FunctionComponent } from "react";

export interface IconProps {
  className?: string;
  fillColor?: string;
  transform?: string;
}

export const UsersIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_2886_13900)">
        <path
          d="M8.33355 12.5555C6.25355 12.5555 2.11133 13.5955 2.11133 15.6667V17.2222H14.5558V15.6667C14.5558 13.5955 10.4135 12.5555 8.33355 12.5555ZM4.19133 15.4444C4.93799 14.9289 6.74244 14.3333 8.33355 14.3333C9.92466 14.3333 11.7291 14.9289 12.4758 15.4444H4.19133ZM8.33355 11C10.0491 11 11.4447 9.60444 11.4447 7.88888C11.4447 6.17333 10.0491 4.77777 8.33355 4.77777C6.61799 4.77777 5.22244 6.17333 5.22244 7.88888C5.22244 9.60444 6.61799 11 8.33355 11ZM8.33355 6.55555C9.07133 6.55555 9.66688 7.1511 9.66688 7.88888C9.66688 8.62666 9.07133 9.22222 8.33355 9.22222C7.59577 9.22222 7.00022 8.62666 7.00022 7.88888C7.00022 7.1511 7.59577 6.55555 8.33355 6.55555ZM14.5913 12.6089C15.6224 13.3555 16.3335 14.3511 16.3335 15.6667V17.2222H19.8891V15.6667C19.8891 13.8711 16.778 12.8489 14.5913 12.6089ZM13.6669 11C15.3824 11 16.778 9.60444 16.778 7.88888C16.778 6.17333 15.3824 4.77777 13.6669 4.77777C13.1869 4.77777 12.7424 4.89333 12.3335 5.08888C12.8935 5.87999 13.2224 6.84888 13.2224 7.88888C13.2224 8.92888 12.8935 9.89777 12.3335 10.6889C12.7424 10.8844 13.1869 11 13.6669 11Z"
          fill="#0F172A"
        />
      </g>
      <defs>
        <clipPath id="clip0_2886_13900">
          <rect
            width="21.3333"
            height="21.3333"
            fill="white"
            transform="translate(0.333496 0.333313)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const EconomicGrowthIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="19"
      height="12"
      viewBox="0 0 19 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.0558 0.666626L15.0913 2.70218L10.7535 7.03996L7.19799 3.4844L0.611328 10.08L1.86466 11.3333L7.19799 5.99996L10.7535 9.55551L16.3535 3.9644L18.3891 5.99996V0.666626H13.0558Z"
        fill="#0F172A"
      />
    </svg>
  );
};

export const BankIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.11133 8.22223H2.33355V14.4445H4.11133V8.22223ZM9.44466 8.22223H7.66688V14.4445H9.44466V8.22223ZM17.0002 16.2222H0.111328V18H17.0002V16.2222ZM14.778 8.22223H13.0002V14.4445H14.778V8.22223ZM8.55577 2.23112L13.1869 4.66667H3.92466L8.55577 2.23112ZM8.55577 0.222229L0.111328 4.66667V6.44445H17.0002V4.66667L8.55577 0.222229Z"
        fill="#0F172A"
      />
    </svg>
  );
};

export const UnemploymentIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.8229 7.22219L9.50022 9.54488L7.17755 7.22219L5.94466 8.45509L8.26732 10.7778L5.94471 13.1004L7.1776 14.3333L9.50022 12.0107L11.8228 14.3333L13.0557 13.1004L10.7331 10.7778L13.0558 8.45509L11.8229 7.22219Z"
        fill="#0F172A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.3891 5.44442C18.3891 4.45775 17.598 3.66664 16.6113 3.66664H13.0558V1.88886C13.0558 0.902195 12.2647 0.111084 11.278 0.111084H7.72244C6.73577 0.111084 5.94466 0.902195 5.94466 1.88886V3.66664H2.38911C1.40244 3.66664 0.620217 4.45775 0.620217 5.44442L0.611328 16.1111C0.611328 17.0977 1.40244 17.8889 2.38911 17.8889H16.6113C17.598 17.8889 18.3891 17.0977 18.3891 16.1111V5.44442ZM11.278 1.88886V3.66664H7.72244V1.88886H11.278ZM2.38911 16.1111V5.44442H16.6113V16.1111H2.38911Z"
        fill="#0F172A"
      />
    </svg>
  );
};

export const InflationIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.44466 11.7689L6.77799 6.42663L10.3335 9.98219L17.8891 1.48441L16.6358 0.231079L10.3335 7.31552L6.77799 3.75997L0.111328 10.4355L1.44466 11.7689Z"
        fill="#0F172A"
      />
    </svg>
  );
};

export const ProductionIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18.3891 17.8889H0.611328V7.22219L6.83355 4.55553V6.33331L11.278 4.55553V7.22219H13.9447L14.8335 0.111084H17.5002L18.3891 7.22219V17.8889ZM9.50022 7.17775L5.05577 8.95553V7.22219L2.38911 8.39553V16.1111H16.6113V8.99997H9.50022V7.17775ZM8.61133 14.3333H10.3891V10.7778H8.61133V14.3333ZM5.05577 14.3333H6.83355V10.7778H5.05577V14.3333ZM13.9447 10.7778H12.1669V14.3333H13.9447V10.7778Z"
        fill="#0F172A"
      />
    </svg>
  );
};

export const IndustryIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.3335 8.93336C5.3335 10.3822 6.52461 11.5556 8.00016 11.5556C9.47572 11.5556 10.6668 10.3822 10.6668 8.93336C10.6668 7.76892 10.1957 7.43114 8.00016 4.88892C5.79572 7.44892 5.3335 7.77781 5.3335 8.93336Z"
        fill="#0F172A"
      />
      <path
        d="M15.1111 8.88889C15.6 8.88889 16 8.48889 16 8C16 7.51111 15.6 7.11111 15.1111 7.11111H14.2222V1.77778H15.1111C15.6 1.77778 16 1.37778 16 0.888889C16 0.4 15.6 0 15.1111 0H0.888889C0.4 0 0 0.4 0 0.888889C0 1.37778 0.4 1.77778 0.888889 1.77778H1.77778V7.11111H0.888889C0.4 7.11111 0 7.51111 0 8C0 8.48889 0.4 8.88889 0.888889 8.88889H1.77778V14.2222H0.888889C0.4 14.2222 0 14.6222 0 15.1111C0 15.6 0.4 16 0.888889 16H15.1111C15.6 16 16 15.6 16 15.1111C16 14.6222 15.6 14.2222 15.1111 14.2222H14.2222V8.88889H15.1111ZM12.4444 14.2222H3.55556V8.88889C4.04445 8.88889 4.44445 8.48889 4.44445 8C4.44445 7.51111 4.04445 7.11111 3.55556 7.11111V1.77778H12.4444V7.11111C11.9556 7.11111 11.5556 7.51111 11.5556 8C11.5556 8.48889 11.9556 8.88889 12.4444 8.88889V14.2222Z"
        fill="#0F172A"
      />
    </svg>
  );
};

export const RetailTradeIcon: FunctionComponent<IconProps> = ({ className }) => {
  return (
    <svg
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18.3003 5.23556L17.367 1.35111C17.1714 0.551111 16.4781 0 15.6692 0H3.32255C2.52255 0 1.82033 0.56 1.63366 1.35111L0.700331 5.23556C0.486998 6.14222 0.682554 7.06667 1.25144 7.79556C1.32255 7.89333 1.42033 7.96445 1.50033 8.05334V14.2222C1.50033 15.2 2.30033 16 3.27811 16H15.7226C16.7003 16 17.5003 15.2 17.5003 14.2222V8.05334C17.5803 7.97333 17.6781 7.89333 17.7492 7.80445C18.3181 7.07556 18.5226 6.14222 18.3003 5.23556ZM15.6426 1.76889L16.5759 5.65333C16.6648 6.02667 16.5848 6.4 16.3537 6.69333C16.2292 6.85333 15.9626 7.11111 15.5181 7.11111C14.9759 7.11111 14.5048 6.67556 14.4426 6.09778L13.927 1.77778L15.6426 1.76889ZM10.3892 1.77778H12.1314L12.6114 5.79556C12.6559 6.14222 12.5492 6.48889 12.3181 6.74667C12.1226 6.97778 11.8381 7.11111 11.4737 7.11111C10.8781 7.11111 10.3892 6.58667 10.3892 5.94667V1.77778ZM6.38033 5.79556L6.86922 1.77778H8.61144V5.94667C8.61144 6.58667 8.12255 7.11111 7.46478 7.11111C7.16255 7.11111 6.887 6.97778 6.67366 6.74667C6.45144 6.48889 6.34478 6.14222 6.38033 5.79556ZM2.42478 5.65333L3.32255 1.77778H5.07366L4.55811 6.09778C4.487 6.67556 4.02478 7.11111 3.48255 7.11111C3.047 7.11111 2.77144 6.85333 2.65589 6.69333C2.41589 6.40889 2.33589 6.02667 2.42478 5.65333ZM3.27811 14.2222V8.86222C3.34922 8.87111 3.41144 8.88889 3.48255 8.88889C4.25589 8.88889 4.95811 8.56889 5.47366 8.04445C6.007 8.57778 6.71811 8.88889 7.527 8.88889C8.30033 8.88889 8.99366 8.56889 9.50922 8.06222C10.0337 8.56889 10.7448 8.88889 11.5448 8.88889C12.2914 8.88889 13.0026 8.57778 13.5359 8.04445C14.0514 8.56889 14.7537 8.88889 15.527 8.88889C15.5981 8.88889 15.6603 8.87111 15.7314 8.86222V14.2222H3.27811Z"
        fill="#0F172A"
      />
    </svg>
  );
};

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
