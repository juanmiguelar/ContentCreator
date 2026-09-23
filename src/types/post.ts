import type { PostMetadata } from "@/schemas/post";
import type { SocialFormat } from "@/lib/content/formats";
import type {
  ContentStyle,
  ContentTemplate,
} from "../../content-styles/schema";
export type PostProps = {
  contentStyle: ContentStyle;
  template: ContentTemplate;
  format: SocialFormat;
  slideId: string;
  metadata: PostMetadata;
  postKey: string;
};
export type PostRecord = {
  key: string;
  metadata: PostMetadata;
  caption: string;
  revision: string;
  warnings: string[];
  missingAssets: string[];
};
export type AssetRecord = { path: string; name: string; category: string };
