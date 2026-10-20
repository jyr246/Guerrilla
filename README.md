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
- Tiempo de construcción (casa 4 s, cuartel 8 s), 3 eras (+15% vida y ataque por era; la era II desbloquea al Caballero)
- Niebla de guerra, minimapa (toca para mover la cámara), 3 dificultades de IA, botón ☰ Menú
- Mini grietas (reliquias): solo los **chamanes** (se entrenan en el Templo 🔮) pueden recogerlas y llevarlas a un Templo; cada una en tu poder da +5% de ataque y de recolección. Si matan al chamán o destruyen el Templo, vuelven al mapa. Además, cuando no llevan una grieta, los chamanes curan solos a las tropas militares heridas cercanas (~6 PV/s).
- **Aldeanos constructores:** los edificios solo se levantan si hay aldeanos trabajando en ellos (el aldeano seleccionado va solo; más aldeanos = más rápido).
- **Unidad única por civilización** (Cuartel, Era II): Berserker (orcos), Guardabosques (elfos), Martillero (enanos), Asesino (pícaros), Paladín solar (altos elfos), Hechicero (brujos), Mago de batalla (magos), Caballero de la muerte (nigromantes) y Caballero real (humanos).
- **Sonido:** efectos sintetizados (sin archivos de audio), con botón 🔊/🔇.

## Siguiente
Arte isométrico, guardado de partida y empaquetado a APK/iOS con Capacitor.
