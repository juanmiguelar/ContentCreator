// Only the starting point for a new idea. Each post owns and can replace its source.
export const starterSource = `import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";
export default function Post({ format, metadata }: PostProps) {
  if (format === "square") return <article className={styles.square}><span>WORK IN PROGRESS</span><EditableText as="h1" field="headline" value={metadata.copy.headline} /><p>{metadata.copy.body}</p></article>;
  if (format === "story") return <article className={styles.story}><span>WORK IN PROGRESS</span><div><EditableText as="h1" field="headline" value={metadata.copy.headline} /><p>{metadata.copy.body}</p></div><footer>Social content · draft</footer></article>;
  return <article className={styles.portrait}><header>WORK IN PROGRESS</header><EditableText as="h1" field="headline" value={metadata.copy.headline} /><aside>{metadata.copy.body}</aside></article>;
}
`;
export const starterCss = `.portrait, .square, .story { height: 100%; padding: 90px; background: #fff; color: #222; font-family: Arial, sans-serif; box-sizing: border-box; }
.portrait h1, .square h1, .story h1 { font-size: 94px; line-height: 1.05; overflow-wrap: anywhere; margin: 0; }
.portrait p, .square p, .story p, .portrait aside { font-size: 32px; line-height: 1.5; }
.portrait { display: grid; grid-template-rows: 1fr 2fr 1fr; gap: 70px; }
.portrait aside { border-top: 2px solid #ddd; padding-top: 40px; max-width: 640px; }
.square { display: grid; grid-template-columns: 1fr 2fr; align-content: center; gap: 60px; }
.square h1 { font-size: 76px; }
.square p { grid-column: 2; }
.story { display: flex; flex-direction: column; justify-content: space-between; padding: 160px 100px; }
.story h1 { font-size: 116px; }
.story footer, .story span, .square span, .portrait header { font-size: 22px; letter-spacing: 3px; }
`;
