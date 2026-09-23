"use client";
import { useRef, useState, useEffect, type ComponentType } from "react";
import type { PostProps, PostRecord } from "@/types/post";
import {
  orderedSlides,
  SOCIAL_FORMATS,
  type SocialFormat,
} from "@/lib/content/formats";
import { SocialCanvas } from "@/components/canvas/SocialCanvas";
import { Slide } from "@/components/canvas/Slide";
import { Carousel } from "@/components/canvas/Carousel";
import { exportSlides } from "@/lib/export/render";
import type { ContentStyle } from "../../../content-styles/schema";
import { inspectContentStyle } from "../../../content-styles/validate-dom";
import { StyleSurface } from "@/components/content-style/StyleSurface";
import styles from "./export.module.css";
export function FormatPanel({
  post,
  format,
  Composition,
  contentStyle,
}: {
  contentStyle: ContentStyle;
  post: PostRecord;
  format: SocialFormat;
  Composition: ComponentType<PostProps>;
}) {
  const [active, setActive] = useState(0),
    [type, setType] = useState<"jpg" | "png">("jpg"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [violations, setViolations] = useState<string[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const definition = SOCIAL_FORMATS[format],
    slides = orderedSlides(post.metadata.slides);
  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    let pending = 0;
    const check = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        const problems = [
          ...element.querySelectorAll<HTMLElement>("[data-content-style]"),
        ].flatMap((root) => inspectContentStyle(root, contentStyle));
        setViolations([...new Set(problems)]);
      });
    };
    check();
    const observer = new MutationObserver(check);
    const stage = element.querySelector("[data-style-stage]");
    if (stage)
      observer.observe(stage, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    return () => {
      cancelAnimationFrame(pending);
      observer.disconnect();
    };
  }, [post.metadata, contentStyle]);
  async function download(all: boolean) {
    setBusy(true);
    setError("");
    try {
      const nodes = Array.from(
        panel.current!.querySelectorAll<HTMLElement>("[data-canvas-id]"),
      );
      await exportSlides(
        all ? nodes : [nodes[active]],
        post.metadata.id,
        format,
        type,
        all ? 1 : active + 1,
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      ref={panel}
      className={styles.panel}
      aria-label={`${definition.label} format`}
    >
      <header className={styles.header}>
        <div>
          <h2>{definition.label}</h2>
          <span>
            {definition.width} × {definition.height}
          </span>
        </div>
        <span className={styles.ratio}>
          {format === "portrait" ? "4:5" : format === "square" ? "1:1" : "9:16"}
        </span>
      </header>
      <div className={styles.stage} data-style-stage>
        {slides.map((slide, i) => (
          <div
            className={i === active ? styles.active : styles.inactive}
            key={slide.id}
            aria-hidden={i !== active}
          >
            <SocialCanvas
              width={definition.width}
              height={definition.height}
              canvasId={`${format}-${slide.id}`}
            >
              <Slide id={slide.id}>
                <StyleSurface style={contentStyle} format={format}>
                  <Composition
                    contentStyle={contentStyle}
                    template={contentStyle.templates[format]}
                    format={format}
                    slideId={slide.id}
                    metadata={post.metadata}
                    postKey={post.key}
                  />
                </StyleSurface>
              </Slide>
            </SocialCanvas>
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <Carousel slides={slides} active={active} onChange={setActive} />
        <span className="muted">
          {active + 1} / {slides.length}
        </span>
      </div>
      <div className={styles.controls}>
        <div className="segmented" aria-label="Export type">
          {(["jpg", "png"] as const).map((t) => (
            <button
              key={t}
              aria-pressed={type === t}
              onClick={() => setType(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="muted">
          {type === "jpg" ? "Quality 95%" : "Lossless"}
        </span>
      </div>
      <div className={styles.downloads}>
        <button
          aria-label="Download slide"
          onClick={() => download(false)}
          disabled={busy}
        >
          ↓ {busy ? "Exporting…" : "Download slide"}
        </button>
        <button
          className="textButton"
          onClick={() => download(true)}
          disabled={busy}
        >
          Download all
        </button>
      </div>
      {violations.length > 0 && (
        <p className="error" role="alert" data-style-violations>
          Content Style {contentStyle.name}: {violations.join(" ")} Export is
          blocked until these rules are satisfied.
        </p>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </section>
  );
}
