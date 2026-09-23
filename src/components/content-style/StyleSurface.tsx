import "../../../content-styles/fonts.css";
import type { ReactNode } from "react";
import type { ContentStyle } from "../../../content-styles/schema";
import { styleVariables } from "../../../content-styles/resolve";
import type { SocialFormat } from "@/lib/content/formats";
import styles from "./style.module.css";
export function StyleSurface({
  style,
  format,
  children,
}: {
  style: ContentStyle;
  format: SocialFormat;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.surface}
      data-content-style={style.id}
      data-content-template={style.templates[format].layout}
      style={styleVariables(style, format)}
    >
      {children}
    </div>
  );
}
