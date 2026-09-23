"use client";
import { useState } from "react";
import type { PostMetadata } from "@/schemas/post";
import styles from "./canvas.module.css";
export function assetUrl(source: string, postKey: string) {
  return `/api/asset?key=${encodeURIComponent(postKey)}&source=${encodeURIComponent(source)}`;
}
export function AssetSlot({
  id,
  label,
  description,
  aspectRatio = "4/3",
  metadata,
  postKey,
}: {
  id: string;
  label: string;
  description: string;
  aspectRatio?: string;
  metadata: PostMetadata;
  postKey: string;
}) {
  const asset = metadata.requiredAssets.find((a) => a.id === id);
  const [failedSource, setFailedSource] = useState<string>();
  if (asset?.source && failedSource !== asset.source)
    return (
      <img
        className={styles.asset}
        style={{ aspectRatio }}
        src={assetUrl(asset.source, postKey)}
        alt={label}
        onError={() => setFailedSource(asset.source)}
      />
    );
  return (
    <div
      className={styles.slot}
      style={{ aspectRatio }}
      data-missing-asset={id}
    >
      <svg
        width="var(--content-size-icon)"
        height="var(--content-size-icon)"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="6"
          stroke="currentColor"
          strokeWidth="var(--content-stroke)"
        />
        <circle
          cx="23"
          cy="23"
          r="5"
          stroke="currentColor"
          strokeWidth="var(--content-stroke)"
        />
        <path
          d="m8 48 16-15 10 10 8-8 14 13"
          stroke="currentColor"
          strokeWidth="var(--content-stroke)"
        />
      </svg>
      <strong>{label}</strong>
      <span>{description}</span>
      <small>
        {asset?.optional ? "Optional asset" : "Asset needed"} · upload in the
        editor
      </small>
    </div>
  );
}
