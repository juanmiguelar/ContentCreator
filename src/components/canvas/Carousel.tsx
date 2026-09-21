"use client";
export function Carousel({
  slides,
  active,
  onChange,
}: {
  slides: { id: string; label: string }[];
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Carousel slides"
      style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
    >
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          aria-label={`Slide ${i + 1}: ${slide.label}`}
          aria-pressed={active === i}
          className={active === i ? "slideButton selected" : "slideButton"}
          onClick={() => onChange(i)}
        >
          {String(i + 1).padStart(2, "0")}
        </button>
      ))}
    </nav>
  );
}
