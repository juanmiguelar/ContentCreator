import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";
const slides = {
  experiencia: { tag: "CONFIANZA · 01", title: "Tu experiencia necesita algo más\nque una lista de títulos.", body: "Ayuda a entender cómo la aplicas en el trabajo real.", note: "EXPERIENCIA APLICADA" },
  metodo: { tag: "CONFIANZA · 02", title: "Explica\ntu método.", body: "¿Cómo analizas un problema y defines los próximos pasos?", note: "ANALIZAR → DEFINIR → ACTUAR" },
  caso: { tag: "CONFIANZA · 03", title: "Documenta\nun caso real.", body: "Contexto, intervención y resultado verificable; siempre con autorización para compartirlo.", note: "CONTEXTO · INTERVENCIÓN · RESULTADO" },
  razonamiento: { tag: "CONFIANZA · 04", title: "Muestra\ntu razonamiento.", body: "Si no puedes publicar casos, usa un ejemplo ilustrativo e identifícalo como tal.", note: "EJEMPLO ILUSTRATIVO" },
} as const;
export default function Post({ format, slideId, metadata }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides.experiencia;
  const position = ["experiencia", "metodo", "caso", "razonamiento"].indexOf(slideId) + 1;
  return <article className={`${styles.base} ${styles[format]}`}><header><span>{slide.tag}</span><span>0{position || 1} / 04</span></header><main>{slideId === "experiencia" ? <EditableText as="h1" field="headline" value={metadata.copy.headline} /> : <h1>{slide.title}</h1>}<p>{slide.body}</p></main><div className={styles.sheet} aria-hidden="true"><span>01</span><i /><i /><i /></div><aside><strong>0{position || 1}</strong><span>{slide.note}</span></aside><footer>EVIDENCIA REAL <span>SEPTIEMBRE 2026</span></footer></article>;
}
