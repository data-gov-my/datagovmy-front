import type { ReactElement } from "react";
import { useConfig } from "../contexts";
import Image from "next/image";

export function Footer({ menu }: { menu?: boolean }): ReactElement {
  const config = useConfig();
  // TODO: i18n
  return (
    <footer className="bg-washed border-outline dark:border-washed-dark z-10 flex h-full w-full justify-center border-t pb-16 pt-12 dark:bg-black">
      <div className="md:px-4.5 dark:divide-washed-dark undefined h-full w-full max-w-screen-2xl divide-y px-3 lg:px-6">
        <div className="flex w-full flex-col gap-6 text-sm md:flex-row md:justify-between md:gap-0">
          <div className="flex flex-row gap-4">
            <div className="mt-1 w-12">
              <Image src="/assets/jata_logo.png" width={48} height={36} alt="jata negara" />
            </div>
            <div>
              <div className="mb-2 uppercase">
                <p className="text-base font-bold">Government of Malaysia</p>
              </div>
              <p className="text-dim">© 2023 Public Sector Open Data</p>
            </div>
          </div>
          <div className="flex flex-row gap-8 md:gap-14">
            <div className="flex w-full flex-col gap-2 md:w-auto">
              <p className="font-bold">Open Source</p>
              <a
                className="text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white"
                href="https://github.com/data-gov-my/datagovmy-front"
                target="_blank"
              >
                Frontend Repo: NextJS
              </a>
              <a
                className="text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white"
                href="https://github.com/data-gov-my/datagovmy-back"
                target="_blank"
              >
                Backend Repo: Django
              </a>
              <a
                className="text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white"
                href="#"
                //  TODO: add figma link (and open data links below)
                target="_blank"
              >
                UI + UX Design: Figma
              </a>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto">
              <p className="font-bold">Open Data</p>
              <a
                className="text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white"
                href="#"
                target="_blank"
              >
                Guiding Principles
              </a>
              <a
                className="text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white"
                href="/dashboard/car-popularity#"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
