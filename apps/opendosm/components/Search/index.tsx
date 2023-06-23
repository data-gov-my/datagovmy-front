import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, useEffect, useRef } from "react";

type SearchProps = {
  query?: string;
  onChange: (query?: string) => void;
  className?: string;
};

const Search: FunctionComponent<SearchProps> = ({ query, onChange, className }) => {
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
    <div className={`relative flex items-center ${className}`}>
      <input
        ref={searchRef}
        id="search"
        name="search"
        type="search"
        placeholder={t("placeholder.search")}
        value={query}
        onChange={e => onChange(e.target.value)}
        className="block w-full border-0 border-b border-outline pl-8 text-dim focus:ring-0"
      />
      <div className="absolute inset-y-0 left-0 flex items-center py-1.5 pr-1.5">
        <SearchIcon className="h-4 w-4 text-dim" />
      </div>
    </div>
  );
};

export default Search;
