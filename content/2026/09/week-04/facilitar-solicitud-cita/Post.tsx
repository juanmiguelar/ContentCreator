import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "cita": {
    "heading": "Solicitar una cita no debería sentirse complicado",
    "body": "Una ruta clara da a la persona una forma sencilla de avanzar.",
    "tag": "FLUJO · 01"
  },
  "pasos": {
    "heading": "Información clara + contacto visible + instrucciones sencillas",
    "body": "Tres piezas que pueden trabajar juntas en una misma página.",
    "tag": "FLUJO · 02"
  },
  "avanzar": {
    "heading": "Cada paso debe ayudar a la persona a avanzar",
    "body": "Una mejor experiencia facilita saber qué hacer; no promete más citas automáticamente.",
    "tag": "FLUJO · 03"
  }
} as const;
const cta = "Diseñemos una ruta de contacto más clara.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["cita"];
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
      <footer className={styles.footer}>29 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
