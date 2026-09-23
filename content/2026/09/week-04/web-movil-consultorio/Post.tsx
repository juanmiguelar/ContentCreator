import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "movil": {
    "heading": "¿Tu página funciona bien desde el celular?",
    "body": "Tu primera impresión también ocurre desde una pantalla pequeña.",
    "tag": "MÓVIL · 01"
  },
  "texto": {
    "heading": "El texto debe poder leerse sin esfuerzo",
    "body": "Tamaño, contraste y espacio hacen la lectura más cómoda.",
    "tag": "MÓVIL · 02"
  },
  "contacto": {
    "heading": "El contacto debe estar a pocos pasos",
    "body": "La persona debe saber cómo avanzar sin recorrer toda la página.",
    "tag": "MÓVIL · 03"
  },
  "importante": {
    "heading": "La información importante no debe quedar escondida",
    "body": "Prioriza lo esencial en la primera experiencia.",
    "tag": "MÓVIL · 04"
  }
} as const;
const cta = "Prueba tu página desde tu celular hoy.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["movil"];
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
          <div className={styles.motif} data-content-motif="outline" aria-hidden="true"><i /><i /><i /></div>
        </main>
      </section>
      <footer className={styles.footer}>29 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
