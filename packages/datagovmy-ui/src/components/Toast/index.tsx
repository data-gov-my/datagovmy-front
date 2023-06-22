import { useTheme } from "next-themes";
import { FunctionComponent, ReactNode } from "react";
import { Toaster, toast as _toast } from "sonner";

const Toast: FunctionComponent<Parameters<typeof Toaster>[0]> = props => {
  const { theme } = useTheme();
  return <Toaster theme={theme as "light" | "dark"} position="top-center" richColors {...props} />;
};

const toast = {
  success: (title: ReactNode, description?: string) =>
    _toast.success(title, { icon: <></>, description }),
  error: (title: ReactNode, description?: string) =>
    _toast.error(title, { icon: <></>, description }),
  message: (title: ReactNode, description?: string) =>
    _toast.message(title, { icon: <></>, description }),
};

export default Toast;
export { toast };
