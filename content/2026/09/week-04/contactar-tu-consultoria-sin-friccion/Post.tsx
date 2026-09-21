import type { PostProps } from "@/types/post";
import { EditableText } from "@/components/canvas/EditableText";
import styles from "./post.module.css";
const slides = {
  impresion: { tag: "CONTACTO · 01", title: "Tu formulario también es parte\nde la primera impresión.", body: "Revisa qué ocurre después de despertar interés.", note: "INTERÉS → CONTACTO" },
  accion: { tag: "CONTACTO · 02", title: "Usa una acción\ncomprensible.", body: "«Consultar sobre el servicio» explica mejor el destino que «Haz clic aquí».", note: "LENGUAJE CLARO" },
  necesario: { tag: "CONTACTO · 03", title: "Pide solo\nlo necesario.", body: "Nombre, medio de contacto y una breve descripción pueden ser un punto de partida.", note: "MENOS FRICCIÓN" },
  prueba: { tag: "CONTACTO · 04", title: "Prueba el recorrido\ncompleto.", body: "Desde el celular: encontrar el contacto, enviar y recibir confirmación.", note: "PROBAR DESDE EL CELULAR" },
} as const;
export default function Post({ format, slideId, metadata }: PostProps) {
  const slide = slides[slideId as keyof typeof slides] ?? slides.impresion;
  const position = ["impresion", "accion", "necesario", "prueba"].indexOf(slideId) + 1;
  return <article className={`${styles.base} ${styles[format]}`}><header><span>{slide.tag}</span><span>0{position || 1} / 04</span></header><main>{slideId === "impresion" ? <EditableText as="h1" field="headline" value={metadata.copy.headline} /> : <h1>{slide.title}</h1>}<p>{slide.body}</p></main><div className={styles.form} aria-hidden="true"><i /><i /><button>CONSULTAR SOBRE EL SERVICIO</button></div><aside><strong>0{position || 1}</strong><span>{slide.note}</span></aside><footer>CONTACTO CLARO <span>SEPTIEMBRE 2026</span></footer></article>;
}
