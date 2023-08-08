import { FunctionComponent } from "react";
import ReactMarkdown, { Options } from "react-markdown";

interface MarkdownProps extends Options {}

const Markdown: FunctionComponent<MarkdownProps> = ({ className = "markdown", children }) => {
  return <ReactMarkdown className={className}>{children}</ReactMarkdown>;
};

export default Markdown;
