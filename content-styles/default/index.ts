import type { ContentStyle } from "../schema";
import { tokens } from "./tokens";
import { rules } from "./rules";
import portrait from "./templates/portrait";
import square from "./templates/square";
import story from "./templates/story";
export default {
  id: "default",
  name: "Default · Neutral",
  description:
    "Neutral paper, clear typography and simple geometric diagrams. No brand identity implied.",
  tokens,
  rules,
  templates: { portrait, square, story },
  assets: {
    "format-outline": {
      source: "/assets/illustrations/format-outline.svg",
      alt: "Three social formats",
      role: "motif",
    },
  },
} satisfies ContentStyle;
