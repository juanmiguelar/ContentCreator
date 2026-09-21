"use client";
import type { PostRecord } from "@/types/post";
import { postRegistry } from "@/lib/content-registry";
import { FORMAT_KEYS } from "@/lib/content/formats";
import { FormatPanel } from "@/components/export/FormatPanel";
import styles from "@/components/editor/editor.module.css";
export default function PostPreviews({ post }: { post: PostRecord }) {
  const Composition = postRegistry[post.key];
  if (!Composition)
    return (
      <div className="error">
        No registered composition. Run <code>npm run registry</code> and reload.
        For a production server, rebuild after creating posts.
      </div>
    );
  return (
    <div className={styles.formats}>
      {FORMAT_KEYS.map((format) => (
        <FormatPanel
          key={format}
          post={post}
          format={format}
          Composition={Composition}
        />
      ))}
    </div>
  );
}
