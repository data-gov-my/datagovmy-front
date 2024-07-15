import type { NextSeoProps } from "next-seo";
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import NextHead from "next/head";
import { useMounted } from "nextra/hooks";
import type { ReactElement } from "react";
import { useConfig } from "../contexts";

export function Head(): ReactElement {
  const config = useConfig();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  // `head` can be either FC or ReactNode. We have to directly call it if it's an
  // FC because hooks like Next.js' `useRouter` aren't allowed inside NextHead.
  const head = typeof config.head === "function" ? config.head({}) : config.head;
  const hue = config.primaryHue;
  const { dark: darkHue, light: lightHue } =
    typeof hue === "number" ? { dark: hue, light: hue } : hue;
  const frontMatter = config.frontMatter as NextSeoProps;

  return (
    <>
      <NextSeo
        title={config.title}
        description={frontMatter.description}
        canonical={frontMatter.canonical}
        openGraph={frontMatter.openGraph}
        {...config.useNextSeoProps?.()}
      />
      <NextHead>
        {config.faviconGlyph ? (
          <link
            rel="icon"
            href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${config.faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`}
          />
        ) : null}

        {/* Apple Splash Screen */}
        <link
          rel="apple-touch-startup-image"
          href="/static/images/icons/apple_splash_2048.png"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/static/images/icons/apple_splash_1668.png"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/static/images/icons/apple_splash_1536.png"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/static/images/icons/apple_splash_1125.png"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/static/images/icons/apple_splash_1242.png"
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/static/images/icons/apple_splash_750.png"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/static/images/icons/apple_splash_640.png"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          sizes="640x1136"
        />

        {mounted ? (
          <meta name="theme-color" content={resolvedTheme === "dark" ? "#111" : "#fff"} />
        ) : (
          <>
            <meta name="theme-color" content="#fff" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="#111" media="(prefers-color-scheme: dark)" />
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <style>{`
        :root {
          --nextra-primary-hue: ${lightHue}deg;
          --nextra-navbar-height: 4rem;
          --nextra-menu-height: 3.75rem;
          --nextra-banner-height: 2.5rem;
        }
        
        .dark {
          --nextra-primary-hue: ${darkHue}deg;
        }
      `}</style>
        {head}
      </NextHead>
    </>
  );
}
