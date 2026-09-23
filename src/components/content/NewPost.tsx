"use client";
import { useEffect, useRef, useState } from "react";
import { ContentStyleSelector } from "@/components/content-style/ContentStyleSelector";
import { Icon } from "@/components/Icon";
export function NewPost() {
  const [open, setOpen] = useState(false),
    [title, setTitle] = useState(""),
    [style, setStyle] = useState("default"),
    [slug, setSlug] = useState(""),
    [date, setDate] = useState(() => new Date().toLocaleDateString("en-CA")),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    dialog.current?.querySelector<HTMLInputElement>("input")?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) setOpen(false);
      if (event.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          "input, select, button:not(:disabled)",
        );
        if (!nodes?.length) return;
        if (event.shiftKey && document.activeElement === nodes[0]) {
          event.preventDefault();
          nodes[nodes.length - 1].focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === nodes[nodes.length - 1]
        ) {
          event.preventDefault();
          nodes[0].focus();
        }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [open, busy]);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, id: slug, date, style }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      // A full navigation includes the regenerated component registry after development recompilation.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- New source must reload the generated registry.
      window.location.href = `/posts/${result.key}`;
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }
  return (
    <>
      <button className="primary" onClick={() => setOpen(true)}>
        <Icon name="plus" size={15} />
        New idea
      </button>
      {open && (
        <div className="modalBackdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-title"
            ref={dialog}
          >
            <h2 id="new-title">Make room for an idea.</h2>
            <p>
              Create a repository folder with editable copy and three layouts
              from the selected Content Style. Then ask Codex to design your
              composition.
            </p>
            <form onSubmit={create}>
              <ContentStyleSelector value={style} onChange={setStyle} />
              <label>
                Post title
                <input
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "")
                        .slice(0, 100),
                    );
                  }}
                />
              </label>
              <label>
                Folder slug
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  maxLength={100}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </label>
              <label>
                Editorial date
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
              <div className="row spaced">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button className="primary" disabled={busy}>
                  {busy ? "Creating files…" : "Create idea"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
