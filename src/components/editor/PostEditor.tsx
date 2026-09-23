"use client";
import { Component, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PostRecord, AssetRecord } from "@/types/post";
import type { PostMetadata } from "@/schemas/post";
import dynamic from "next/dynamic";
import { ContentStyleSelector } from "@/components/content-style/ContentStyleSelector";
import styles from "./editor.module.css";
// Compositions are browser-rendered: a newly regenerated registry may compile
// between the server response and hydration. Keep the initial markup stable.
const PostPreviews = dynamic(
  () => import("@/components/content/PostPreviews"),
  {
    ssr: false,
    loading: () => (
      <div className="notice" role="status">
        Loading Portrait, Square and Story…
      </div>
    ),
  },
);
class CompositionBoundary extends Component<
  { children: ReactNode },
  { error: string }
> {
  state = { error: "" };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    return this.state.error ? (
      <div role="alert" className="error">
        Composition failed: {this.state.error}. Fix Post.tsx and reload.
      </div>
    ) : (
      this.props.children
    );
  }
}
export function PostEditor({
  initial,
  assets,
}: {
  initial: PostRecord;
  assets: AssetRecord[];
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initial),
    [metadata, setMetadata] = useState(initial.metadata),
    [caption, setCaption] = useState(initial.caption);
  const [categoriesInput, setCategoriesInput] = useState(
    initial.metadata.categories.join(", "),
  );
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const dirty =
    JSON.stringify(metadata) !== JSON.stringify(saved.metadata) ||
    caption !== saved.caption;
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const post = { ...saved, metadata, caption };
  function update<K extends keyof PostMetadata>(
    key: K,
    value: PostMetadata[K],
  ) {
    setMetadata((current) => ({ ...current, [key]: value }));
    setMessage("");
  }
  function accept(result: PostRecord) {
    setSaved(result);
    setMetadata(result.metadata);
    setCaption(result.caption);
    setCategoriesInput(result.metadata.categories.join(", "));
    router.refresh();
  }
  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/posts/${post.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata, caption, revision: saved.revision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      accept(result);
      setMessage("Saved to post.json and caption.md. Ready for Git review.");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setMessage("Caption copied.");
    } catch {
      setError(
        "Clipboard unavailable. Select the caption and copy it manually.",
      );
    }
  }
  async function upload(slot: string, file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.set("key", post.key);
      form.set("slot", slot);
      form.set("file", file);
      form.set("revision", saved.revision);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      accept(result);
      setMessage("Asset saved in this post’s assets folder.");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function setPublication(
    platform: keyof PostMetadata["published"],
    field: "date" | "url",
    value: string,
  ) {
    const current = metadata.published[platform];
    update("published", {
      ...metadata.published,
      [platform]: {
        date:
          current?.date ??
          metadata.publishDate ??
          new Date().toLocaleDateString("en-CA"),
        ...current,
        [field]: value || undefined,
      },
    });
  }
  return (
    <div className="page">
      <div className="breadcrumb">
        <Link href="/">Content library</Link>
        <span>/</span>
        <Link href="/calendar">
          {post.key.split("/").slice(0, 3).join(" / ")}
        </Link>
        <span>/</span>
        <span>{metadata.id}</span>
      </div>
      <div className="pageHead">
        <div>
          <div className="eyebrow">
            {metadata.categories.includes("example")
              ? "EXAMPLE CONTENT · NEUTRAL DESIGN"
              : "YOUR POST WORKSPACE"}
          </div>
          <h1>{metadata.title}</h1>
          <div className="row">
            <span className={`badge ${metadata.status}`}>
              {metadata.status}
            </span>
            <span className="muted">
              {metadata.publishDate || "Unscheduled"} ·{" "}
              {metadata.campaign || "No campaign"} · {metadata.slides.length}{" "}
              slides
            </span>
          </div>
        </div>
        <button className="primary" onClick={save} disabled={busy || !dirty}>
          {busy ? "Saving…" : dirty ? "Save changes" : "All changes saved"}
        </button>
      </div>
      <div className={styles.feedback} aria-live="polite">
        {message && <p className="success">{message}</p>}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {saved.warnings.map((w) => (
          <p key={w} className="notice">
            {w}
          </p>
        ))}
      </div>
      <ContentStyleSelector
        value={metadata.style}
        onChange={(value) => update("style", value)}
      />
      <div className={styles.sectionHead}>
        <h2>One idea. Three compositions.</h2>
        <span>Full-resolution canvases · preview scaled to fit</span>
      </div>
      {saved.missingAssets.length > 0 && (
        <p className={styles.assetNote}>
          ○ {saved.missingAssets.length} asset slot to fill below. Export
          includes the placeholder until an image is supplied.
        </p>
      )}
      <CompositionBoundary key={metadata.style}>
        <PostPreviews post={post} />
      </CompositionBoundary>
      <div className={styles.editing}>
        <div className={styles.leftColumn}>
          <section className="panel">
            <div className="row spaced">
              <h2>Caption</h2>
              <code>caption.md</code>
            </div>
            <label>
              <span className="muted">The words that go with your post</span>
              <textarea
                aria-label="Caption"
                rows={9}
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                  setMessage("");
                }}
              />
            </label>
            <div className={styles.captionMeta}>
              <span>{Array.from(caption).length} characters</span>
              <span>
                {(caption.match(/#[\p{L}\p{N}_]+/gu) ?? []).length} hashtags
              </span>
            </div>
            <div className="row spaced">
              <button onClick={copyCaption}>Copy caption</button>
              <button
                className="primary"
                onClick={save}
                disabled={busy || !dirty}
              >
                Save
              </button>
            </div>
          </section>
          <section className="panel">
            <div className="row spaced">
              <h2>Composition copy</h2>
              <span className="muted">Live preview</span>
            </div>
            <p className="muted">
              Text fields declared by this post. Layout stays in React and CSS.
            </p>
            {Object.entries(metadata.copy).map(([key, value]) => (
              <label className="field" key={key}>
                {key[0].toUpperCase() + key.slice(1)}
                <textarea
                  rows={2}
                  value={value}
                  onChange={(e) =>
                    update("copy", { ...metadata.copy, [key]: e.target.value })
                  }
                />
              </label>
            ))}
            {!Object.keys(metadata.copy).length && (
              <p className="muted">
                Declare metadata.copy fields and use them in Post.tsx to enable
                copy editing.
              </p>
            )}
          </section>
          <section className="panel">
            <h2>Assets</h2>
            <p className="muted">
              Post-specific uploads stay with the post. Shared assets are reused
              by path.
            </p>
            {dirty && (
              <p className="notice">
                Save your changes before uploading a file.
              </p>
            )}
            {!metadata.requiredAssets.length && (
              <p className="muted">
                No asset slots declared. Codex can add slots to Post.tsx and
                post.json.
              </p>
            )}
            {metadata.requiredAssets.map((asset) => (
              <div className={styles.assetSlot} key={asset.id}>
                <div className="row spaced">
                  <strong>{asset.id}</strong>
                  <span className="badge">
                    {saved.missingAssets.includes(asset.id)
                      ? asset.optional
                        ? "Optional · empty"
                        : "Missing"
                      : "Provided"}
                  </span>
                </div>
                <p>{asset.description}</p>
                {asset.source && <code>{asset.source}</code>}
                <label>
                  Upload image
                  <input
                    aria-label={`Upload ${asset.id}`}
                    disabled={busy || dirty}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    onChange={(e) => upload(asset.id, e.target.files?.[0])}
                  />
                </label>
                <label>
                  Or select a shared asset
                  <select
                    value={
                      asset.source?.startsWith("/assets/") ? asset.source : ""
                    }
                    onChange={(e) =>
                      update(
                        "requiredAssets",
                        metadata.requiredAssets.map((a) =>
                          a.id === asset.id
                            ? {
                                ...a,
                                source: e.target.value || undefined,
                                status: e.target.value ? "provided" : "missing",
                              }
                            : a,
                        ),
                      )
                    }
                  >
                    <option value="">
                      {asset.source?.startsWith("assets/")
                        ? "Using uploaded post asset"
                        : "Choose from library"}
                    </option>
                    {assets.map((a) => (
                      <option key={a.path} value={a.path}>
                        {a.category}/{a.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </section>
        </div>
        <aside className={styles.rightColumn}>
          <section className="panel">
            <div className="row spaced">
              <h2>Post details</h2>
              <code>post.json</code>
            </div>
            <div className="formGrid">
              <label className="full">
                Title
                <input
                  value={metadata.title}
                  maxLength={200}
                  onChange={(e) => update("title", e.target.value)}
                />
              </label>
              <label>
                Status
                <select
                  value={metadata.status}
                  onChange={(e) =>
                    update("status", e.target.value as PostMetadata["status"])
                  }
                >
                  {["idea", "draft", "ready", "published"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Publish date
                <input
                  type="date"
                  value={metadata.publishDate ?? ""}
                  onChange={(e) =>
                    update("publishDate", e.target.value || null)
                  }
                />
              </label>
              <label className="full">
                Campaign
                <input
                  value={metadata.campaign}
                  onChange={(e) => update("campaign", e.target.value)}
                />
              </label>
              <label className="full">
                Categories (comma-separated)
                <input
                  value={categoriesInput}
                  onChange={(e) => {
                    setCategoriesInput(e.target.value);
                    update(
                      "categories",
                      e.target.value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    );
                  }}
                />
              </label>
              <fieldset className={`${styles.platforms} full`}>
                <legend>Platforms</legend>
                {(["instagram", "facebook", "linkedin", "other"] as const).map(
                  (platform) => (
                    <label key={platform}>
                      <input
                        type="checkbox"
                        checked={metadata.platform.includes(platform)}
                        onChange={(e) =>
                          update(
                            "platform",
                            e.target.checked
                              ? [...metadata.platform, platform]
                              : metadata.platform.filter((p) => p !== platform),
                          )
                        }
                      />
                      {platform}
                    </label>
                  ),
                )}
              </fieldset>
            </div>
            <hr className={styles.divider} />
            <h2>Publication links</h2>
            <p className="muted">
              Publish manually, then record the date and link here.
            </p>
            {metadata.platform.map((platform) => (
              <div className={styles.publication} key={platform}>
                <label>
                  {platform} URL
                  <input
                    type="url"
                    aria-label={`${platform} publication URL`}
                    placeholder="https://…"
                    value={metadata.published[platform]?.url ?? ""}
                    onChange={(e) =>
                      setPublication(platform, "url", e.target.value)
                    }
                  />
                </label>
                {metadata.published[platform] && (
                  <div className="row">
                    <label>
                      Published on
                      <input
                        type="date"
                        value={metadata.published[platform]?.date ?? ""}
                        onChange={(e) =>
                          setPublication(platform, "date", e.target.value)
                        }
                      />
                    </label>
                    <button
                      className="textButton"
                      onClick={() =>
                        update("published", {
                          ...metadata.published,
                          [platform]: null,
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              className="primary"
              onClick={save}
              disabled={busy || !dirty}
            >
              Save details
            </button>
          </section>
          <div className="notice">
            <div>
              <strong>These are your repository files.</strong>
              <p>
                Saving updates the working tree. Review <code>git diff</code>{" "}
                before committing.
              </p>
              <code>content/{post.key}/</code>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
