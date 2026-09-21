"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./canvas.module.css";

export function SocialCanvas({ width, height, children, canvasId }: {
  width: number;
  height: number;
  children: ReactNode;
  canvasId: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={frame} className={styles.frame} style={{ aspectRatio: `${width}/${height}` }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <div
          className={styles.canvas}
          data-canvas-id={canvasId}
          data-width={width}
          data-height={height}
          style={{ width, height }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
