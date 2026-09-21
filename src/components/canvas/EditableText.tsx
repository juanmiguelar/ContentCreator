import type { ElementType } from "react";
export function EditableText({
  field,
  value,
  as: Tag = "span",
  className,
}: {
  field: string;
  value: string;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag data-editable-field={field} className={className}>
      {value}
    </Tag>
  );
}
