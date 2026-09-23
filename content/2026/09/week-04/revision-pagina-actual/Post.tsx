import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "actual": {
    "heading": "Tu página actual puede estar funcionando… o simplemente estar publicada",
    "body": "Publicar es el inicio; revisar cómo se entiende es el siguiente paso.",
    "tag": "REVISIÓN · 01"
  },
  "revisemos": {
    "heading": "Revisemos si se entiende, si se ve bien en celular y si facilita el contacto",
    "body": "Una lectura práctica permite encontrar oportunidades de mejora.",
    "tag": "REVISIÓN · 02"
  },
  "ordenar": {
    "heading": "A veces no necesitas empezar de cero. Necesitas ordenar mejor.",
    "body": "La revisión puede orientar antes de decidir si hace falta rediseñar.",
    "tag": "REVISIÓN · 03"
  }
} as const;
const cta = "Envíame el enlace de tu página.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["actual"];
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
      <footer className={styles.footer}>28 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
