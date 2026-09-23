import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { ContentStyleMark } from "@/components/content-style/ContentStyleMark";
import styles from "./post.module.css";

const slides = {
  encontrarte: {
    index: "01",
    eyebrow: "POSICIONAMIENTO WEB",
    title: "Que te encuentren\nes el comienzo.",
    body: "Tu web necesita explicar con claridad qué problema resuelves y para quién.",
    note: "CLARIDAD ANTES QUE RUIDO",
  },
  intencion: {
    index: "02",
    eyebrow: "LA INTENCIÓN",
    title: "Habla como\nbusca tu cliente.",
    body: "Las palabras de tu página deberían acercarse a las preguntas reales de las personas que quieres ayudar.",
    note: "PREGUNTA → PÁGINA",
  },
  respuestas: {
    index: "03",
    eyebrow: "RESPUESTAS ÚTILES",
    title: "Una página\npuede responder.",
    body: "Explica una necesidad concreta, ordena la información y facilita el siguiente paso.",
    note: "NECESIDAD · RESPUESTA · ACCIÓN",
  },
  "primer-paso": {
    index: "04",
    eyebrow: "PARA EMPEZAR",
    title: "Revisa una página\nesta semana.",
    body: "¿Se entiende qué resuelves? ¿Usa palabras familiares? ¿Responde antes de pedir contacto?",
    note: "UNA MEJORA CONCRETA",
  },
} as const;

export default function Post({
  format,
  slideId,
  metadata,
  contentStyle,
}: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides.encontrarte;
  return (
    <article className={`${styles.base} ${styles[format]}`}>
      <header>
        <ContentStyleMark style={contentStyle} />
        <span>{slide.eyebrow}</span>
        <span>{slide.index} / 04</span>
      </header>
      <div
        data-content-motif="geometry"
        className={styles.diagram}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
      <main>
        {slideId === "encontrarte" ? (
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
        <strong>{slide.index}</strong>
        <span>{slide.note}</span>
      </aside>
      <footer>
        <span>WEB PARA CONSULTORÍA</span>
        <span>SETIEMBRE 2026</span>
      </footer>
    </article>
  );
}
