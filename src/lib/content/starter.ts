// New posts own their composition. Appearance and format defaults come from the selected pack.
export const starterSource = `import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";
export default function Post({ metadata }: PostProps) {
  return <article className={styles.post}><header>WORK IN PROGRESS</header><main><EditableText as="h1" field="headline" value={metadata.copy.headline} /><p>{metadata.copy.body}</p></main><footer>Social content · draft</footer></article>;
}
`;
export const starterCss = `.post { height: 100%; display: flex; flex-direction: column; padding: var(--content-padding-top) var(--content-padding-x) var(--content-padding-bottom); background: var(--content-color-canvas); color: var(--content-color-ink); font-family: var(--content-font-body); }
.post main { display: grid; grid-template-columns: var(--content-columns); gap: var(--content-gap); margin-top: var(--content-lead-space); align-items: start; }
.post h1 { font-size: var(--content-title-size); font-weight: var(--content-title-weight); line-height: var(--content-title-leading); letter-spacing: var(--content-title-tracking); overflow-wrap: anywhere; margin: 0; }
.post p { font-size: var(--content-body-size); line-height: var(--content-body-leading); color: var(--content-color-muted); margin: 0; }
.post header, .post footer { font-family: var(--content-font-label); font-size: var(--content-label-size); letter-spacing: var(--content-label-tracking); }
.post footer { margin-top: auto; border-top: var(--content-border-width) solid var(--content-color-line); padding-top: var(--content-space-medium); }
`;
