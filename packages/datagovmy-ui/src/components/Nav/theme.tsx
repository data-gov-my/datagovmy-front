import Button from "../Button";
import { Transition } from "@headlessui/react";
import MoonIcon from "@heroicons/react/20/solid/MoonIcon";
import SunIcon from "@heroicons/react/20/solid/SunIcon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Button
        className="btn hover:bg-washed dark:hover:bg-washed-dark group relative p-2"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Transition
          show={theme === "light"}
          enter="delay-200 transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="duration-300"
          leaveFrom="absolute opacity-100 translate-y-0"
          leaveTo="absolute opacity-0 translate-y-1"
        >
          <MoonIcon className="text-dim h-4 w-4 group-hover:text-black" />
        </Transition>
        <Transition
          show={theme !== "light"}
          enter="delay-200 transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="duration-300"
          leaveFrom="absolute opacity-100 translate-y-0"
          leaveTo="absolute opacity-0 translate-y-1"
        >
          <SunIcon className="text-dim -m-0.5 h-5 w-5 dark:group-hover:text-white" />
        </Transition>
      </Button>
    </>
  );
};

export default ThemeToggle;
