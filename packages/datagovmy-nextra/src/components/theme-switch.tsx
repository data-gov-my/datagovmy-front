import { useTheme } from "next-themes";
import { useMounted } from "nextra/hooks";
import { MoonIcon, SunIcon } from "nextra/icons";
import type { ReactElement } from "react";
import { z } from "zod";
import { useConfig } from "../contexts";
import { Select } from "./select";

type ThemeSwitchProps = {
  lite?: boolean;
  className?: string;
};

export const themeOptionsSchema = z.strictObject({
  light: z.string(),
  dark: z.string(),
  system: z.string(),
});

type ThemeOptions = z.infer<typeof themeOptionsSchema>;

export function ThemeSwitch({ lite, className }: ThemeSwitchProps): ReactElement {
  const { setTheme, resolvedTheme, theme = "" } = useTheme();
  const mounted = useMounted();
  const config = useConfig().themeSwitch;

  const IconToUse = mounted && resolvedTheme === "dark" ? MoonIcon : SunIcon;
  const options: ThemeOptions =
    typeof config.useOptions === "function" ? config.useOptions() : config.useOptions;

  return (
    <Select
      className={className}
      title="Change theme"
      options={[
        { key: "light", name: options.light },
        { key: "dark", name: options.dark },
        { key: "system", name: options.system },
      ]}
      onChange={option => {
        setTheme(option.key);
      }}
      selected={{
        key: theme,
        name: (
          <div className="flex items-center gap-2 text-sm capitalize">
            <IconToUse />
            <span className={lite ? "md:hidden" : ""}>
              {mounted ? options[theme as keyof typeof options] : options.light}
            </span>
          </div>
        ),
      }}
    />
  );
}
