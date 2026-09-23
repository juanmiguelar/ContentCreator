"use client";
import { useState } from "react";
import Link from "next/link";
import type { PostRecord } from "@/types/post";
import { Icon } from "@/components/Icon";
import { NewPost } from "@/components/content/NewPost";
import styles from "./library.module.css";
const statuses = ["all", "idea", "draft", "ready", "published"];
export function Library({
  posts,
  errors,
}: {
  posts: PostRecord[];
  errors: string[];
}) {
  const [status, setStatus] = useState("all"),
    [search, setSearch] = useState(""),
    [view, setView] = useState("grid");
  const [filters, setFilters] = useState<Record<string, string>>({
    year: "",
    month: "",
    week: "",
    campaign: "",
    category: "",
    platform: "",
  });
  const options: Record<string, string[]> = {
    year: [
      ...new Set(posts.map((p) => String(p.metadata.calendar.year))),
    ].sort(),
    month: [
      ...new Set(posts.map((p) => String(p.metadata.calendar.month))),
    ].sort((a, b) => +a - +b),
    week: ["1", "2", "3", "4"],
    campaign: [
      ...new Set(posts.map((p) => p.metadata.campaign).filter(Boolean)),
    ].sort(),
    category: [...new Set(posts.flatMap((p) => p.metadata.categories))].sort(),
    platform: ["instagram", "facebook", "linkedin", "other"],
  };
  const visible = posts.filter((p) => {
    const m = p.metadata;
    return (
      (status === "all" || m.status === status) &&
      `${m.title} ${m.id} ${m.categories.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!filters.year || m.calendar.year === +filters.year) &&
      (!filters.month || m.calendar.month === +filters.month) &&
      (!filters.week || m.calendar.week === +filters.week) &&
      (!filters.campaign || m.campaign === filters.campaign) &&
      (!filters.category || m.categories.includes(filters.category)) &&
      (!filters.platform || m.platform.some((v) => v === filters.platform))
    );
  });
  const activeFilters =
    Object.values(filters).some(Boolean) || search || status !== "all";
  function reset() {
    setStatus("all");
    setSearch("");
    setFilters(Object.fromEntries(Object.keys(filters).map((k) => [k, ""])));
  }
  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="eyebrow">THE SPACE BETWEEN IDEA AND PUBLISH</div>
          <h1>Content library</h1>
          <p>A home for your ideas. A clear path to your next post.</p>
        </div>
        <NewPost />
      </div>
      <div className={styles.overview}>
        <div>
          <span className={styles.overviewIcon}>
            <Icon name="folder" size={23} />
          </span>
          <div>
            <strong>Your work, in one place.</strong>
            <p>Compose in code. Refine here. Export when it feels right.</p>
          </div>
        </div>
        <div className={styles.overviewCount}>
          <strong>{String(posts.length).padStart(2, "0")}</strong>
          <span>
            {posts.length === 1
              ? "POST IN YOUR LIBRARY"
              : "POSTS IN YOUR LIBRARY"}
          </span>
        </div>
      </div>
      <div className={styles.tabs}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
          >
            {s === "all" ? "All content" : s[0].toUpperCase() + s.slice(1)}
            <span>
              {
                posts.filter((p) => s === "all" || p.metadata.status === s)
                  .length
              }
            </span>
          </button>
        ))}
      </div>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Icon name="search" size={15} />
          <input
            placeholder="Search your content…"
            aria-label="Search content"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="segmented">
          <button
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <Icon name="grid" size={15} />
          </button>
          <button
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <Icon name="list" size={15} />
          </button>
        </div>
      </div>
      <div className={styles.filters}>
        {Object.entries(options).map(([name, values]) => (
          <select
            key={name}
            aria-label={`Filter by ${name}`}
            value={filters[name]}
            onChange={(e) => setFilters({ ...filters, [name]: e.target.value })}
          >
            <option value="">
              {name === "year"
                ? "All years"
                : name === "month"
                  ? "All months"
                  : name === "week"
                    ? "All weeks"
                    : name === "campaign"
                      ? "All campaigns"
                      : name === "category"
                        ? "All categories"
                        : "All platforms"}
            </option>
            {values.map((value) => (
              <option key={value} value={value}>
                {name === "month"
                  ? new Date(2026, +value - 1).toLocaleDateString("en", {
                      month: "long",
                    })
                  : name === "week"
                    ? `Week 0${value}`
                    : value}
              </option>
            ))}
          </select>
        ))}
        {activeFilters && (
          <button className="textButton" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>
      {errors.map((error) => (
        <p key={error} role="alert" className="error">
          {error}
        </p>
      ))}
      <div className={styles.resultHead}>
        <span>
          {visible.length} {visible.length === 1 ? "post" : "posts"}
        </span>
        <span>Sorted by editorial date ↓</span>
      </div>
      <div className={view === "grid" ? styles.grid : styles.list}>
        {visible.map((post) => (
          <Link
            className={styles.card}
            key={post.key}
            href={`/posts/${post.key}`}
          >
            <div className={styles.thumbnail}>
              <div className={styles.thumbTop}>
                <span>
                  {post.metadata.categories.includes("example")
                    ? "EXAMPLE CONTENT"
                    : post.metadata.campaign || "WORK IN PROGRESS"}
                </span>
                <Icon name="code" size={14} />
              </div>
              <div className={styles.thumbTitle}>
                {post.metadata.copy.headline || post.metadata.title}
              </div>
              <div className={styles.thumbBottom}>
                <span>PORTRAIT · SQUARE · STORY</span>
                <span className={styles.slideCount}>
                  {post.metadata.slides.length} slides
                </span>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className="row spaced">
                <span className={`badge ${post.metadata.status}`}>
                  {post.metadata.status[0].toUpperCase() +
                    post.metadata.status.slice(1)}
                </span>
                <span className="muted">
                  {post.metadata.publishDate
                    ? new Date(
                        `${post.metadata.publishDate}T12:00:00`,
                      ).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Unscheduled"}
                </span>
              </div>
              <h2>{post.metadata.title}</h2>
              <p>
                {post.metadata.campaign || "No campaign"} <span>·</span>{" "}
                {post.metadata.platform.join(", ")}
              </p>
              <div className={styles.cardFoot}>
                <span>
                  {post.missingAssets.length
                    ? `${post.missingAssets.length} asset slot${post.missingAssets.length > 1 ? "s" : ""} to fill`
                    : "Assets ready"}
                  {post.warnings.length > 0
                    ? ` · ${post.warnings.length} warning(s)`
                    : ""}
                </span>
                <Icon name="arrow" size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!visible.length && (
        <div className="empty">
          <h2>
            {posts.length
              ? "No posts match these filters."
              : "Your first idea belongs here."}
          </h2>
          <p>
            {posts.length
              ? "Try another search or clear the filters."
              : "Create an idea, or ask Codex to create a post with the repository skill."}
          </p>
          {activeFilters && <button onClick={reset}>Clear filters</button>}
        </div>
      )}
      <div className={styles.bottomNote}>
        <div className="notice">
          <Icon name="code" size={18} />
          <p>
            <strong>Publication design lives in Content Styles.</strong>
            <br />
            Select a registered pack from <code>content-styles/</code> for every
            post.
            <code>DESIGN.md</code> describes only this application’s interface.
          </p>
        </div>
        <div className={styles.fileNote}>
          <Icon name="folder" size={13} />
          <span>
            Everything you see lives in <code>content/YYYY/MM/week-XX/</code>
          </span>
          <span>No cloud. No database. Just your files.</span>
        </div>
      </div>
    </div>
  );
}
