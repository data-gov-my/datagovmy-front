import React, { useState, useEffect, useRef } from "react";

function Timer({
  initial,
  isRunning,
  setIsRunning,
}: {
  initial?: number;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
}) {
  const [seconds, setSeconds] = useState(initial ?? 60);
  const displaySeconds = seconds % 60;
  const minutes = (seconds - displaySeconds) / 60;
  const displayMinutes = minutes % 60;

  useInterval(
    () => (seconds > 0 ? setSeconds(seconds - 1) : setIsRunning(false)),
    isRunning ? 1000 : null
  );
  return (
    <>
      {displayMinutes}:{String(displaySeconds).padStart(2, "0")}
    </>
  );
}

export { deleteCookie, setCookie, Timer };

// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback && savedCallback.current && savedCallback.current();

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const setCookie = (name: string, value: string, mins: number = 5) => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + mins);

  document.cookie = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/`;
};

const deleteCookie = (name: string) => (document.cookie = `${name}=; Max-Age=0; path=/`);
