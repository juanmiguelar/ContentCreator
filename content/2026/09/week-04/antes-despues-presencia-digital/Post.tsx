import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "diferencia": {
    "heading": "La diferencia no siempre está en trabajar más. A veces está en comunicar mejor.",
    "body": "La presentación también forma parte de la experiencia.",
    "tag": "COMPARACIÓN · 01"
  },
  "antes": {
    "heading": "Antes: información dispersa, servicios poco claros y contacto difícil",
    "body": "Cuando cada dato está en un lugar distinto, avanzar cuesta más.",
    "tag": "ANTES · 02"
  },
  "despues": {
    "heading": "Después: estructura clara, información útil y un siguiente paso visible",
    "body": "Se trata de comunicación y experiencia, no de promesas automáticas.",
    "tag": "DESPUÉS · 03"
  }
} as const;
const cta = "Ordenemos la forma en que presentas tu negocio.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["diferencia"];
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
      <footer className={styles.footer}>25 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
