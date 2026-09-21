"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/" className="wordmark">
        <span className="brandMark">
          <Icon name="grid" size={19} />
        </span>
        <span>
          Content<span className="wordmarkLight">Studio</span>
        </span>
      </Link>
      <div className="workspace">
        <span className="workspaceAvatar">S</span>
        <div>
          <strong>Social workspace</strong>
          <small>Local repository</small>
        </div>
        <span className="localDot" />
      </div>
      <span className="navLabel">WORKSPACE</span>
      <nav>
        {[
          { href: "/", name: "Content library", icon: "grid" },
          { href: "/calendar", name: "Editorial calendar", icon: "calendar" },
          { href: "/assets", name: "Asset library", icon: "image" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              (
                item.href === "/"
                  ? pathname === "/" || pathname.startsWith("/posts/")
                  : pathname.startsWith(item.href)
              )
                ? "page"
                : undefined
            }
          >
            <Icon name={item.icon} />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="sidebarNote">
        <Icon name="code" />
        <strong>
          Made in code.
          <br />
          Kept in Git.
        </strong>
        <p>Your content, captions and assets live right here.</p>
        <code>content/</code>
      </div>
      <div className="sidebarFooter">
        <span className="localDot" /> Local-first studio <span>v0.1</span>
      </div>
    </aside>
  );
}
