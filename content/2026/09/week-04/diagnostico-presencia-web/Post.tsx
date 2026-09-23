import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";

const slides = {
  "diagnostico": {
    "heading": "¿Tu presencia digital está ayudando a tu negocio?",
    "body": "Una revisión inicial ayuda a ver con claridad dónde enfocarse.",
    "tag": "REVISIÓN · 01"
  },
  "criterios": {
    "heading": "Revisemos claridad, servicios, contacto y experiencia móvil",
    "body": "Cuatro criterios prácticos para observar la presencia actual.",
    "tag": "REVISIÓN · 02"
  },
  "orientacion": {
    "heading": "Recibe una orientación inicial para saber qué mejorar",
    "body": "Sin prometer auditorías complejas ni resultados garantizados.",
    "tag": "REVISIÓN · 03"
  }
} as const;
const cta = "Escríbeme “REVISIÓN” por mensaje directo.";

export default function Post({ format, slideId, metadata, contentStyle }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides["diagnostico"];
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
      <footer className={styles.footer}>26 SEPTIEMBRE <span>{position === metadata.slides.length ? cta : "PÁGINAS WEB CLARAS"}</span></footer>
    </article>
  );
}
