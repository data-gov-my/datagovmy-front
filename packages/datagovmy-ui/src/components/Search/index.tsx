import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "../../hooks/useTranslation";
import { clx } from "../../lib/helpers";
import { FunctionComponent, useEffect, useRef } from "react";

type SearchProps = {
  query?: string;
  onChange: (query?: string) => void;
  className?: string;
  placeholder?: string;
};

const Search: FunctionComponent<SearchProps> = ({ query, onChange, className, placeholder }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleSlashKeydown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleSlashKeydown);

    return () => window.removeEventListener("keydown", handleSlashKeydown);
  }, []);

  return (
    <div className={clx("relative flex items-center", className)}>
      <input
        ref={searchRef}
        id="search"
        name="search"
        type="search"
        placeholder={placeholder ?? t("common:placeholder.search")}
        value={query}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
        className="text-dim dark:border-outlineHover-dark block w-full border-0 bg-inherit pl-10 text-sm focus:ring-0 lg:text-base"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="text-dim h-4 w-4" />
      </div>
    </div>
  );
};

export default Search;
