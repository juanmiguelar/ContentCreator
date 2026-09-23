import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { StyleAsset } from "@/components/content-style/StyleAsset";
import { orderedSlides } from "@/lib/content/formats";
import styles from "./post.module.css";
const slides = {
  experiencia: {
    tag: "CONFIANZA · 01",
    title: "Tu experiencia necesita algo más\nque una lista de títulos.",
    body: "Ayuda a entender cómo la aplicas en el trabajo real.",
    note: "EXPERIENCIA APLICADA",
  },
  metodo: {
    tag: "CONFIANZA · 02",
    title: "Explica\ntu método.",
    body: "¿Cómo analizas un problema y defines los próximos pasos?",
    note: "ANALIZAR → DEFINIR → ACTUAR",
  },
  caso: {
    tag: "CONFIANZA · 03",
    title: "Documenta\nun caso real.",
    body: "Contexto, intervención y resultado verificable; siempre con autorización para compartirlo.",
    note: "CONTEXTO · INTERVENCIÓN · RESULTADO",
  },
  razonamiento: {
    tag: "CONFIANZA · 04",
    title: "Muestra\ntu razonamiento.",
    body: "Si no puedes publicar casos, usa un ejemplo ilustrativo e identifícalo como tal.",
    note: "EJEMPLO ILUSTRATIVO",
  },
} as const;
export default function Post({
  format,
  slideId,
  metadata,
  contentStyle,
}: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides.experiencia;
  const position =
    orderedSlides(metadata.slides).findIndex((slide) => slide.id === slideId) +
    1;
  return (
    <article className={`${styles.base} ${styles[format]}`}>
      <header className={styles.brand}>
        {contentStyle.assets["origami-heart"] && (
          <div className={styles.signature}>
            <StyleAsset
              styleId={contentStyle.id}
              assetId="origami-heart"
              placement="header-start"
              className={styles.logo}
            />
            <span>
              WebPara
              <br />
              Consultorios
            </span>
          </div>
        )}
        <span className={styles.pagination}>
          0{position || 1} / 0{metadata.slides.length}
        </span>
      </header>
      <section className={styles.panel}>
        {contentStyle.assets["folded-plane"] && (
          <StyleAsset
            styleId={contentStyle.id}
            assetId="folded-plane"
            className={styles.fold}
          />
        )}
        <div className={styles.eyebrow}>{slide.tag}</div>
        <main>
          {slideId === "experiencia" ? (
            <EditableText
              as="h1"
              field="headline"
              value={metadata.copy.headline}
            />
          ) : (
            <h1>{slide.title}</h1>
          )}
          <p>{slide.body}</p>
        </main>
        <aside>
          <strong>0{position || 1}</strong>
          <span>{slide.note}</span>
        </aside>
      </section>
      <footer>
        EVIDENCIA REAL <span>SEPTIEMBRE 2026</span>
      </footer>
    </article>
  );
}
