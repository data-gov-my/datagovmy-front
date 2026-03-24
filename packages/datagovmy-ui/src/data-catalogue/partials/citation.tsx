import { clx, copyClipboard } from "datagovmy-ui/helpers";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useState } from "react";

// TODO(i18n): Add translation keys for all hardcoded strings below once i18n is available

type CitationFormat = "APA" | "MLA" | "BibTeX" | "Chicago";

interface CatalogueCitationProps {
  id: string;
  title: string;
  dataSources: string[];
  dataAsOf: string;
  lastUpdated: string;
}

const CatalogueCitation: FunctionComponent<CatalogueCitationProps> = ({
  id,
  title,
  dataSources,
  dataAsOf,
  lastUpdated,
}) => {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>("APA");
  const [copiedFormat, setCopiedFormat] = useState<CitationFormat | null>(null);

  const publisher = dataSources.join("; ") || "Department of Statistics Malaysia";
  const baseUrl = `https://data.gov.my/data-catalogue/${id}`;

  // Extract year from data_as_of or last_updated (format: "YYYY-MM-DD" or ISO)
  const getYear = (dateStr: string): string => {
    if (!dateStr) return new Date().getFullYear().toString();
    const match = dateStr.match(/^(\d{4})/);
    return match ? match[1] : new Date().getFullYear().toString();
  };

  // Format date as "Month Day, Year" for Chicago (e.g., "March 25, 2025")
  const toChicagoDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const year = getYear(dataAsOf || lastUpdated);
  const accessDate = toChicagoDate(lastUpdated || new Date().toISOString());

  const citations: Record<CitationFormat, string> = {
    APA: `${publisher}. (${year}). ${title} [Dataset]. data.gov.my. ${baseUrl}`,
    MLA: `${publisher}. "${title}." Data.gov.my, ${year}, ${baseUrl}.`,
    BibTeX: `@dataset{${id},\n  title = {${title}},\n  author = {${publisher}},\n  year = {${year}},\n  url = {${baseUrl}}\n}`,
    Chicago: `${publisher}. "${title}." Accessed ${accessDate}. ${baseUrl}.`,
  };

  const formats: CitationFormat[] = ["APA", "MLA", "BibTeX", "Chicago"];

  const handleCopy = (format: CitationFormat) => {
    copyClipboard(citations[format]);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Format tabs */}
      <div className="flex flex-wrap gap-2">
        {formats.map(format => (
          <button
            key={format}
            onClick={() => setActiveFormat(format)}
            className={clx(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeFormat === format
                ? "bg-primary text-white dark:bg-primary-dark"
                : "bg-washed dark:bg-washed-dark text-dim dark:text-dim-dark hover:bg-washed/80 dark:hover:bg-washed-dark/80"
            )}
          >
            {format}
          </button>
        ))}
      </div>

      {/* Citation text + copy button */}
      <div className="dark:border-outlineHover-dark bg-background dark:bg-background-dark rounded-xl border">
        <div className="flex items-start justify-between gap-4 p-4">
          <pre className="text-foreground dark:text-foreground-dark flex-1 whitespace-pre-wrap break-all font-mono text-sm leading-relaxed">
            {citations[activeFormat]}
          </pre>
          <button
            onClick={() => handleCopy(activeFormat)}
            className={clx(
              "btn text-dim hover:bg-washed/10 flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              copiedFormat === activeFormat && "text-success"
            )}
            title={copiedFormat === activeFormat ? "Copied!" : "Copy citation"}
          >
            {copiedFormat === activeFormat ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4" />
            )}
            {/* TODO(i18n): Replace with t("common.copy") / t("common.copied") */}
            {copiedFormat === activeFormat ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCitation;
