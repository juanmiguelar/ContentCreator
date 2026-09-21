import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";

const slides = {
  recomendacion: { tag: "PRESENCIA DIGITAL · 01", title: "Te recomendaron.\n¿Qué encuentra tu próximo cliente?", body: "Una referencia puede abrir la conversación. Tu web puede darle un lugar claro para continuar.", note: "RECOMENDACIÓN → BÚSQUEDA" },
  contexto: { tag: "PRESENCIA DIGITAL · 02", title: "Dale contexto\na esa recomendación.", body: "Explica qué problema resuelves y con qué tipo de negocio trabajas.", note: "ESPECIALIDAD · SERVICIOS" },
  proceso: { tag: "PRESENCIA DIGITAL · 03", title: "Ayúdale a entender\ncómo trabajas.", body: "Presenta tu proceso y evidencia real de tu experiencia.", note: "PROCESO · EXPERIENCIA" },
  contacto: { tag: "PRESENCIA DIGITAL · 04", title: "Haz visible\nel siguiente paso.", body: "Quien tiene interés debería saber dónde consultar si tu servicio encaja.", note: "CONTACTO CLARO" },
} as const;
export default function Post({ format, slideId, metadata }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides.recomendacion;
  return <article className={`${styles.base} ${styles[format]}`}>
    <header><span>{slide.tag}</span><span>{slideId === "recomendacion" ? "01" : slideId === "contexto" ? "02" : slideId === "proceso" ? "03" : "04"} / 04</span></header>
    <div className={styles.fold} aria-hidden="true" />
    <main>
      {slideId === "recomendacion" ? <EditableText as="h1" field="headline" value={metadata.copy.headline} /> : <h1>{slide.title}</h1>}
      <p>{slide.body}</p>
    </main>
    <aside><span className={styles.number}>{slideId === "recomendacion" ? "01" : slideId === "contexto" ? "02" : slideId === "proceso" ? "03" : "04"}</span><span>{slide.note}</span></aside>
    <footer>WEB PARA CONSULTORÍA <span>SEPTIEMBRE 2026</span></footer>
  </article>;
}
