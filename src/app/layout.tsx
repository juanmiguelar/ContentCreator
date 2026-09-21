import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";
export const metadata: Metadata = {
  title: "Content Studio",
  description: "Local social content workspace",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <Sidebar />
        <main id="main" className="main">
          <div className="topbar">
            <span>YOUR CREATIVE WORKSPACE</span>
            <span>
              <i className="localDot" /> Files on your machine
            </span>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
