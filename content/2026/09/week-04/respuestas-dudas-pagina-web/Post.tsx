import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "dudas": {
    "heading": "3 dudas frecuentes sobre crear una página web",
    "body": "Empezar se vuelve más claro cuando las preguntas tienen respuesta.",
    "tag": "DUDAS · 01"
  },
  "contenido": {
    "heading": "¿Tengo que escribir todo el contenido? No. Podemos organizarlo contigo.",
    "body": "La información se trabaja de forma acompañada y ordenada.",
    "tag": "DUDAS · 02"
  },
  "fotos": {
    "heading": "¿Necesito tener fotos profesionales? Depende del proyecto; no hay que inventar recursos.",
    "body": "Definimos qué recursos hacen falta según el caso.",
    "tag": "DUDAS · 03"
  },
  "actualizar": {
    "heading": "¿Puedo actualizarla después? Sí, la estructura debe pensarse para crecer.",
    "body": "Una base ordenada puede acompañar los cambios del servicio.",
    "tag": "DUDAS · 04"
  },
  "empezar": {
    "heading": "¿Por dónde empiezo? Por aclarar qué debe lograr tu página.",
    "body": "Escríbeme y revisamos tu punto de partida.",
    "tag": "DUDAS · 05"
  }
} as const;
const cta = "Escríbeme y revisamos tu punto de partida.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["dudas"];
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
          <div className={styles.motif} data-content-motif="form" aria-hidden="true"><i /><i /><i /></div>
        </main>
      </section>
      <footer className={styles.footer}>30 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
