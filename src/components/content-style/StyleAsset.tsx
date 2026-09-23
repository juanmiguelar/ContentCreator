import {
  contentStyleAssetUrl,
  getContentStyle,
} from "../../../content-styles/loader";
import type { ContentStyleRules } from "../../../content-styles/schema";
export function StyleAsset({
  styleId,
  assetId,
  placement,
  className,
}: {
  styleId: string;
  assetId: string;
  placement?: ContentStyleRules["logoPlacement"][number];
  className?: string;
}) {
  const style = getContentStyle(styleId),
    asset = style.assets[assetId];
  if (!asset) throw new Error(`Unknown style asset: ${assetId}`);
  if (
    asset.role === "logo" &&
    (!placement || !style.rules.logoPlacement.includes(placement))
  )
    throw new Error(`Content Style ${styleId}: logo placement is not allowed`);
  return (
    <img
      className={className}
      data-style-asset={assetId}
      data-logo-placement={asset.role === "logo" ? placement : undefined}
      src={contentStyleAssetUrl(styleId, assetId)}
      alt={asset.alt}
      style={{ objectFit: style.tokens.layout.imageTreatment }}
    />
  );
}
