import cn from "clsx";
import type { ReactElement } from "react";
import { useConfig } from "../contexts";
import { renderComponent } from "../utils";
import { LocaleSwitch } from "./locale-switch";

export function Footer({ menu }: { menu?: boolean }): ReactElement {
  const config = useConfig();
  return (
    <footer className="bg-gray-100 pb-[env(safe-area-inset-bottom)] dark:bg-neutral-900 print:bg-transparent">
      <div
        className={cn(
          "mx-auto flex max-w-[90rem] gap-2 px-4 py-2",
          menu && (config.i18n.length > 0 || config.darkMode) ? "flex" : "hidden"
        )}
      >
        {config.i18n.length > 0 && <LocaleSwitch options={config.i18n} />}
        {config.darkMode && renderComponent(config.themeSwitch.component)}
      </div>
      <hr className="dark:border-neutral-800" />
      <div
        className={cn(
          "mx-auto flex max-w-[90rem] justify-center py-12 text-gray-600 dark:text-gray-400 md:justify-start",
          "pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]"
        )}
      >
        {renderComponent(config.footer.text)}
      </div>
    </footer>
  );
}
