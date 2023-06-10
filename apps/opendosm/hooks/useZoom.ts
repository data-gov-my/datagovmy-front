import {
  MutableRefObject,
  useState,
  useEffect,
  WheelEvent,
  MouseEvent,
  TouchEvent,
  useCallback,
} from "react";

type Viewbox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 *
 * @param enableZoom true | false
 * @param ref ref to the <div> containing the subject
 * @returns { onWheel, onMove, onDown, onUp, onReset, zoomIn, zoomOut }
 */
export const useZoom = (enableZoom: boolean, ref: MutableRefObject<null | Document>) => {
  const [svg, setSvg] = useState<SVGSVGElement | undefined>();
  const [original, setOriginal] = useState<Pick<Viewbox, "w" | "h">>({ w: 0, h: 0 });
  const [prevTouch, setPrevTouch] = useState<Touch>();
  const [pan, setPanning] = useState<boolean>(false);
  const [data, setData] = useState<Viewbox>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  let dx = 0;
  let dy = 0;
  let dw = 0;
  let dh = 0;

  useEffect(() => {
    if (!enableZoom) return;
    if (ref.current && ref.current !== null) {
      const svg = ref.current.querySelector("svg");
      if (svg !== null) {
        // ref.current?.addEventListener("wheel", e => e.preventDefault());
        ref.current?.addEventListener("touchmove", e => e.preventDefault());
        // ref.current?.addEventListener("scroll", e => e.preventDefault());
        const rect = svg.getBoundingClientRect();
        setSvg(svg);
        setOriginal({
          w: rect.width,
          h: rect.height,
        });
        setData({
          x: 0,
          y: 0,
          w: rect.width,
          h: rect.height,
        });
      }
    }
  }, [ref.current]);

  const zoomIn = (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    let w = data.w;
    let h = data.h;
    dw += w * 0.1;
    dh += h * 0.1;
    dx = (dw * w) / (2 * data.w);
    dy = (dh * h) / (2 * data.h);

    if (ref.current) {
      svg?.setAttribute("viewBox", `${data.x + dx} ${data.y + dy} ${data.w - dw} ${data.h - dh}`);
    }

    setData(state => ({
      ...state,
      x: state.x + dx,
      y: state.y + dy,
      w: state.w - dw,
      h: state.h - dh,
    }));
  };
  const zoomOut = (e?: MouseEvent<HTMLButtonElement> | any) => {
    if (e) e.preventDefault();
    let w = data.w;
    let h = data.h;
    dw += w * -0.05;
    dh += h * -0.05;
    dx = (dw * w) / (2 * data.w);
    dy = (dh * h) / (2 * data.h);

    if (ref.current) {
      svg?.setAttribute("viewBox", `${data.x + dx} ${data.y + dy} ${data.w - dw} ${data.h - dh}`);
    }

    setData(state => ({
      ...state,
      x: state.x + dx,
      y: state.y + dy,
      w: state.w - dw,
      h: state.h - dh,
    }));
  };

  const onWheel = (e: WheelEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (!isTouchEvent(e)) {
      if (Math.sign(e.deltaY) < 0) {
        zoomIn();
      } else {
        zoomOut();
      }

      move();
    }
  };

  const move = useCallback(() => {
    setData(state => ({
      ...state,
      x: state.x + dx,
      y: state.y + dy,
    }));
  }, []);

  const onReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (ref.current) {
      setData({
        x: 0,
        y: 0,
        w: original.w,
        h: original.h,
      });
      svg?.setAttribute("viewBox", `0 0 ${original.w} ${original.h}`);
    }
  };

  const onMove = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (!pan) return;
    if (pan && !isTouchEvent(e)) {
      dx += e.movementX;
      dy += e.movementY;
    } else if (pan && isTouchEvent(e)) {
      const touch = (e as TouchEvent).touches[0];

      if (prevTouch) {
        setData(state => ({
          ...state,
          x: state.x - (touch.clientX - prevTouch.clientX),
          y: state.y - (touch.clientY - prevTouch.clientY),
        }));
      }
      setPrevTouch(touch as Touch);
    }

    svg?.setAttribute("viewBox", `${data.x - dx} ${data.y - dy} ${data.w} ${data.h}`);
  };

  const onDown = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    setPanning(true);
  };
  const onUp = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    setPanning(false);
    setData(state => ({
      ...state,
      x: state.x - dx,
      y: state.y - dy,
    }));

    setPrevTouch(undefined);
  };

  function isTouchEvent(
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement> | WheelEvent<HTMLDivElement>
  ): event is TouchEvent<HTMLDivElement> {
    return (event as TouchEvent).touches !== undefined;
  }

  return {
    onWheel,
    onMove,
    onDown,
    onUp,
    onReset,
    zoomIn,
    zoomOut,
  };
};
