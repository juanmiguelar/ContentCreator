"use client";
import { useState } from "react";
import type { AssetRecord } from "@/types/post";
import { assetUrl } from "@/components/canvas/AssetSlot";
import styles from "./assets.module.css";
export function Assets({ assets }: { assets: AssetRecord[] }) {
  const [category, setCategory] = useState(""),
    [search, setSearch] = useState(""),
    [message, setMessage] = useState("");
  const categories = [...new Set(assets.map((a) => a.category))];
  const filtered = assets.filter(
    (a) =>
      (!category || a.category === category) &&
      a.name.toLowerCase().includes(search.toLowerCase()),
  );
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`Copied ${value}`);
    } catch {
      setMessage("Clipboard unavailable. Select and copy the visible path.");
    }
  }
  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="eyebrow">REUSE THE GOOD THINGS</div>
          <h1>Asset library</h1>
          <p>Shared files for your next composition.</p>
        </div>
        <span className="badge">{assets.length} local assets</span>
      </div>
      <div className="row">
        <input
          aria-label="Search assets"
          placeholder="Search assets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Asset category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All folders</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <p className="success" role="status">
        {message}
      </p>
      <div className={styles.grid}>
        {filtered.map((asset) => (
          <article key={asset.path} className={styles.card}>
            <div className={styles.preview}>
              <img src={assetUrl(asset.path, "")} alt={asset.name} />
            </div>
            <div className={styles.body}>
              <small>{asset.category}</small>
              <h2>{asset.name}</h2>
              <code>{asset.path}</code>
              <button className="textButton" onClick={() => copy(asset.path)}>
                Copy asset path ↗
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty">
          <h2>No assets found.</h2>
          <p>Add reusable files under public/assets/ or change the filter.</p>
        </div>
      )}
      <div className="notice">
        <p>
          <strong>
            Shared assets live in <code>public/assets/</code>.
          </strong>
          <br />
          Add logos, icons, photos and illustrations to purpose-oriented
          folders. Upload post-specific screenshots from a post’s editor; those
          files stay in its own <code>assets/</code> directory. SVG is
          supported.
        </p>
      </div>
    </div>
  );
}
