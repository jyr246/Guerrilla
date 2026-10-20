// Civilizaciones: gm = multiplicador de recolección, hp/atk/sp = multiplicadores de combate
const CIVS=[
 {n:'Orcos',c:'#4a8a2a',b:'+25% ataque',atk:1.25},
 {n:'Elfos',c:'#2fbf71',b:'+30% madera',gm:{w:1.3}},
 {n:'Enanos',c:'#c0762e',b:'+30% oro y piedra',gm:{g:1.3,s:1.3}},
 {n:'Pícaros',c:'#8a8a96',b:'+15% velocidad',sp:1.15},
 {n:'Altos elfos',c:'#e8d27a',b:'+20% vida',hp:1.2},
 {n:'Brujos',c:'#b04fd8',b:'+30% comida',gm:{f:1.3}},
 {n:'Magos',c:'#3f7fe0',b:'+15% ataque',atk:1.15},
 {n:'Nigromantes',c:'#5fd0a0',b:'+20% ataque, -10% vida',atk:1.2,hp:.9},
 {n:'Humanos',c:'#e6e6e6',b:'+10% recolección',gm:{w:1.1,f:1.1,g:1.1,s:1.1}}
];
const LORE='El mundo vivía en paz, hasta que se abrió una grieta en su centro. Quien la domine obtendrá un poder capaz de conquistarlo todo. Destruye el centro urbano enemigo o mantén la grieta con tus tropas durante 60 segundos.';
// Unidad única por civilización (mismo orden que CIVS); se entrena en el Cuartel desde la Era II
const UU=[
 {n:'Berserker',hp:130,atk:14,rng:16,sp:1.1,cost:{f:90,g:50}},
 {n:'Guardabosques',hp:60,atk:9,rng:140,sp:1.2,cost:{w:60,g:50}},
 {n:'Martillero',hp:160,atk:11,rng:16,sp:.9,cost:{f:90,g:70}},
 {n:'Asesino',hp:70,atk:16,rng:16,sp:1.9,cost:{f:70,g:60}},
 {n:'Paladín solar',hp:140,atk:12,rng:16,sp:1.4,cost:{f:100,g:80}},
 {n:'Hechicero',hp:55,atk:13,rng:120,sp:1,cost:{w:50,g:70}},
 {n:'Mago de batalla',hp:50,atk:18,rng:130,sp:1,cost:{w:60,g:90}},
 {n:'Caballero de la muerte',hp:110,atk:15,rng:16,sp:1.2,cost:{f:80,g:80}},
 {n:'Caballero real',hp:150,atk:13,rng:16,sp:1.6,cost:{f:100,g:90}}
];
// Mapas inspirados en Age of Empires 2: fo=bosquecillos, fs=árboles por bosquecillo, fp=dispersión, po=lagunas, gm=multiplicador de minas
const MAPS=[
 {n:'Arabia',d:'Llanuras abiertas, bosquecillos y lagunas',fo:30,fs:9,fp:120,po:3},
 {n:'Bosque Negro',d:'Bosques espesos y pasillos estrechos',fo:85,fs:16,fp:150,po:1},
 {n:'Tierras Doradas',d:'Mucho oro y piedra, pocos árboles',fo:16,fs:8,fp:100,po:2,gm:2}
];
// Introducción narrada
const SCN=[
 'Durante mil años, los pueblos del mundo vivieron en paz bajo un mismo cielo.',
 'Orcos, elfos, enanos, pícaros, altos elfos, brujos, magos, nigromantes y humanos compartían mercados, cosechas y festivales.',
 'Hasta que una noche la tierra se abrió. Una grieta de luz violeta rasgó el corazón del mundo.',
 'Dicen que quien llegue hasta ella recibirá un poder capaz de conquistar todas las tierras.',
 'La paz se rompió. Los estandartes se alzaron. Comienza la GUERRILLA.'
];
