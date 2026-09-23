import type { ContentStyle } from "../schema";
import { tokens } from "./tokens";
import { rules } from "./rules";
import portrait from "./templates/portrait";
import square from "./templates/square";
import story from "./templates/story";
export default {
  id: "web-para-consultorios",
  name: "WebParaConsultorios · Origami Care",
  description:
    "Azules serenos, Inter, etiquetas monoespaciadas y planos de origami.",
  tokens,
  rules,
  templates: { portrait, square, story },
  assets: {
    "origami-heart": { source: "assets/origami-heart.svg", alt: "Corazón de origami de WebParaConsultorios", role: "logo" },
    "folded-plane": { source: "assets/folded-plane.svg", alt: "Plano azul plegado", role: "motif" },
  },
} satisfies ContentStyle;
