# Auditoría y trazabilidad

Fuente local (solo lectura):
`/Users/juanmiguelariasmejias/Documents/github/juanmiguelar/webparaconsultorios`.
Fecha de extracción: 2026-09-22. Se analizó código y guía de diseño; no se afirma
haber auditado una versión desplegada. Las páginas demo de dental y psicología
son marcas de muestra y no son fuente de la identidad WebParaConsultorios.

| Fuente relativa al repositorio original | Evidencia extraída |
| --- | --- |
| DESIGN.md | Origami Care, personalidad, seguridad de logo, una intención, un pliegue, reglas de contraste y fotografía |
| src/app/globals.css | Paleta exacta, radios 8/16/24/32, tipografía 650/400, leading 1.05/1.55, base 4 px |
| src/app/(marketing)/layout.tsx | Inter y JetBrains Mono reales, subconjunto latin |
| src/components/sections/Hero.tsx | Rejilla 1.15:0.85, izquierda editorial/derecha tarjeta, ceja mono, faceta superior, sombra 0 12 32 a 8% |
| src/components/sections/Process.tsx | Secuencia 01–04, líneas finas, fondo azul profundo, números claros |
| src/components/sections/FinalCTA.tsx | Cierre breve centrado y una acción principal |
| src/components/ui/OrigamiHeartLogo.tsx | Seis paths copiados sin modificar geometría ni colores |
| src/components/ui/FoldedPlane.tsx | Dos triángulos #e0f2fe / #bae6fd al 70%; conversión equivalente a SVG |
| src/components/ui/Button.tsx | Radios medios, azul de acción, sombra suave; no se trasladan hover ni interacción a imágenes |

## Resoluciones explícitas

- La guía menciona Geist; el código usa Inter. Se conserva Inter.
- Titulares del sitio usan ink-950, cuerpo usa ink-900/ink-700. El token ink del
  pack representa el titular (#082f49); bodyInk conserva #102a43 como alternativa.
- Fuente de color autorizada: implementación actual. Se preservan tonos de
  facetas como colores adicionales registrados, todos en la misma familia azul.
- Radios del sitio varían por función; el contrato actual tiene un radio de
  tarjeta. Se elige 24 (guía: contenedor principal). No se finge copiar todos los
  componentes interactivos ni sus estados.
- La sombra del Hero usa 8%; la guía permite 10%. El token usa el valor del Hero.
- Tamaños web: display 64/76, cuerpo 16/20, ceja 13. Los tamaños 88/70/100 y
  30/34 son adaptación explícita para legibilidad social, no valores originales.
- Márgenes sociales y safe areas se definen en templates; no vienen del sitio.
- Los archivos WOFF2 Latin/Latin Extended se reutilizaron del build local .next,
  identificados por sus declaraciones @font-face. Se mantienen como recursos
  compartidos en public/assets/fonts/web-para-consultorios; fonts.css registra
  alias WPC. El pack funciona sin descargar fuentes en tiempo de ejecución.
- Sin fotografías locales de marca ni ejemplos de posts canónicos encontrados.
  Esta carpeta conserva referencias documentales; no presenta diseños nuevos
  como si fueran material de marca preexistente.

## Uso

Seleccionar “WebParaConsultorios · Origami Care” en Content Style y guardar,
o escribir `"style": "web-para-consultorios"` en post.json. Las publicaciones
existentes conservan su selección actual. Cambiar el pack cambia tokens y
plantillas; un post que necesite un nuevo motivo debe componerlo explícitamente.
