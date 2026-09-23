import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "reto": {
    "heading": "Queremos conocer tu principal reto digital",
    "body": "Elige la opción que más se parece a tu situación actual.",
    "tag": "ENCUESTA · 01"
  },
  "sin-web": {
    "heading": "¿No tienes página web?",
    "body": "Responde: nueva.",
    "tag": "ENCUESTA · 02"
  },
  "actualizada": {
    "heading": "¿Tu página está desactualizada?",
    "body": "Responde: actualizar.",
    "tag": "ENCUESTA · 03"
  },
  "informacion": {
    "heading": "¿No sabes qué información incluir?",
    "body": "Responde: estructura.",
    "tag": "ENCUESTA · 04"
  }
} as const;
const cta = "Responde la encuesta o escríbeme tu situación.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["reto"];
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
