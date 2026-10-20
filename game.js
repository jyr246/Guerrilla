'use strict';
const $=i=>document.getElementById(i),cv=$('c'),g=cv.getContext('2d'),menu=$('menu');
const T=32,N=64,W=N*T,HOLD=3600,RIFT={x:W/2,y:W/2,r:90};
const RN={w:'🪵',f:'🍖',g:'🪙',s:'🪨'},NC={w:'#1f5a22',f:'#c83a4a',g:'#e8c020',s:'#9a9aa5'};
const U={vil:{n:'Aldeano',hp:40,atk:3,rng:16,sp:1.2,cost:{f:50},r:7},
 sol:{n:'Soldado',hp:90,atk:9,rng:16,sp:1.1,cost:{f:60,g:20},r:8},
 arc:{n:'Arquero',hp:50,atk:6,rng:110,sp:1.1,cost:{w:40,g:40},r:7},
 cab:{n:'Caballero',hp:120,atk:12,rng:16,sp:1.9,cost:{f:80,g:60},r:9},
 cha:{n:'Chamán',hp:40,atk:0,rng:0,sp:1.1,cost:{f:40,g:60},r:7}};
const B={tc:{hp:1500,s:3,pop:5,i:'🏰'},bar:{hp:700,s:2,cost:{w:100,s:50},i:'⚔️'},house:{hp:250,s:1,pop:5,cost:{w:30},i:'🏠'},
 tem:{hp:500,s:2,cost:{w:120,g:50},i:'🔮'}};
let AC=null,MUTE=0;
const SN={hit:[180,.06,'square',.04],spawn:[520,.1,'sine',.08],done:[392,.25,'triangle',.1],age:[660,.5,'triangle',.12],rift:[880,.3,'sine',.1],heal:[700,.08,'sine',.03],win:[784,.8,'triangle',.15],lose:[110,.8,'sawtooth',.12],click:[440,.04,'square',.04]};
const initAudio=()=>{if(!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(_){}};
function snd(n){if(!AC||MUTE)return;const[f,d,t,v]=SN[n],o=AC.createOscillator(),gn=AC.createGain(),c=AC.currentTime;
 o.type=t;o.frequency.value=f;gn.gain.setValueAtTime(v,c);gn.gain.exponentialRampToValueAtTime(.0001,c+d);o.connect(gn);gn.connect(AC.destination);o.start();o.stop(c+d)}
let S,terr,cam={x:0,y:0,z:.9},DIF=1,MSG='';const AGE=[{f:300,g:150},{f:600,g:400}];
const D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),civ=p=>CIVS[S.civ[p]];
const afford=(p,c)=>Object.entries(c||{}).every(([k,v])=>S.res[p][k]>=v);
const pay=(p,c)=>{for(const k in c)S.res[p][k]-=c[k]};
const pop=p=>S.u.filter(u=>u.p==p).length;
const cap=p=>S.b.filter(b=>b.p==p&&!b.bt).reduce((s,b)=>s+(B[b.k].pop||0),0);

const ud=(p,k)=>k=='uni'?{...UU[S.civ[p]],r:9}:U[k];
function mkU(p,k,x,y){const d=ud(p,k),c=civ(p),h=d.hp*(c.hp||1)*(1+.15*S.age[p]);
 const u={p,k,x,y,r:d.r,hp:h,mh:h,atk:d.atk*(c.atk||1),rng:d.rng,sp:d.sp*(c.sp||1),sp0:d.sp*(c.sp||1),rt:null,hold:0,cd:0,carry:{t:'',n:0},gt:0,mv:null,tg:null,nd:null,ret:0};S.u.push(u);return u}
function mkB(p,k,x,y,bt=0){const d=B[k],b={p,k,x,y,r:d.s*T/2,hp:d.hp,mh:d.hp,q:[],bt,rf:0};S.b.push(b);return b}
const node=(t,x,y,a)=>S.n.push({t,x,y,r:10,amt:a});
function canPlace(k,x,y){const s=B[k].s*T/2;
 return x>s&&y>s&&x<W-s&&y<W-s&&S.b.every(b=>Math.max(Math.abs(b.x-x),Math.abs(b.y-y))>b.r+s)&&D({x,y},RIFT)>RIFT.r+s}
function place(p,k,x,y,bl){x=Math.round(x/16)*16;y=Math.round(y/16)*16;
 if(!afford(p,B[k].cost)||!canPlace(k,x,y))return false;pay(p,B[k].cost);const b=mkB(p,k,x,y,k=='bar'?500:k=='tem'?400:240);(bl||[]).forEach(u=>{u.bd=b;u.mv=null;u.tg=null});return true}
function train(p,b,k){if(b.bt||b.q.length>=5||!afford(p,ud(p,k).cost))return;pay(p,ud(p,k).cost);b.q.push({k,t:150})}
function trainAge(p,b){if(!b||b.bt||S.age[p]>=2||b.q.some(x=>x.k=='age')||!afford(p,AGE[S.age[p]]))return;pay(p,AGE[S.age[p]]);b.q.push({k:'age',t:600})}
function nearNode(a,t){let r=null,bd=1e9;for(const n of S.n)if(n.t==t&&n.amt>0){const d=D(a,n);if(d<bd){bd=d;r=n}}return r}

function newGame(ci){
 let ai;do ai=Math.random()*CIVS.length|0;while(ai==ci);
 S={t:0,u:[],b:[],n:[],fx:[],sel:[],pl:null,civ:[ci,ai],hold:[0,0],over:0,sl:0,age:[0,0],ac:0,pw:[0,0],rf:[],
  res:[{w:200,f:200,g:100,s:100},{w:200,f:200,g:100,s:100}]};
 const bases=[{x:9*T,y:9*T,s:1},{x:(N-10)*T,y:(N-10)*T,s:-1}];
 bases.forEach((p,i)=>{mkB(i,'tc',p.x,p.y);
  for(let k=0;k<3;k++)mkU(i,'vil',p.x+(k-1)*24,p.y+p.s*60);
  for(let k=0;k<5;k++)node('f',p.x+p.s*(90+k*14),p.y+p.s*(k*10-20),150);
  for(let k=0;k<10;k++)node('w',p.x+p.s*(40+Math.random()*90),p.y+p.s*(110+Math.random()*60),200);
  for(let k=0;k<4;k++){node('g',p.x+p.s*(150+k*14),p.y+p.s*60,700);node('s',p.x+p.s*(150+k*14),p.y+p.s*100,700)}});
 const rnd=(t,n,a,sp)=>{for(let c=0;c<n;c++){const cx=Math.random()*W,cy=Math.random()*W;
  if([...bases,RIFT].some(b=>Math.hypot(cx-b.x,cy-b.y)<170))continue;
  for(let k=0;k<a;k++)node(t,cx+(Math.random()-.5)*sp,cy+(Math.random()-.5)*sp,t=='w'?200:t=='f'?150:700)}};
 rnd('w',30,9,110);rnd('g',7,5,70);rnd('s',7,5,70);rnd('f',8,4,60);
 for(let i=0,n=0;n<3&&i<300;i++){const q={x:250+Math.random()*(W-500),y:250+Math.random()*(W-500)},m={x:W-q.x,y:W-q.y};
  if([...bases,RIFT].some(b=>D(q,b)<(b.s?420:200)||D(m,b)<(b.s?420:200))||D(q,m)<200)continue;
  S.rf.push({x:q.x,y:q.y,r:14,mr:1},{x:m.x,y:m.y,r:14,mr:1});n++}
 cam.x=bases[0].x-innerWidth/2/cam.z;cam.y=bases[0].y-innerHeight/2/cam.z;clamp();ex.fill(0);fog();
}

// ---------- niebla de guerra y minimapa ----------
const fogC=document.createElement('canvas');fogC.width=fogC.height=N;
const fg=fogC.getContext('2d'),fi=fg.createImageData(N,N),ex=new Uint8Array(N*N),vs=new Uint8Array(N*N);
const vis=e=>vs[Math.min(N-1,e.y/T|0)*N+Math.min(N-1,e.x/T|0)];
const MM=()=>({x:innerWidth-102,y:74,s:96});
function fog(){vs.fill(0);
 const mark=(x,y,r)=>{const cx=x/T|0,cy=y/T|0;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const X=cx+i,Y=cy+j;if(X>=0&&Y>=0&&X<N&&Y<N&&i*i+j*j<=r*r)vs[Y*N+X]=ex[Y*N+X]=1}};
 S.u.forEach(u=>u.p||mark(u.x,u.y,7));S.b.forEach(b=>b.p||mark(b.x,b.y,9));
 for(let i=0;i<N*N;i++)fi.data[i*4+3]=vs[i]?0:ex[i]?140:255;
 fg.putImageData(fi,0,0)}

// ---------- lógica ----------
function mvTo(a,x,y,s){const dx=x-a.x,dy=y-a.y,d=Math.hypot(dx,dy);if(d>s){a.x+=dx/d*s;a.y+=dy/d*s}return d}
function gather(a){const m=civ(a.p).gm||{};
 if(a.ret||a.carry.n>=10||(!a.nd&&a.carry.n)){
  let tc=null,bd=1e9;for(const b of S.b)if(b.p==a.p&&b.k=='tc'){const d=D(a,b);if(d<bd){bd=d;tc=b}}
  if(!tc)return;
  if(bd<=tc.r+12){S.res[a.p][a.carry.t]+=a.carry.n;a.carry.n=0;a.ret=0}else mvTo(a,tc.x,tc.y,a.sp);
  return}
 if(!a.nd)return;
 if(a.nd.amt<=0){a.nd=nearNode(a,a.nd.t);if(!a.nd){a.ret=a.carry.n>0?1:0;return}}
 if(D(a,a.nd)<=a.nd.r+10){
  if(a.carry.n&&a.carry.t!=a.nd.t)a.carry.n=0;
  a.gt+=(m[a.nd.t]||1)*(1+.05*S.pw[a.p]);
  if(a.gt>=30){a.gt=0;a.carry.t=a.nd.t;a.carry.n++;a.nd.amt--;if(a.carry.n>=10)a.ret=1}
 }else mvTo(a,a.nd.x,a.nd.y,a.sp)}
function shaman(a){
 if(a.mv){if(mvTo(a,a.mv.x,a.mv.y,a.sp)<4)a.mv=null;return}
 if(a.hold){let t=null,bd=1e9;for(const b of S.b)if(b.p==a.p&&b.k=='tem'&&!b.bt){const d=D(a,b);if(d<bd){bd=d;t=b}}
  if(!t)return;if(bd<=t.r+12){t.rf++;a.hold=0;a.sp=a.sp0;if(!a.p)snd('rift')}else mvTo(a,t.x,t.y,a.sp);return}
 if(a.rt){if(!S.rf.includes(a.rt)){a.rt=null;return}
  if(D(a,a.rt)<=a.rt.r+10){S.rf=S.rf.filter(r=>r!=a.rt);a.hold=1;a.rt=null;a.sp=a.sp0*.7;if(!a.p)snd('rift')}else mvTo(a,a.rt.x,a.rt.y,a.sp);return}
 heal(a)}
function heal(a){let t=null,bd=220;
 for(const u of S.u)if(u.p==a.p&&u.hp<u.mh&&u.k!='vil'&&u.k!='cha'){const d=D(a,u);if(d<bd){bd=d;t=u}}
 if(!t)return;if(bd>80){mvTo(a,t.x,t.y,a.sp);return}
 if(!a.cd){a.cd=30;t.hp=Math.min(t.mh,t.hp+3);S.fx.push({a:{x:a.x,y:a.y},b:{x:t.x,y:t.y},t:8,c:'#6f6'});if(!a.p)snd('heal')}}
function build(a){const b=a.bd;if(!b||b.hp<=0||!b.bt){a.bd=null;return}
 if(D(a,b)<=b.r+14){if(--b.bt<=0){b.bt=0;a.bd=null;if(!b.p)snd('done')}}else mvTo(a,b.x,b.y,a.sp)}
function stepU(a){
 if(a.cd>0)a.cd--;
 if(a.k=='cha'){shaman(a);return}
 if(a.tg&&a.tg.hp<=0)a.tg=null;
 if(a.tg){if(D(a,a.tg)-(a.tg.r||0)<=a.rng){
   if(!a.cd){a.cd=50;a.tg.hp-=a.atk*(1+.15*S.age[a.p])*(1+.05*S.pw[a.p]);S.fx.push({a:{x:a.x,y:a.y},b:{x:a.tg.x,y:a.tg.y},t:6});if((a.p==0||a.tg.p==0)&&S.t-S.sl>5){S.sl=S.t;snd('hit')}}
  }else mvTo(a,a.tg.x,a.tg.y,a.sp);return}
 if(a.mv){if(mvTo(a,a.mv.x,a.mv.y,a.sp)<4)a.mv=null;return}
 if(a.k=='vil'){if(a.bd)build(a);else gather(a);return}
 let best=null,bd=180;for(const e of[...S.u,...S.b])if(e.p!=a.p){const d=D(a,e);if(d<bd){bd=d;best=e}}a.tg=best}
function ai(){
 const tc=S.b.find(b=>b.p==1&&b.k=='tc');if(!tc)return;
 const r=S.res[1],bz=k=>S.b.some(b=>b.p==1&&b.k==k&&b.bt),vs=S.u.filter(u=>u.p==1&&u.k=='vil'),ar=S.u.filter(u=>u.p==1&&u.k!='vil'&&u.k!='cha');
 if(vs.length>=6&&ar.length>=3&&!tc.q.length)trainAge(1,tc);
 if(vs.length<[8,10,14][DIF])train(1,tc,'vil');
 vs.forEach(v=>{if(!v.nd&&!v.carry.n)v.nd=nearNode(v,'fwgffgw'[S.ac++%7])});
 if(!bz('house')&&pop(1)>=cap(1)-2)for(let k=0;k<8&&!place(1,'house',tc.x-100-Math.random()*120,tc.y-Math.random()*200+60,vs.slice(0,2));k++);
 const bar=S.b.find(b=>b.p==1&&b.k=='bar');
 if(!bar){if(!bz('bar'))for(let k=0;k<8&&!place(1,'bar',tc.x-120-Math.random()*80,tc.y-130+Math.random()*60,vs.slice(2,4));k++);}
 else if(bar.q.length<2&&(ar.length<4||vs.length<6||S.age[1]>1||(r.f>=AGE[S.age[1]].f+60&&r.g>=AGE[S.age[1]].g+40))){const ks=S.age[1]?['sol','arc','cab','uni']:['sol','arc'];train(1,bar,ks[Math.random()*ks.length|0])}
 if(!bz('tem')&&bar&&ar.length>=4&&vs.length>=8&&!S.b.some(b=>b.p==1&&b.k=='tem'))for(let k=0;k<8&&!place(1,'tem',tc.x-120-Math.random()*100,tc.y+60+Math.random()*100,vs.slice(4,6));k++);
 const tm=S.b.find(b=>b.p==1&&b.k=='tem'),ch=S.u.filter(u=>u.p==1&&u.k=='cha');
 if(tm&&S.rf.length>ch.length&&ch.length<2)train(1,tm,'cha');
 if(S.rf.length)ch.forEach(u=>{if(u.rt||u.hold||u.mv)return;let r=null,bd=1e9;for(const x of S.rf){const d=D(u,x);if(d<bd){bd=d;r=x}}u.rt=r});
 if(ar.length>=[12,9,7][DIF])ar.forEach(u=>{let best=null,bd=1e9;
  for(const e of[...S.u,...S.b])if(e.p==0){const d=D(u,e);if(d<bd){bd=d;best=e}}u.tg=best})}
function tick(){S.t++;
 for(const b of S.b){if(b.bt)continue;const q=b.q[0];
  if(q&&--q.t<=0){if(q.k=='age'){b.q.shift();S.age[b.p]++;if(!b.p)snd('age')}else if(pop(b.p)<cap(b.p)){b.q.shift();mkU(b.p,q.k,b.x+(Math.random()-.5)*60,b.y+b.r+14);if(!b.p)snd('spawn')}else q.t=0}}
 S.u.forEach(stepU);
 S.fx=S.fx.filter(f=>--f.t>0);
 S.u.forEach(u=>{if(u.hp<=0&&u.hold)S.rf.push({x:u.x,y:u.y,r:14,mr:1})});
 S.b.forEach(b=>{for(let k=0;b.hp<=0&&k<b.rf;k++)S.rf.push({x:b.x+k*22-30,y:b.y+b.r+20,r:14,mr:1})});
 S.u=S.u.filter(u=>u.hp>0);S.b=S.b.filter(b=>b.hp>0);S.sel=S.sel.filter(s=>s.hp>0);
 S.pw=[0,1].map(p=>S.b.reduce((t,b)=>t+(b.p==p&&!b.bt?b.rf:0),0));
 if(S.t%60==0)S.n=S.n.filter(n=>n.amt>0);
 if(S.t%[200,120,70][DIF]==0)ai();if(S.t%6==0)fog();
 for(const p of[0,1]){const f=q=>S.u.filter(u=>u.p==q&&u.k!='vil'&&D(u,RIFT)<RIFT.r).length;
  if(f(p)&&!f(1-p))S.hold[p]++;else if(!f(p))S.hold[p]=Math.max(0,S.hold[p]-1)}
 const tc=p=>S.b.some(b=>b.p==p&&b.k=='tc');
 if(!tc(1)||S.hold[0]>=HOLD){S.over=1;snd('win');showMenu('🏆 ¡Victoria!')}
 else if(!tc(0)||S.hold[1]>=HOLD){S.over=1;snd('lose');showMenu('💀 Derrota')}}

// ---------- entrada táctil / ratón ----------
const P=new Map();let mvd=0,pd=0;
function clamp(){const mz=Math.max(.5,innerWidth/W,innerHeight/W);cam.z=Math.min(2,Math.max(mz,cam.z));
 cam.x=Math.max(0,Math.min(W-innerWidth/cam.z,cam.x));cam.y=Math.max(0,Math.min(W-innerHeight/cam.z,cam.y))}
cv.onpointerdown=e=>{initAudio();P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size==1)mvd=0;pd=0;cv.setPointerCapture(e.pointerId)};
cv.onpointermove=e=>{const o=P.get(e.pointerId);if(!o)return;const n={x:e.clientX,y:e.clientY};
 if(P.size==1){cam.x-=(n.x-o.x)/cam.z;cam.y-=(n.y-o.y)/cam.z;mvd+=Math.abs(n.x-o.x)+Math.abs(n.y-o.y)}
 else if(P.size==2){P.set(e.pointerId,n);const[a,b]=[...P.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pd)cam.z*=d/pd;pd=d;mvd=99;clamp();return}
 P.set(e.pointerId,n);clamp()};
cv.onpointerup=cv.onpointercancel=e=>{if(P.size==1&&mvd<8&&e.type=='pointerup'&&S&&!S.over)tap(e.clientX,e.clientY);P.delete(e.pointerId);pd=0};
cv.onwheel=e=>{cam.z*=e.deltaY<0?1.1:.9;clamp()};
function at(w){
 for(const u of S.u)if(D(u,w)<u.r+8&&(u.p===0||vis(u)))return u;
 for(const b of S.b)if(Math.abs(b.x-w.x)<b.r&&Math.abs(b.y-w.y)<b.r&&(b.p===0||vis(b)))return b;
 for(const n of S.n)if(n.amt>0&&D(n,w)<n.r+8&&ex[(n.y/T|0)*N+(n.x/T|0)])return n;
 for(const r of S.rf)if(D(r,w)<r.r+10&&ex[(r.y/T|0)*N+(r.x/T|0)])return r}
function tap(px,py){
 const m=MM();if(px>=m.x&&px<=m.x+m.s&&py>=m.y&&py<=m.y+m.s){cam.x=(px-m.x)/m.s*W-innerWidth/cam.z/2;cam.y=(py-m.y)/m.s*W-innerHeight/cam.z/2;clamp();return}
 const w={x:cam.x+px/cam.z,y:cam.y+py/cam.z};
 if(S.pl){const vb=S.sel.filter(u=>u.k=='vil'&&u.p===0);if(!vb.length){const v=S.u.find(u=>u.p===0&&u.k=='vil');if(v)vb.push(v)}
  if(place(0,S.pl,w.x,w.y,vb))S.pl=null;return}
 const e=at(w),me=S.sel.filter(s=>s.k in U&&s.p===0);
 if(e&&e.p===0){S.sel=[e];return}
 if(me.length){me.forEach(u=>u.bd=null);
  if(e&&e.p===1)me.forEach(u=>{u.tg=e;u.mv=null;u.nd=null});
  else if(e&&e.amt!==undefined)me.forEach(u=>{u.tg=null;u.mv=null;if(u.k=='vil'){u.nd=e;u.ret=0}else u.mv={x:e.x,y:e.y}});
  else if(e&&e.mr)me.forEach(u=>{u.tg=null;u.nd=null;u.ret=0;u.mv=null;if(u.k=='cha')u.rt=e;else u.mv={x:e.x,y:e.y}});
  else me.forEach((u,i)=>{u.tg=null;u.nd=null;u.ret=0;u.rt=null;u.mv={x:w.x+(i%4)*16-24,y:w.y+(i/4|0)*16}});
  return}
 S.sel=e?[e]:[]}

// ---------- interfaz ----------
const cost=c=>Object.entries(c).map(([k,v])=>RN[k]+v).join(' ');
const bt=(a,l,c)=>`<button data-a="${a}">${l}${c?`<small>${cost(c)}</small>`:''}</button>`;
let lt='',lb='';
function hud(){const r=S.res[0],pc=h=>Math.min(100,h/HOLD*100|0);
 const t=Object.keys(RN).map(k=>`<span>${RN[k]} ${r[k]|0}</span>`).join('')+`<span>👥 ${pop(0)}/${cap(0)}</span><span>🕰 Era ${S.age[0]+1}</span><span>🔮 Tú ${S.pw[0]} · Rival ${S.pw[1]} · libres ${S.rf.length}</span><span>🌀 Tú ${pc(S.hold[0])}% · Rival ${pc(S.hold[1])}%</span>`;
 if(t!=lt)$('top').innerHTML=lt=t;
 const s=S.sel[0];let h='';
 if(s&&s.p===0&&s.bt)h+=`<span>🔨 en obra (necesita aldeanos)</span>`;
 if(s&&s.p===0&&!s.bt){
  if(s.k=='tc'){h+=bt('t:vil','Aldeano',U.vil.cost);if(S.age[0]<2&&!s.q.some(x=>x.k=='age'))h+=bt('a','Era '+(S.age[0]+2),AGE[S.age[0]])}
  if(s.k=='bar')h+=bt('t:sol','Soldado',U.sol.cost)+bt('t:arc','Arquero',U.arc.cost)+(S.age[0]?bt('t:cab','Caballero',U.cab.cost)+bt('t:uni','★ '+UU[S.civ[0]].n,UU[S.civ[0]].cost):'');
  if(s.k=='tem')h+=bt('t:cha','Chamán',U.cha.cost)+`<span>🔮 ${s.rf}</span>`;
  if(s.k=='vil')h+=bt('b:house','Casa',B.house.cost)+bt('b:bar','Cuartel',B.bar.cost)+bt('b:tem','Templo',B.tem.cost);
  if(s.q&&s.q.length)h+=`<span>⏳ ${s.q.length}</span>`}
 h+=bt('army','⚔ Ejército')+(S.u.some(u=>u.p==0&&u.k=='cha')?bt('sha','🔮 Chamanes'):'')+bt('idle','👷 Libres')+(S.pl?bt('x','✖ Cancelar'):'')+bt('mute',MUTE?'🔇':'🔊')+bt('menu','☰ Menú');
 if(h!=lb)$('bot').innerHTML=lb=h}
$('bot').onclick=e=>{initAudio();snd('click');const a=e.target.closest('button')?.dataset.a;if(!a||!S)return;const[k,v]=a.split(':');
 if(k=='t')train(0,S.sel[0],v);
 else if(k=='a')trainAge(0,S.sel[0]);
 else if(k=='mute')MUTE=1-MUTE;
 else if(k=='menu'){S.over=1;showMenu()}
 else if(k=='b')S.pl=v;
 else if(k=='army')S.sel=S.u.filter(u=>u.p==0&&u.k!='vil'&&u.k!='cha');
 else if(k=='sha')S.sel=S.u.filter(u=>u.p==0&&u.k=='cha');
 else if(k=='idle')S.sel=S.u.filter(u=>u.p==0&&u.k=='vil'&&!u.nd&&!u.carry.n&&!u.mv);
 else S.pl=null};
function showMenu(msg=''){MSG=msg;menu.hidden=false;
 menu.innerHTML=`<h1>GUERRILLA</h1>${msg?`<h2>${msg}</h2>`:''}<p>${LORE}</p><p>Dificultad:</p><div id="dif">${['Fácil','Normal','Difícil'].map((n,i)=>`<button data-d="${i}" style="border-color:${i==DIF?'#c46bff':'#6b5a8e'}">${n}</button>`).join('')}</div><p>Elige tu civilización:</p><div id="civs">${CIVS.map((c,i)=>`<button data-i="${i}" style="border-color:${c.c}"><b>${c.n}</b><small>${c.b}</small></button>`).join('')}</div>`}
menu.onclick=e=>{initAudio();const b=e.target.closest('button');if(!b)return;if(b.dataset.d){DIF=+b.dataset.d;showMenu(MSG)}else{newGame(+b.dataset.i);menu.hidden=true}};

// ---------- dibujo ----------
function mkTerrain(){terr=document.createElement('canvas');terr.width=terr.height=W;const t=terr.getContext('2d');
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){t.fillStyle=Math.random()<.08?'#376f33':(x+y)%2?'#3f7d3a':'#458541';t.fillRect(x*T,y*T,T,T)}}
const ring=(x,y,r,c,w=2)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.arc(x,y,r,0,7);g.stroke()};
const bar=(e,w)=>{g.fillStyle='#000';g.fillRect(e.x-w/2,e.y-e.r-8,w,4);g.fillStyle='#4f4';g.fillRect(e.x-w/2,e.y-e.r-8,w*e.hp/e.mh,4)};
function draw(){const d=devicePixelRatio||1,z=cam.z;
 g.setTransform(1,0,0,1,0,0);g.fillStyle='#14101c';g.fillRect(0,0,cv.width,cv.height);
 g.setTransform(d*z,0,0,d*z,-cam.x*z*d,-cam.y*z*d);
 g.drawImage(terr,0,0);
 g.fillStyle='rgba(150,60,220,.28)';g.beginPath();g.arc(RIFT.x,RIFT.y,RIFT.r,0,7);g.fill();
 ring(RIFT.x,RIFT.y,RIFT.r*(.92+.08*Math.sin(S.t/20)),'#c46bff',3);
 for(const r of S.rf)if(ex[(r.y/T|0)*N+(r.x/T|0)]){g.fillStyle='rgba(196,107,255,.45)';g.beginPath();g.arc(r.x,r.y,r.r,0,7);g.fill();ring(r.x,r.y,r.r*(.7+.3*Math.sin(S.t/12+r.x)),'#e0b0ff',2)}
 for(const n of S.n)if(n.amt>0&&ex[(n.y/T|0)*N+(n.x/T|0)]){g.fillStyle=NC[n.t];g.beginPath();g.arc(n.x,n.y,n.r,0,7);g.fill()}
 g.textAlign='center';g.textBaseline='middle';
 for(const b of S.b){if(b.p&&!vis(b))continue;g.globalAlpha=b.bt?.5:1;g.fillStyle=civ(b.p).c;g.fillRect(b.x-b.r,b.y-b.r,b.r*2,b.r*2);g.strokeStyle='#000';g.lineWidth=2;g.strokeRect(b.x-b.r,b.y-b.r,b.r*2,b.r*2);
  g.font=b.r+'px serif';g.fillText(B[b.k].i,b.x,b.y);if(b.hp<b.mh||S.sel.includes(b))bar(b,b.r*2);g.globalAlpha=1}
 g.font='9px sans-serif';
 for(const u of S.u){if(u.p&&!vis(u))continue;g.fillStyle=civ(u.p).c;g.beginPath();g.arc(u.x,u.y,u.r,0,7);g.fill();ring(u.x,u.y,u.r,'#000',1.5);
  g.fillStyle='#000';g.fillText(u.k=='vil'?'V':u.k=='sol'?'S':u.k=='arc'?'A':u.k=='cab'?'C':u.k=='uni'?'★':'✦',u.x,u.y+.5);if(u.hold)ring(u.x,u.y,u.r+3,'#e0b0ff',2);if(u.hp<u.mh||S.sel.includes(u))bar(u,18)}
 for(const s of S.sel)ring(s.x,s.y,(s.r||10)+4,'#fff',2);
 g.lineWidth=1.5;for(const f of S.fx){g.strokeStyle=f.c||'#ffd';g.beginPath();g.moveTo(f.a.x,f.a.y);g.lineTo(f.b.x,f.b.y);g.stroke()}
 g.drawImage(fogC,0,0,W,W);
 g.setTransform(d,0,0,d,0,0);const m=MM(),k=m.s/W;g.fillStyle='#1d3b1d';g.fillRect(m.x,m.y,m.s,m.s);
 for(const e of[...S.b,...S.u])if(!e.p||vis(e)){g.fillStyle=civ(e.p).c;g.fillRect(m.x+e.x*k-1.5,m.y+e.y*k-1.5,3,3)}
 g.fillStyle='#e0b0ff';for(const r of S.rf)if(ex[(r.y/T|0)*N+(r.x/T|0)])g.fillRect(m.x+r.x*k-1.5,m.y+r.y*k-1.5,3,3);
 g.drawImage(fogC,m.x,m.y,m.s,m.s);g.strokeStyle='#fff';g.lineWidth=1;g.strokeRect(m.x+cam.x*k,m.y+cam.y*k,innerWidth/z*k,innerHeight/z*k);g.strokeRect(m.x,m.y,m.s,m.s)}

// ---------- bucle ----------
function resize(){const d=devicePixelRatio||1;cv.width=innerWidth*d;cv.height=innerHeight*d;if(S)clamp()}
addEventListener('resize',resize);resize();mkTerrain();showMenu();
let lastT=0,acc=0;
(function loop(t){requestAnimationFrame(loop);acc+=Math.min(100,t-lastT);lastT=t;
 if(S&&!S.over&&menu.hidden){while(acc>=16.67){tick();acc-=16.67}hud()}else acc=0;
 if(S)draw()})(0);
