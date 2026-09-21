import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";
export default function Post({ format, metadata }: PostProps) {
  return <article className={`${styles.base} ${styles[format]}`}><header><span>PRESENCIA DIGITAL · GUÍA BREVE</span><span>01 / 01</span></header><main><EditableText as="h1" field="headline" value={metadata.copy.headline} /><p>Empieza por responder estas cuatro preguntas.</p></main><ol><li><b>01</b><span>¿A quién ayudas?</span></li><li><b>02</b><span>¿Qué problema resuelves?</span></li><li><b>03</b><span>¿Cómo trabajas?</span></li><li><b>04</b><span>¿Cómo pueden contactarte?</span></li></ol><footer>UNA PRIMERA VERSIÓN CLARA <span>SEPTIEMBRE 2026</span></footer></article>;
}
