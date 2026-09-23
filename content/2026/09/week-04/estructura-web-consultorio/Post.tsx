import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "estructura": {
    "heading": "La estructura básica de una buena web para consultorios",
    "body": "Una guía flexible para ordenar lo esencial.",
    "tag": "ESTRUCTURA · 01"
  },
  "presentacion": {
    "heading": "1. Presentación clara",
    "body": "Qué haces y a quién ayudas, dicho con palabras directas.",
    "tag": "ESTRUCTURA · 02"
  },
  "especialidades": {
    "heading": "2. Servicios o especialidades",
    "body": "Organiza los servicios para que se entiendan sin esfuerzo.",
    "tag": "ESTRUCTURA · 03"
  },
  "practica": {
    "heading": "3. Información práctica",
    "body": "Ubicación, horarios y datos útiles para planificar.",
    "tag": "ESTRUCTURA · 04"
  },
  "contacto-visible": {
    "heading": "4. Contacto visible",
    "body": "Un siguiente paso claro para iniciar la conversación.",
    "tag": "ESTRUCTURA · 05"
  }
} as const;
const cta = "Solicita una estructura adaptada a tu consultorio.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["estructura"];
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
          <div className={styles.motif} data-content-motif="geometry" aria-hidden="true"><i /><i /><i /></div>
        </main>
      </section>
      <footer className={styles.footer}>27 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
