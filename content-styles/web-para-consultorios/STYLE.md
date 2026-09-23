# WebParaConsultorios — Origami Care

Identidad extraída del repositorio local `webparaconsultorios`, 22 septiembre 2026.
Consultar `examples/SOURCE-AUDIT.md` para procedencia y decisiones de adaptación.

## Dirección visual

Serena, cálida, precisa y profesional. El espacio blanco representa una hoja;
los planos azules y un corazón de origami expresan cuidado y estructura.
Una publicación responde a una sola pregunta y termina con una acción clara.
El motivo nunca debe competir con el texto ni convertirse en patrón repetido.

## Color y tipografía

Fondo blanco, superficies azul muy claro, titulares azul profundo y acento azul
medio. Usar exclusivamente los tokens, incluidos los tonos adicionales blue100,
blue300, blue500, blue600 y blue800 para facetas. Son variaciones de un único
acento azul, no acentos de colores diferentes. Los colores semánticos del sitio
no se trasladan a decoración de publicaciones.

Inter variable para titulares y lectura; JetBrains Mono para etiquetas cortas,
mayúsculas y numeración. Las fuentes Latin y Latin Extended están incluidas
localmente con nombres WPC para no afectar al editor. Peso principal 650,
cuerpo 400, interlineado de título 1.05 y cuerpo 1.55. No usar Geist: aparece en
la guía original, pero la implementación real carga Inter.

En títulos usar `--content-color-ink` (#082f49); en lectura extensa se puede usar
`--content-color-bodyInk` (#102a43). Nunca usar azul claro para texto sobre blanco.
Para una diapositiva oscura, usar inverseCanvas e inverseInk juntos.

## Formas y recursos

Tarjetas de radio 24, borde fino y sombra suave `--content-shadow-card` cuando
aporte jerarquía. No acumular sombras ni aplicarlas al logo. Solo una faceta
principal por diapositiva; puede ocupar una esquina fuera de la zona de texto.
Usar los SVG registrados origami-heart y folded-plane: el corazón conserva
exactamente los seis planos del componente original. No rotarlo, deformarlo,
recolorearlo ni sustituirlo por un corazón genérico. Zona libre de medio símbolo
por lado; símbolo mínimo 24 px de origen, preferiblemente 64 px en el canvas.
Colocación en inicio de encabezado o pie, con wordmark tipográfico a su derecha.

Los gráficos de procesos, formularios, listas y contornos pueden explicar el
servicio. No introducir mascotas, ilustraciones médicas inventadas, texturas de
papel, gradientes o emojis. Fotografía real y capturas deben proporcionarse como
assets; no se encontraron fotografías de marca exportables en public/ del sitio.

## Adaptaciones de formato

- Portrait: jerarquía editorial vertical, título primero, explicación y una
  superficie de apoyo debajo; márgenes 64, título 88 y cuerpo 30.
- Square: composición lateral 1.15:0.85 inspirada en Hero; márgenes 64, título 70,
  cuerpo 30. Reducir texto antes de reducir legibilidad.
- Story: secuencia vertical con titular, plano de apoyo y CTA; margen lateral 80,
  seguridad superior/inferior 130, título 100 y cuerpo 34.

Estas medidas son adaptación editorial explícita a canvases de 1080 px; no son
medidas CSS copiadas de un viewport web. Mantener contenido, prioridad y orden de
slides; recomponer, nunca recortar una imagen terminada. Las plantillas aportan
geometría base, no insertan automáticamente logos, tarjetas o CTA: Post.tsx debe
componerlos consumiendo los tokens y assets del pack.

## Voz y revisión

Español cercano y concreto, sin jerga de marketing ni promesas de resultados
clínicos. Preferir “Muestra tus servicios” o “Facilita el contacto”. Un CTA por
slide de cierre. Dejar espacio suficiente; dividir ideas densas en varias slides.

Correcto: titular azul oscuro sobre blanco, etiqueta mono, una tarjeta celeste,
una esquina plegada y firma pequeña. Incorrecto: collage de corazones, párrafos
sobre diagonales, sombras apiladas, cada slide con distinta tipografía.

La validación automática verifica paleta, familias, reglas permitidas y formatos.
La densidad, el número de gestos, la sombra exacta, la seguridad del logo y el
contraste contextual requieren revisión de composición; no se infieren de CSS.

## Referencia aplicada: panel de beneficios

La comparación visual aportada por el usuario exige algo más que cambiar la
paleta: usar una superficie celeste amplia, borde azul fino, esquinas redondeadas,
un pliegue superior derecho, titulares Inter de peso 650 y filas con numeración
azul. La publicación `muestra-como-trabaja-tu-consultoria` implementa esta familia
de composición con firma original y adaptaciones propias por formato. Evitar la
hoja gris recortada y la franja negra de la composición neutral anterior.

La selección del pack debe guardarse en post.json; tenerlo registrado no cambia
las publicaciones que todavía seleccionan default. No considerar una extracción
visualmente validada hasta comprobar una publicación real con el pack aplicado.
