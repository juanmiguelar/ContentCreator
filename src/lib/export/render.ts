import { toJpeg, toPng } from "html-to-image";
import JSZip from "jszip";
import { exportFilename } from "./names";
import { SOCIAL_FORMATS, type SocialFormat } from "../content/formats";
export async function renderCanvas(
  node: HTMLElement,
  format: SocialFormat,
  type: "jpg" | "png",
) {
  await document.fonts.ready;
  await Promise.all(
    Array.from(node.querySelectorAll("img")).map(async (image) => {
      await image.decode();
      if (!image.naturalWidth)
        throw new Error("An image did not load. Replace it before exporting.");
    }),
  );
  const { width, height } = SOCIAL_FORMATS[format];
  const options = {
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    pixelRatio: 1,
    quality: 0.95,
    backgroundColor: type === "jpg" ? "#ffffff" : undefined,
    skipAutoScale: true,
    cacheBust: true,
  };
  return (type === "jpg" ? toJpeg : toPng)(node, options);
}
function download(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
export async function exportSlides(
  nodes: HTMLElement[],
  id: string,
  format: SocialFormat,
  type: "jpg" | "png",
  startIndex = 1,
) {
  if (!nodes.length) throw new Error("No slides to export");
  if (nodes.length === 1) {
    download(
      await renderCanvas(nodes[0], format, type),
      exportFilename(id, format, startIndex, type),
    );
    return;
  }
  const zip = new JSZip();
  for (let i = 0; i < nodes.length; i++) {
    const data = await renderCanvas(nodes[i], format, type);
    zip.file(
      exportFilename(id, format, startIndex + i, type),
      data.split(",")[1],
      { base64: true },
    );
  }
  const url = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
  download(url, `${id}-${format}.zip`);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
