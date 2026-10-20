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
