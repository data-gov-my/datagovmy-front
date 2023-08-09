import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";

type ProgressProps = {
  disableOnSameRoute?: boolean;
};

const Progress: FunctionComponent<ProgressProps> = ({ disableOnSameRoute = true }) => {
  const [opacity, setOpacity] = useState<number>(0);
  const [progress, setProgress] = useState<number>(-1);
  const { events, route } = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let trickle: NodeJS.Timer;

    const gradualTimeout = (callback: (progress: number) => void) => {
      let n = 0;
      var amount: number;
      if (n >= 0 && n < 20) {
        amount = 10;
      } else if (n >= 20 && n < 40) {
        amount = 0.01;
      } else {
        amount = 0;
      }
      trickle = setInterval(() => {
        n += amount;

        if (n > 40) {
          clearInterval(trickle);
        } else {
          callback(n);
        }
      }, 150);
    };

    const startLoading = (url: string) => {
        if (disableOnSameRoute && route === url) return;

        clearTimeout(timeout);
        clearInterval(trickle);
        timeout = setTimeout(() => {
          setOpacity(1);
          setProgress(10);
        }, 0);

        gradualTimeout(progress => {
          setProgress(progress);
        });
      },
      endLoading = () => {
        clearTimeout(timeout);
        clearInterval(trickle);
        setProgress(50 + Math.random() * 50);
        setTimeout(() => {
          setProgress(100);
        }, 50);
        setTimeout(() => {
          setOpacity(0);
          setProgress(-1);
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
            opacity: `${opacity}`,
          }}
        />
      )}
    </div>
  );
};

export default Progress;
