import Image from "next/image";
import { ReactElement } from "react";
import { useConfig } from "../contexts";
import { renderString } from "../utils";

export function Footer(): ReactElement {
  const config = useConfig();
  const classes = {
    link: "text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white",
  };

  return (
    <footer className="bg-background border-outline dark:border-washed-dark dark:bg-dark z-10 flex h-full w-full justify-center border-t pb-16 pt-12">
      <div className="md:px-4.5 h-full w-full max-w-screen-2xl px-3 lg:px-6">
        <div className="flex gap-y-8 max-md:flex-col md:justify-between">
          <div className="flex items-start gap-x-4">
            <Image src="/assets/jata_logo.png" width={48} height={36} alt="jata negara" />
            <div className="space-y-2">
              <p className="font-bold uppercase">{renderString(config.footer.govMy)}</p>
              <p className="text-dim text-sm">{renderString(config.footer.dtsa)}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex w-full flex-col gap-2 md:w-[200px]">
              <p className="font-bold">{renderString(config.footer.openSource)}</p>
              <a
                className={classes.link}
                href="https://github.com/data-gov-my/datagovmy-front"
                target="_blank"
              >
                {renderString(config.footer.fe)}
              </a>
              <a
                className={classes.link}
                href="https://github.com/data-gov-my/datagovmy-back"
                target="_blank"
              >
                {renderString(config.footer.be)}
              </a>
              <a
                className={classes.link}
                href="#"
                //  TODO: add figma link (and open data links below)
                target="_blank"
              >
                {renderString(config.footer.uiux)}
              </a>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-[200px]">
              <p className="font-bold">{renderString(config.footer.openData)}</p>
              <a className={classes.link} href="#" target="_blank">
                {renderString(config.footer.guide)}
              </a>
              <a className={classes.link} href="#" target="_blank">
                {renderString(config.footer.tos)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
