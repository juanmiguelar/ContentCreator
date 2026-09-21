import type { PostProps } from "@/types/post";
import { AssetSlot } from "@/components/canvas/AssetSlot";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";
function Diagram({ wide = false }: { wide?: boolean }) {
  return (
    <svg
      viewBox={wide ? "0 0 700 220" : "0 0 700 400"}
      role="img"
      aria-label="Three independently composed formats"
      className={styles.diagram}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect
          x="50"
          y={wide ? 30 : 90}
          width="180"
          height={wide ? 160 : 230}
          rx="3"
        />
        <rect x="260" y={wide ? 40 : 150} width="175" height="175" rx="3" />
        <rect x="465" y="15" width="175" height={wide ? 195 : 340} rx="3" />
        <path
          d={
            wide
              ? "M75 65h100M285 80h100M490 55h100"
              : "M75 135h100M285 195h100M490 65h100"
          }
        />
        <circle cx="140" cy={wide ? 125 : 240} r="25" />
        <path d={wide ? "m320 160 30-45 30 45Z" : "m320 280 30-45 30 45Z"} />
        <rect x="520" y={wide ? 100 : 190} width="60" height="60" />
      </g>
    </svg>
  );
}
export default function Post({
  format,
  slideId,
  metadata,
  postKey,
}: PostProps) {
  const headline = (
    <EditableText as="h1" field="headline" value={metadata.copy.headline} />
  );
  const slot = (
    <AssetSlot
      id="dashboard-screenshot"
      label="Your workspace, here."
      description="Add your screenshot to complete this example."
      aspectRatio={format === "story" ? "4/5" : "4/3"}
      metadata={metadata}
      postKey={postKey}
    />
  );
  if (slideId === "workflow")
    return (
      <article
        className={`${styles.base} ${styles[format]} ${styles.workflow}`}
      >
        <header>
          EXAMPLE CONTENT <span>02 / 02</span>
        </header>
        <h1>
          From an idea
          <br />
          to something real.
        </h1>
        <div className={styles.workflowBody}>
          <div className={styles.steps}>
            <p>
              <b>01</b> Create in code.
            </p>
            <p>
              <b>02</b> Review every format.
            </p>
            <p>
              <b>03</b> Export. Make it public.
            </p>
          </div>
          {slot}
        </div>
        <footer>
          <EditableText field="cta" value={metadata.copy.cta} />
          <span>LOCAL · GIT-FIRST</span>
        </footer>
      </article>
    );
  if (format === "square")
    return (
      <article className={`${styles.base} ${styles.square}`}>
        <header>
          EXAMPLE CONTENT <span>01 / 02</span>
        </header>
        <div className={styles.squareLead}>
          {headline}
          <p>{metadata.copy.subtitle}</p>
        </div>
        <Diagram wide />
        <footer>
          {metadata.copy.body}
          <span>1080 × 1080</span>
        </footer>
      </article>
    );
  if (format === "story")
    return (
      <article className={`${styles.base} ${styles.story}`}>
        <header>
          EXAMPLE CONTENT <span>01 / 02</span>
        </header>
        <div className={styles.storyLead}>
          <span className={styles.eyebrow}>A PLACE FOR YOUR IDEAS</span>
          {headline}
          <p>{metadata.copy.subtitle}</p>
        </div>
        <Diagram />
        <div className={styles.storyNote}>{metadata.copy.body}</div>
        <footer>
          {metadata.copy.cta}
          <span>1080 × 1920</span>
        </footer>
      </article>
    );
  return (
    <article className={`${styles.base} ${styles.portrait}`}>
      <header>
        EXAMPLE CONTENT <span>01 / 02</span>
      </header>
      <div className={styles.portraitLead}>
        {headline}
        <p>{metadata.copy.subtitle}</p>
      </div>
      <Diagram />
      <footer>
        {metadata.copy.body}
        <span>1080 × 1350</span>
      </footer>
    </article>
  );
}
