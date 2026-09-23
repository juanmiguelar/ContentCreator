import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "treinta-segundos": {
    "heading": "¿Qué debe encontrar un paciente en 30 segundos?",
    "body": "La primera lectura debe orientar, no exigir que la persona investigue.",
    "tag": "LISTA · 01"
  },
  "que-haces": {
    "heading": "Qué haces",
    "body": "Una frase sencilla sobre el servicio principal.",
    "tag": "LISTA · 02"
  },
  "para-quien": {
    "heading": "Para quién es tu servicio",
    "body": "Ayuda a identificar si la persona llegó al lugar indicado.",
    "tag": "LISTA · 03"
  },
  "donde-cuando": {
    "heading": "Dónde y cuándo atiendes",
    "body": "La información práctica evita búsquedas adicionales.",
    "tag": "LISTA · 04"
  },
  "como-contactar": {
    "heading": "Cómo puede contactarte",
    "body": "Menos búsqueda. Más claridad.",
    "tag": "LISTA · 05"
  }
} as const;
const cta = "Guarda esta lista para revisar tu página.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["treinta-segundos"];
  const position = orderedSlides(metadata.slides).findIndex((item) => item.id === slideId) + 1;
  return (
    <article className={`${styles.base} ${styles[format]}`}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <StyleAsset styleId={contentStyle.id} assetId="origami-heart" placement="header-start" className={styles.logo} />
          <span>WebPara<br />Consultorios</span>
        </div>
        <span className={styles.count}>0{position || 1} / 0{metadata.slides.length}</span>
      </header>
      <section className={styles.panel}>
        
        <span className={styles.tag}>{slide.tag}</span>
        <main className={styles.content}>
          {position === 1 ? <EditableText as="h1" field="headline" value={metadata.copy.headline} /> : <h1>{slide.heading}</h1>}
          <p>{slide.body}</p>
          <div className={styles.motif} data-content-motif="checklist" aria-hidden="true"><i /><i /><i /></div>
        </main>
      </section>
      <footer className={styles.footer}>27 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
