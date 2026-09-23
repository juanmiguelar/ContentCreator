import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "errores": {
    "heading": "5 errores comunes en páginas de profesionales",
    "body": "Revisar con calma también es una forma de mejorar la experiencia.",
    "tag": "REVISIÓN · 01"
  },
  "empresa": {
    "heading": "Hablar demasiado de la empresa y poco del cliente",
    "body": "Empieza por explicar cómo puede ayudar tu servicio.",
    "tag": "REVISIÓN · 02"
  },
  "explicar": {
    "heading": "No explicar claramente los servicios",
    "body": "Los nombres y alcances deben ser fáciles de encontrar.",
    "tag": "REVISIÓN · 03"
  },
  "boton": {
    "heading": "Esconder el botón de contacto",
    "body": "El siguiente paso no debería estar escondido.",
    "tag": "REVISIÓN · 04"
  },
  "movil": {
    "heading": "No revisar la experiencia desde el celular",
    "body": "Una web profesional también debe ser fácil de usar.",
    "tag": "REVISIÓN · 05"
  }
} as const;
const cta = "¿Cuál de estos errores encuentras en tu página?";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["errores"];
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
        <StyleAsset styleId={contentStyle.id} assetId="folded-plane" className={styles.fold} />
        <span className={styles.tag}>{slide.tag}</span>
        <main className={styles.content}>
          {position === 1 ? <EditableText as="h1" field="headline" value={metadata.copy.headline} /> : <h1>{slide.heading}</h1>}
          <p>{slide.body}</p>
          <div className={styles.motif} data-content-motif="paper-fold" aria-hidden="true"><i /><i /><i /></div>
        </main>
      </section>
      <footer className={styles.footer}>28 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
