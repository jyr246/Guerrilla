# Guerrilla · La Grieta del Mundo

RTS móvil de fantasía (estilo Age of Empires 2). Versión de prueba: 1 jugador, modo **Guerrilla**, 9 civilizaciones.
HTML5 + Canvas, sin dependencias.

## Jugar
- Abre `index.html` o ejecuta `python3 -m http.server` y entra en http://localhost:8000
- **GitHub Pages**: sube la carpeta a un repositorio → Settings → Pages → rama `main`, carpeta `/ (root)`.

## Controles (táctil y ratón)
- Un dedo arrastra: mover cámara · dos dedos / rueda: zoom
- Toca una unidad o edificio propio para seleccionarlo; toca el suelo para mover, un recurso para recolectar (aldeanos) o un enemigo para atacar
- Botones inferiores: entrenar, construir (aldeano seleccionado), ⚔ Ejército, 👷 Libres

## Modo Guerrilla
Recursos: 🪵 madera, 🍖 comida, 🪙 oro, 🪨 piedra. Gana quien destruya el centro urbano rival o mantenga tropas en la grieta central 60 s sin enemigos dentro.

## Novedades de la versión de prueba
- **Arte procedural** (sin imágenes externas): sprites propios por civilización (colmillos orcos, orejas élficas, barba enana, capuchas, sombreros de mago...), edificios, recursos y terreno con lagunas y suelo agrietado.
- **Mapas estilo Age of Empires 2:** Arabia, Bosque Negro y Tierras Doradas, con bosquecillos, lagunas (las unidades las rodean), minas y arbustos junto a cada base.
- **Interfaz estilo AoE2:** barra de recursos arriba, minimapa a la izquierda, panel de información con retrato y panel de órdenes con costes; botones rápidos para aldeanos libres, ejército y chamanes.
- **Introducción narrada** de 5 escenas (se puede saltar y volver a ver desde el menú).
- **Música generativa** por civilización, viento y pájaros, tambores y choques de espadas cuando hay combate. Botón 🔊/🔇.
- **Tiempo de construcción** con aldeanos, 3 eras, niebla de guerra, 3 dificultades, unidad única por civilización.
- **Mini grietas (reliquias):** solo los chamanes (Templo 🔮) las recogen; cada una en tu poder da +5% de ataque y recolección. Los chamanes curan tropas heridas.
- **App instalable (PWA)** con iconos y funcionamiento sin conexión.

## Archivos
`index.html`, `style.css`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` y la carpeta `js/` (`data.js`, `art.js`, `audio.js`, `intro.js`, `game.js`).

## Siguiente
Guardado de partida, más mapas y modos, arte pintado a mano o con IA y empaquetado a APK/iOS con Capacitor.
