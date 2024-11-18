"use client";

import { ReactNode, useEffect, useRef } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { clx } from "../../lib/helpers";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

const Collapse = ({
  children,
  className,
  isOpen,
  horizontal = false,
  openDuration = 200,
  closeDuration = 300,
}: {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  horizontal?: boolean;
  openDuration?: number;
  closeDuration?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef(0);
  const initialOpen = useRef(isOpen);
  const initialRender = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    const animation = animationRef.current;
    if (animation) {
      clearTimeout(animation);
    }
    if (initialRender.current || !container || !inner) return;

    container.classList.toggle(`duration-${closeDuration}`, !isOpen);
    container.classList.toggle(`duration-${openDuration}`, isOpen);

    if (horizontal) {
      // save initial width to avoid word wrapping when container width will be changed
      inner.style.width = `${inner.clientWidth}px`;
      container.style.width = `${inner.clientWidth}px`;
    } else {
      container.style.height = `${inner.clientHeight}px`;
    }

    if (isOpen) {
      animationRef.current = window.setTimeout(() => {
        // should be style property in kebab-case, not css class name
        container.style.removeProperty("height");
      }, 300);
    } else {
      setTimeout(() => {
        if (horizontal) {
          container.style.width = "0px";
        } else {
          container.style.height = "0px";
        }
      }, 0);
    }
  }, [horizontal, isOpen]);

  useEffect(() => {
    initialRender.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="transform-gpu overflow-hidden transition-all ease-in-out motion-reduce:transition-none"
      style={initialOpen.current || horizontal ? undefined : { height: 0 }}
    >
      <div
        ref={innerRef}
        className={clx(
          "transition-opacity duration-300 ease-in-out motion-reduce:transition-none",
          isOpen ? "opacity-100" : "opacity-0",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { Collapse, Collapsible, CollapsibleTrigger, CollapsibleContent };
