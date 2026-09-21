"use client";
import { useState } from "react";
import Link from "next/link";
import type { PostRecord } from "@/types/post";
import { NewPost } from "@/components/content/NewPost";
import styles from "./calendar.module.css";
export function Calendar({
  posts,
  errors,
}: {
  posts: PostRecord[];
  errors: string[];
}) {
  const today = new Date(),
    [year, setYear] = useState(today.getFullYear()),
    [month, setMonth] = useState(today.getMonth() + 1);
  const years = [
    ...new Set([
      today.getFullYear(),
      ...posts.map((p) => +p.key.split("/")[0]),
    ]),
  ].sort();
  const visible = posts.filter(
    (p) => +p.key.split("/")[0] === year && +p.key.split("/")[1] === month,
  );
  const title = new Date(year, month - 1).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
  function move(delta: number) {
    const next = new Date(year, month - 1 + delta);
    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
  }
  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="eyebrow">A LITTLE STRUCTURE FOR WHAT’S NEXT</div>
          <h1>Editorial calendar</h1>
          <p>Four editorial weeks. A clear view of your repository.</p>
        </div>
        <NewPost />
      </div>
      <div className={`row spaced ${styles.navigation}`}>
        <div className="row">
          <button aria-label="Previous month" onClick={() => move(-1)}>
            ←
          </button>
          <h2>{title}</h2>
          <button aria-label="Next month" onClick={() => move(1)}>
            →
          </button>
        </div>
        <div className="row">
          <select
            aria-label="Calendar year"
            value={year}
            onChange={(e) => setYear(+e.target.value)}
          >
            {[...new Set([...years, year])].sort().map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <select
            aria-label="Calendar month"
            value={month}
            onChange={(e) => setMonth(+e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(2026, i).toLocaleDateString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errors.map((error) => (
        <p className="error" key={error}>
          {error}
        </p>
      ))}
      <div className={styles.weeks}>
        {[1, 2, 3, 4].map((week) => {
          const bucket = visible.filter(
            (p) => +p.key.split("/")[2].slice(-2) === week,
          );
          return (
            <section className={styles.week} key={week}>
              <header>
                <span>WEEK 0{week}</span>
                <span>{bucket.length}</span>
              </header>
              <p className="muted">
                {(week - 1) * 7 + 1}–
                {week === 4 ? new Date(year, month, 0).getDate() : week * 7}{" "}
                {new Date(year, month - 1).toLocaleDateString("en", {
                  month: "short",
                })}
              </p>
              {bucket.map((post) => (
                <Link
                  className={styles.post}
                  key={post.key}
                  href={`/posts/${post.key}`}
                >
                  <span className={`badge ${post.metadata.status}`}>
                    {post.metadata.status}
                  </span>
                  <h3>{post.metadata.title}</h3>
                  <p>{post.metadata.publishDate || "No publish date"}</p>
                  <small>{post.metadata.platform.join(" · ")}</small>
                  {post.warnings.map((w) => (
                    <p className="error" key={w}>
                      {w}
                    </p>
                  ))}
                </Link>
              ))}
              {!bucket.length && (
                <div className={styles.open}>Room for an idea.</div>
              )}
              <code>
                content/{year}/{String(month).padStart(2, "0")}/week-0{week}/
              </code>
            </section>
          );
        })}
      </div>
      <div className="notice">
        Editorial buckets follow days 1–7, 8–14, 15–21 and 22–end of month.
        Cards reflect their physical folders. Date inconsistencies are flagged,
        never silently moved.
      </div>
    </div>
  );
}
