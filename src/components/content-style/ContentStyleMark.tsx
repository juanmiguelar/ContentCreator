import type { ContentStyle } from "../../../content-styles/schema";
import { StyleAsset } from "./StyleAsset";
import styles from "./style.module.css";

/** A compact registered brand mark for a publication header. */
export function ContentStyleMark({ style }: { style: ContentStyle }) {
  const logo = Object.entries(style.assets).find(
    ([, asset]) => asset.role === "logo",
  );
  if (!logo) return null;
  return (
    <StyleAsset
      styleId={style.id}
      assetId={logo[0]}
      placement="header-start"
      className={styles.mark}
    />
  );
}
