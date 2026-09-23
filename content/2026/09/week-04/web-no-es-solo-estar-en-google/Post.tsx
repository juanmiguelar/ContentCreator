import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "visibilidad": {
    "heading": "Una página web no es solo aparecer en Google",
    "body": "La visibilidad abre una puerta; la claridad ayuda a avanzar.",
    "tag": "01 · VISIBILIDAD"
  },
  "quien": {
    "heading": "También explica quién eres",
    "body": "Una presentación directa da contexto a tu experiencia y enfoque.",
    "tag": "02 · IDENTIDAD"
  },
  "servicios": {
    "heading": "Muestra qué servicios ofreces",
    "body": "Nombrar lo que haces reduce incertidumbre.",
    "tag": "03 · SERVICIOS"
  },
  "contacto": {
    "heading": "Y facilita que una persona decida contactarte",
    "body": "Visibilidad es el comienzo. Claridad es lo que ayuda a avanzar.",
    "tag": "04 · CONTACTO"
  }
} as const;
const cta = "Cuéntame qué debería comunicar tu web.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["visibilidad"];
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
      <footer className={styles.footer}>26 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
