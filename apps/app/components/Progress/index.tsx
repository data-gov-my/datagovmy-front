import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";

type ProgressProps = {
  disableOnSameRoute?: boolean;
};

const Progress: FunctionComponent<ProgressProps> = ({ disableOnSameRoute = false }) => {
  const [progress, setProgress] = useState<number>(0);
  const { events, route } = useRouter();

  useEffect(() => {
    const gradualTimeout = (callback: (progress: number) => void) => {
      const steps = 10;
      const stepSize = 100 / steps;
      let fake_progress = 0;

      const updateProgress = setInterval(() => {
        fake_progress += stepSize;

        if (fake_progress > 90) {
          clearInterval(updateProgress);
        } else {
          callback(fake_progress);
        }
      }, 100);
    };

    const startLoading = (url: string) => {
      const _url = url.startsWith("/ms-MY") ? url.slice(6) : url;
      if (disableOnSameRoute && route === _url.split("?")[0]) return;

      gradualTimeout(progress => {
        setProgress(progress);
      });
    };

    const endLoading = (url: string) => {
      const _url = url.startsWith("/ms-MY") ? url.slice(6) : url;
      if (disableOnSameRoute && route === _url.split("?")[0]) return;

      setProgress(100);
      setTimeout(() => {
        setProgress(0);
      }, 150);
    };

    events.on("routeChangeStart", startLoading);
    events.on("routeChangeComplete", endLoading);
    events.on("routeChangeError", endLoading);

    return () => {
      events.off("routeChangeStart", startLoading);
      events.off("routeChangeComplete", endLoading);
      events.off("routeChangeError", endLoading);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      {progress > 0 && (
        <div
          className="bg-primary dark:bg-primary-dark h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      )}
    </div>
  );
};

export default Progress;
