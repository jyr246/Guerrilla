'use strict';
// Arte procedural: todos los sprites, terrenos y escenas se dibujan por código (sin imágenes externas)
const ART={c:{}};
const mkC=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));return c};
const shade=(hex,a)=>{const n=parseInt(hex.slice(1),16),f=v=>Math.max(0,Math.min(255,v+a));return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`};
const ell=(x,cx,cy,rx,ry,c)=>{x.fillStyle=c;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,7);x.fill()};
const poly=(x,p,c,s)=>{x.fillStyle=c;x.beginPath();p.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.closePath();x.fill();if(s){x.strokeStyle=s;x.lineWidth=1;x.stroke()}};
const ln=(x,a,b,c,d,col,w)=>{x.strokeStyle=col;x.lineWidth=w;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()};
const rnd=(a=1)=>Math.random()*a;
// Recursos
ART.n={
 w:mkC(44,52,x=>{ell(x,22,48,15,4.5,'rgba(0,0,0,.32)');x.fillStyle='#5a3b1e';x.fillRect(19,30,7,18);x.fillStyle='#46301a';x.fillRect(23,30,3,18);
  [[22,20,14,'#1d5a24'],[14,27,11,'#27692c'],[30,27,11,'#27692c'],[22,12,10,'#3a8a3a'],[26,16,6,'#4ea04a']].forEach(([a,b,r,c])=>ell(x,a,b,r,r*.92,c));ell(x,17,9,4.5,3,'rgba(255,255,255,.14)')}),
 f:mkC(30,26,x=>{ell(x,15,22,12,3.5,'rgba(0,0,0,.28)');ell(x,15,14,13,10,'#2a6f2c');ell(x,10,10,6,6,'#3a8a3a');ell(x,21,12,6,6,'#348034');[[8,10],[16,13],[12,18],[21,9],[23,16],[17,7]].forEach(([a,b])=>{ell(x,a,b,2.4,2.4,'#d6323f');ell(x,a-.7,b-.7,.8,.8,'#ffb0b0')})}),
 g:mkC(34,30,x=>{ell(x,17,26,14,3.5,'rgba(0,0,0,.32)');poly(x,[[3,26],[8,9],[17,3],[27,9],[31,26]],'#6d6a72','#3d3b42');poly(x,[[8,9],[17,3],[19,15],[10,17]],'#8f8c96');poly(x,[[19,15],[27,9],[31,26],[21,26]],'#59565f');[[12,20],[20,16],[24,23],[16,24]].forEach(([a,b])=>{ell(x,a,b,3.6,3,'#f2c41d');ell(x,a-1,b-1,1.2,1.2,'#fff6b0')})}),
 s:mkC(34,30,x=>{ell(x,17,26,14,3.5,'rgba(0,0,0,.32)');poly(x,[[2,26],[7,12],[16,6],[24,11],[32,26]],'#8e909c','#4a4c57');poly(x,[[7,12],[16,6],[18,16],[10,18]],'#b8bac7');poly(x,[[18,16],[24,11],[32,26],[20,26]],'#777986');ln(x,12,20,18,22,'#5d5f6b',1)})
};
// Edificios (por tipo y color de civilización)
ART.bld=(k,col,r)=>{const key=k+col,s=r*2+20;if(ART.c[key])return ART.c[key];
 return ART.c[key]=mkC(s,s,x=>{const m=10,w=r*2,dk=shade(col,-70),lt=shade(col,50),c=s/2;ell(x,c,s-8,w*.6,7,'rgba(0,0,0,.32)');
  if(k=='house'){x.fillStyle='#c4a574';x.fillRect(m+3,m+16,w-6,w-14);x.strokeStyle='#6b5330';x.strokeRect(m+3,m+16,w-6,w-14);poly(x,[[m-3,m+18],[c,m-3],[m+w+3,m+18]],col,dk);x.fillStyle='#4a321c';x.fillRect(c-4,s-24,8,13);ell(x,c+9,m+26,3,3,'#f6e27a')}
  if(k=='bar'){x.fillStyle='#8a5a2e';x.fillRect(m,m+20,w,w-12);for(let i=0;i<6;i++)ln(x,m+i*w/5,m+20,m+i*w/5,m+w+8,'#5b3a1c',1);poly(x,[[m-5,m+22],[m+10,m+3],[m+w-10,m+3],[m+w+5,m+22]],col,dk);ln(x,c-12,m+28,c+12,m+50,'#e6e9ef',3);ln(x,c+12,m+28,c-12,m+50,'#e6e9ef',3);x.fillStyle='#3b2410';x.fillRect(c-7,s-30,14,20)}
  if(k=='tc'){x.fillStyle='#a39d8c';x.fillRect(m+14,m+22,w-28,w-14);x.strokeStyle='#4a463e';x.strokeRect(m+14,m+22,w-28,w-14);for(let i=0;i<5;i++)x.fillRect(m+16+i*((w-36)/4),m+14,8,8);
   [m,m+w-26].forEach(a=>{x.fillStyle='#b8b2a0';x.fillRect(a,m+12,26,w-4);x.strokeRect(a,m+12,26,w-4);poly(x,[[a-3,m+14],[a+13,m-6],[a+29,m+14]],col,dk)});
   x.fillStyle='#4a2f17';x.fillRect(c-10,s-42,20,32);ln(x,c,m+22,c,m+2,'#ddd',2);poly(x,[[c,m+2],[c+20,m+8],[c,m+14]],lt)}
  if(k=='tem'){x.fillStyle='#cfcbd8';x.fillRect(m,s-26,w,12);[0,1,2,3].forEach(i=>{x.fillStyle='#e8e4f0';x.fillRect(m+4+i*(w-14)/3,m+30,8,w-40)});poly(x,[[m-2,m+32],[c,m+4],[m+w+2,m+32]],col,dk);ell(x,c,m+19,10,10,'rgba(200,120,255,.25)');ell(x,c,m+19,5.5,5.5,'#e0b0ff')}
 })};
// Unidades (por tipo y civilización): cada civilización tiene rasgos propios (colmillos, orejas, barba, capucha, sombrero...)
const SK=['#74a63e','#f0cfa8','#d9a066','#e0b48c','#f6dcc0','#cfa8d8','#f0cfa8','#c9d6c2','#e8b98a'];
function deco(x,ci,hx,hy){
 if(ci==0){poly(x,[[hx-3,hy+3],[hx-2,hy+7],[hx-1,hy+3]],'#fff');poly(x,[[hx+1,hy+3],[hx+2,hy+7],[hx+3,hy+3]],'#fff');ln(x,hx-4,hy-2,hx-1,hy-1,'#2a3a10',1.5);ln(x,hx+4,hy-2,hx+1,hy-1,'#2a3a10',1.5)}
 if(ci==1||ci==4){poly(x,[[hx-4,hy-1],[hx-10,hy-4],[hx-4,hy+2]],SK[ci]);poly(x,[[hx+4,hy-1],[hx+10,hy-4],[hx+4,hy+2]],SK[ci]);if(ci==4)ln(x,hx-4,hy-3,hx+4,hy-3,'#f2c41d',1.6)}
 if(ci==2){ell(x,hx,hy+5,5.2,5,'#b5651d');ell(x,hx,hy+2,2.5,1.5,SK[ci])}
 if(ci==3){ell(x,hx,hy-1,5.6,4.4,'#2b2b33');ell(x,hx,hy+1.2,3.4,2,SK[ci]);ell(x,hx-1.5,hy+.8,.7,.7,'#fff');ell(x,hx+1.5,hy+.8,.7,.7,'#fff')}
 if(ci==5||ci==6){poly(x,[[hx-7,hy-3],[hx,hy-17],[hx+7,hy-3]],ci==5?'#5a2a7a':'#2d58b8','#111');ell(x,hx,hy-3,8,2,ci==5?'#4a1f66':'#244a9a');if(ci==6)ell(x,hx,hy+5,3.6,4.5,'#f2f2f2')}
 if(ci==7){ell(x,hx,hy-1,5.4,4.2,'#1b2a22');ell(x,hx-1.6,hy+1,.9,.9,'#6fffb0');ell(x,hx+1.6,hy+1,.9,.9,'#6fffb0')}}
ART.unit=(k,col)=>{const key='u'+k+col;if(ART.c[key])return ART.c[key];
 return ART.c[key]=mkC(40,44,x=>{const ci=Math.max(0,CIVS.findIndex(c=>c.c==col)),sk=SK[ci],hd=k=='cab'?[18,10]:k=='uni'?[20,13]:[20,14];
  (()=>{const dk=shade(col,-70),lt=shade(col,45);ell(x,20,38,k=='cab'?13:9,3.5,'rgba(0,0,0,.35)');
  if(k=='cab'){ell(x,19,29,12,6,'#6b4423');[10,15,24,29].forEach(a=>ln(x,a,30,a,36,'#4a2e16',2.5));ell(x,31,22,5,4,'#6b4423');poly(x,[[27,17],[30,10],[33,18]],'#4a2e16');ell(x,18,19,5,7,col);ell(x,18,10,4.5,4.5,sk);ell(x,18,7,5,3.5,'#9aa0aa');ln(x,27,12,27,28,'#dfe3ea',2);return}
  if(k=='cha'){poly(x,[[14,20],[26,20],[30,36],[10,36]],col,dk);ell(x,20,14,4.5,4.5,sk);poly(x,[[14,14],[20,3],[26,14]],dk);ln(x,30,8,30,38,'#7a4f24',2);ell(x,30,7,4.5,4.5,'rgba(224,176,255,.5)');ell(x,30,7,2.4,2.4,'#e0b0ff');return}
  if(k=='uni'){poly(x,[[12,18],[28,18],[32,38],[8,38]],dk);ell(x,20,26,7,10,col);ell(x,20,13,5,5,sk);poly(x,[[14,10],[16,3],[20,8],[24,3],[26,10]],'#f2c41d');ln(x,31,10,31,38,'#e6e9ef',2.6);ell(x,20,27,2.6,2.6,'#f2c41d');return}
  ell(x,20,27,6.5,9,col);ell(x,20,14,4.8,4.8,sk);
  if(k=='vil'){ell(x,20,10.5,8,2.6,'#d9b44a');ell(x,20,9,4.5,3,'#e6c65a');ln(x,28,20,32,36,'#7a4f24',2);ln(x,28,20,34,22,'#aaa',2)}
  if(k=='sol'){ell(x,20,11,5.4,3.8,'#9aa0aa');ell(x,12,28,4.5,6.5,dk);ell(x,12,28,2.4,4,lt);ln(x,29,16,29,36,'#e6e9ef',2.4);ln(x,26,24,32,24,'#c9a23a',2)}
  if(k=='arc'){ell(x,20,11,6,4.2,dk);x.strokeStyle='#7a4f24';x.lineWidth=2;x.beginPath();x.arc(28,26,10,-1.2,1.2);x.stroke();ln(x,28+Math.cos(-1.2)*10,26+Math.sin(-1.2)*10,28+Math.cos(1.2)*10,26+Math.sin(1.2)*10,'#ddd',1)}})();
  if(k!='cha'||ci!=5&&ci!=6)deco(x,ci,hd[0],hd[1])})};
// Terreno: hierba moteada, flores, lagunas con orilla y suelo agrietado en la grieta central
function mkTerrain(){terr=mkC(W,W,x=>{
 const G=['#4d8c40','#509143','#4a8a3d','#529444'];
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){x.fillStyle=G[(i*7+j*13+(i*j)%5)%4];x.fillRect(i*T,j*T,T+1,T+1)}
 for(let k=0;k<700;k++)ell(x,rnd(W),rnd(W),14+rnd(40),8+rnd(24),k%2?'rgba(40,90,30,.14)':'rgba(150,170,60,.11)');
 for(let k=0;k<5500;k++){const a=rnd(W),b=rnd(W);ln(x,a,b,a+rnd(4)-2,b-3-rnd(4),k%2?'#2f6a2d':'#6aaa58',1)}
 for(let k=0;k<300;k++)ell(x,rnd(W),rnd(W),1.6,1.6,['#f6e27a','#fff','#f59ad0'][k%3]);
 for(const p of PD)ell(x,p.x,p.y,p.r+9,(p.r+9)*.85,'#d9c98c');
 for(const p of PD){ell(x,p.x,p.y,p.r,p.r*.85,'#2c6fae');ell(x,p.x-p.r*.1,p.y-p.r*.1,p.r*.8,p.r*.65,'#3584c6');ell(x,p.x-p.r*.25,p.y-p.r*.25,p.r*.35,p.r*.2,'rgba(255,255,255,.18)')}
 const gr=x.createRadialGradient(W/2,W/2,10,W/2,W/2,260);gr.addColorStop(0,'rgba(40,10,60,.9)');gr.addColorStop(1,'rgba(40,10,60,0)');x.fillStyle=gr;x.fillRect(W/2-260,W/2-260,520,520);
 for(let k=0;k<14;k++){const an=k/14*6.28;let px=W/2,py=W/2;x.strokeStyle='#1a0626';x.lineWidth=3;x.beginPath();x.moveTo(px,py);for(let s=0;s<5;s++){px+=Math.cos(an+rnd(.6)-.3)*45;py+=Math.sin(an+rnd(.6)-.3)*45;x.lineTo(px,py)}x.stroke()}
 });MMT=mkC(120,120,x=>x.drawImage(terr,0,0,120,120))}
