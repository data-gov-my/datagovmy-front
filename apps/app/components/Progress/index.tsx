import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";

const Progress: FunctionComponent = () => {
  const [progress, setProgress] = useState<number>(0);
  const { events, route } = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let trickle: NodeJS.Timer;

    const gradualTimeout = (callback: (progress: number) => void) => {
      let n = 0,
        step = 0;

      trickle = setInterval(() => {
        if (n >= 0 && n < 20) {
          step = Math.random() * 10;
        } else if (n >= 20 && n < 70) {
          step = Math.random() * 0.1;
        }
        n += step;

        if (n > 70) {
          clearInterval(trickle);
        } else {
          callback(n);
        }
      }, 100);
    };

    const startLoading = (url: string) => {
        if (route === url) return;
        clearTimeout(timeout);
        clearInterval(trickle);
        timeout = setTimeout(() => {
          setProgress(0);
        }, 400);

        gradualTimeout(progress => {
          setProgress(progress);
        });
      },
      endLoading = () => {
        clearTimeout(timeout);
        clearInterval(trickle);
        setTimeout(() => {
          setProgress(100);
        }, 100);
        setTimeout(() => {
          setProgress(0);
        }, 300);
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
          className="bg-primary dark:bg-primary-dark h-full transition-[width] duration-300 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      )}
    </div>
  );
};

export default Progress;
