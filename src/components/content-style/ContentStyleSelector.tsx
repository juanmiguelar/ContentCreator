"use client";
import {
  getContentStyle,
  listContentStyles,
} from "../../../content-styles/loader";
export function ContentStyleSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const selected = getContentStyle(value);
  return (
    <div className="field">
      <label>
        Content Style
        <select
          aria-label="Content Style"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {listContentStyles().map((style) => (
            <option key={style.id} value={style.id}>
              {style.name} — {style.description}
            </option>
          ))}
        </select>
      </label>
      <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>
        {selected.description}
      </p>
    </div>
  );
}
