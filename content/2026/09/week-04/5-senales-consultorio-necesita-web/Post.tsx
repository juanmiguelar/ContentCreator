import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "senales": {
    "heading": "5 señales de que tu consultorio necesita una página web",
    "body": "Una web clara responde preguntas y facilita el siguiente paso.",
    "tag": "SEÑALES · 01"
  },
  "preguntas": {
    "heading": "Tus pacientes siempre preguntan lo mismo",
    "body": "Cuando la información está dispersa, cada consulta empieza desde cero.",
    "tag": "PREGUNTAS · 02"
  },
  "datos": {
    "heading": "No encuentran tus horarios, ubicación o servicios",
    "body": "Lo esencial debe estar a mano antes del primer mensaje.",
    "tag": "INFORMACIÓN · 03"
  },
  "redes": {
    "heading": "Tu perfil de redes sociales no explica todo",
    "body": "Las redes acompañan; una página reúne el contexto completo.",
    "tag": "CONTEXTO · 04"
  },
  "confianza": {
    "heading": "Quieres transmitir más confianza antes de la primera cita",
    "body": "Una presentación ordenada ayuda a llegar con menos dudas.",
    "tag": "CONFIANZA · 05"
  }
} as const;
const cta = "Escribe para revisar tu caso.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["senales"];
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
          <div className={styles.motif} data-content-motif="checklist" aria-hidden="true"><i /><i /><i /></div>
        </main>
      </section>
      <footer className={styles.footer}>24 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
