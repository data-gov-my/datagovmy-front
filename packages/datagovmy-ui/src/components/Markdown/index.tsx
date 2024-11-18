import { FunctionComponent } from "react";
import ReactMarkdown, { Options } from "react-markdown";

interface MarkdownProps extends Options {}

const Markdown: FunctionComponent<MarkdownProps> = ({ className = "markdown", ...props }) => {
  return <ReactMarkdown className={className} {...props} />;
};

export default Markdown;
