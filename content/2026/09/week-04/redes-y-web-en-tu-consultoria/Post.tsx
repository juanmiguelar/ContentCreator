import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import { ContentStyleMark } from "@/components/content-style/ContentStyleMark";
import styles from "./post.module.css";
const slides = {
  conversacion: {
    tag: "PRESENCIA DIGITAL · 01",
    title: "Tu perfil abre la conversación.\nTu web puede darle contexto.",
    body: "No necesitan competir: cada espacio puede hacer una parte distinta del trabajo.",
    note: "CONVERSACIÓN + CONTEXTO",
  },
  redes: {
    tag: "PRESENCIA DIGITAL · 02",
    title: "En redes, comparte\ntu perspectiva.",
    body: "Ideas, preguntas y aprendizajes que permitan conocer tu manera de pensar.",
    note: "IDEAS · PREGUNTAS · APRENDIZAJES",
  },
  web: {
    tag: "PRESENCIA DIGITAL · 03",
    title: "En tu web, organiza\nlo esencial.",
    body: "Especialidad, servicios, proceso, experiencia y contacto en un recorrido claro.",
    note: "INFORMACIÓN ORDENADA",
  },
  conecta: {
    tag: "PRESENCIA DIGITAL · 04",
    title: "Conecta ambos\nespacios.",
    body: "Lleva a quien muestra interés a la información específica que necesita.",
    note: "DEL INTERÉS AL SIGUIENTE PASO",
  },
} as const;
export default function Post({
  format,
  slideId,
  metadata,
  contentStyle,
}: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides.conversacion;
  const position =
    ["conversacion", "redes", "web", "conecta"].indexOf(slideId) + 1;
  return (
    <article className={`${styles.base} ${styles[format]} ${styles[slideId]}`}>
      <header>
        <ContentStyleMark style={contentStyle} />
        <span>{slide.tag}</span>
        <span>0{position || 1} / 04</span>
      </header>
      <main>
        {slideId === "conversacion" ? (
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
      <div
        data-content-motif="geometry"
        className={styles.planes}
        aria-hidden="true"
      >
        <i />
        <i />
        <b />
      </div>
      <aside>
        <strong>0{position || 1}</strong>
        <span>{slide.note}</span>
      </aside>
      <footer>
        REDES ↔ WEB <span>SEPTIEMBRE 2026</span>
      </footer>
    </article>
  );
}
