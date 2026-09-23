import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "duda": {
    "heading": "¿Qué piensa una persona cuando no encuentra información sobre tu negocio?",
    "body": "La confianza empieza antes del contacto.",
    "tag": "PREGUNTA · 01"
  },
  "servicio": {
    "heading": "¿Atienden este servicio?",
    "body": "Una página debe explicar con precisión qué puede esperar la persona.",
    "tag": "PREGUNTA · 02"
  },
  "ubicacion": {
    "heading": "¿Dónde están ubicados?",
    "body": "La información práctica evita pasos innecesarios.",
    "tag": "PREGUNTA · 03"
  },
  "cita": {
    "heading": "¿Cómo puedo solicitar una cita o consulta?",
    "body": "Cada pregunta sin respuesta puede convertirse en una oportunidad perdida.",
    "tag": "PREGUNTA · 04"
  }
} as const;
const cta = "Revisa si tu web responde lo esencial.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["duda"];
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
      <footer className={styles.footer}>25 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
