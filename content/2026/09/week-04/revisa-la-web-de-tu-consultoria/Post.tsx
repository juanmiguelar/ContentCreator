import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";
const slides = {
  revision: { tag: "REVISIÓN · 01", title: "¿Tu web explica bien\ntu consultoría?", body: "Cierra setiembre con estas cinco preguntas.", note: "REVISIÓN DE PRESENCIA WEB" },
  claridad: { tag: "REVISIÓN · 02", title: "Claridad.", body: "¿Se entiende a quién ayudas? ¿Explicas qué problema resuelves?", note: "A QUIÉN AYUDAS · QUÉ RESUELVES" },
  confianza: { tag: "REVISIÓN · 03", title: "Confianza.", body: "¿Muestras cómo trabajas? ¿Respaldas tu experiencia con información real?", note: "MÉTODO · EVIDENCIA REAL" },
  contacto: { tag: "REVISIÓN · 04", title: "Contacto.", body: "¿Es fácil dar el siguiente paso? Elige una mejora concreta para octubre.", note: "UNA MEJORA PARA OCTUBRE" },
} as const;
export default function Post({ format, slideId, metadata }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides.revision;
  const position = ["revision", "claridad", "confianza", "contacto"].indexOf(slideId) + 1;
  return <article className={`${styles.base} ${styles[format]}`}><header><span>{slide.tag}</span><span>0{position || 1} / 04</span></header><main>{slideId === "revision" ? <EditableText as="h1" field="headline" value={metadata.copy.headline} /> : <h1>{slide.title}</h1>}<p>{slide.body}</p></main><div className={styles.checks} aria-hidden="true"><i /><i /><i /></div><aside><strong>0{position || 1}</strong><span>{slide.note}</span></aside><footer>CIERRE DE SETIEMBRE <span>2026</span></footer></article>;
}
