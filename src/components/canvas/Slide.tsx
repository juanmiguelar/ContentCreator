import type { ReactNode } from "react";
export function Slide({ children, id }: { children: ReactNode; id: string }) {
  return (
    <div data-slide-id={id} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
}
