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
let WT=new Uint8Array(N*N),PD=[],MP=0,MMT;
let S,terr,cam={x:0,y:0,z:.9},DIF=1,MSG='';const AGE=[{f:300,g:150},{f:600,g:400}];
const D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),civ=p=>CIVS[S.civ[p]];
const afford=(p,c)=>Object.entries(c||{}).every(([k,v])=>S.res[p][k]>=v);
const pay=(p,c)=>{for(const k in c)S.res[p][k]-=c[k]};
const pop=p=>S.u.filter(u=>u.p==p).length;
const cap=p=>S.b.filter(b=>b.p==p&&!b.bt).reduce((s,b)=>s+(B[b.k].pop||0),0);

const ud=(p,k)=>k=='uni'?{...UU[S.civ[p]],r:9}:U[k];
function mkU(p,k,x,y){const d=ud(p,k),c=civ(p),h=d.hp*(c.hp||1)*(1+.15*S.age[p]);
 const u={p,k,x,y,r:d.r,hp:h,mh:h,atk:d.atk*(c.atk||1),rng:d.rng,sp:d.sp*(c.sp||1),sp0:d.sp*(c.sp||1),rt:null,hold:0,cd:0,carry:{t:'',n:0},gt:0,mv:null,tg:null,nd:null,ret:0};S.u.push(u);return u}
function mkB(p,k,x,y,bt=0){const d=B[k],b={p,k,x,y,r:d.s*T/2,hp:d.hp,mh:d.hp,q:[],bt,bt0:bt||1,rf:0};S.b.push(b);return b}
const node=(t,x,y,a)=>{if(!wt(x,y))S.n.push({t,x,y,r:10,amt:a})};
function canPlace(k,x,y){const s=B[k].s*T/2;
 return !wt(x,y)&&!wt(x-s,y-s)&&!wt(x+s,y+s)&&x>s&&y>s&&x<W-s&&y<W-s&&S.b.every(b=>Math.max(Math.abs(b.x-x),Math.abs(b.y-y))>b.r+s)&&D({x,y},RIFT)>RIFT.r+s}
function place(p,k,x,y,bl){x=Math.round(x/16)*16;y=Math.round(y/16)*16;
 if(!afford(p,B[k].cost)||!canPlace(k,x,y))return false;pay(p,B[k].cost);const b=mkB(p,k,x,y,k=='bar'?500:k=='tem'?400:240);(bl||[]).forEach(u=>{u.bd=b;u.mv=null;u.tg=null});return true}
function train(p,b,k){if(b.bt||b.q.length>=5||!afford(p,ud(p,k).cost))return;pay(p,ud(p,k).cost);b.q.push({k,t:150})}
function trainAge(p,b){if(!b||b.bt||S.age[p]>=2||b.q.some(x=>x.k=='age')||!afford(p,AGE[S.age[p]]))return;pay(p,AGE[S.age[p]]);b.q.push({k:'age',t:600})}
function nearNode(a,t){let r=null,bd=1e9;for(const n of S.n)if(n.t==t&&n.amt>0){const d=D(a,n);if(d<bd){bd=d;r=n}}return r}

const wt=(x,y)=>WT[Math.min(N-1,Math.max(0,y/T|0))*N+Math.min(N-1,Math.max(0,x/T|0))];
function newGame(ci){
 let ai;do ai=Math.random()*CIVS.length|0;while(ai==ci);
 const M=MAPS[MP];
 S={t:0,u:[],b:[],n:[],fx:[],sel:[],pl:null,civ:[ci,ai],hold:[0,0],over:0,sl:0,age:[0,0],ac:0,pw:[0,0],rf:[],
  res:[{w:200,f:200,g:100,s:100},{w:200,f:200,g:100,s:100}]};
 const bases=[{x:9*T,y:9*T,s:1},{x:(N-10)*T,y:(N-10)*T,s:-1}];
 WT.fill(0);PD=[];
 for(let k=0,n=0;n<M.po&&k<300;k++){const q={x:200+Math.random()*(W-400),y:200+Math.random()*(W-400)},r=60+Math.random()*50;
  if([...bases,RIFT].some(b=>D(q,b)<r+260)||PD.some(p=>D(p,q)<p.r+r+90))continue;
  [[0,0,1],[r*.7,r*.2,.7],[-r*.6,-r*.3,.75]].forEach(([a,b,f])=>PD.push({x:q.x+a,y:q.y+b,r:r*f}));n++}
 for(let j=0;j<N;j++)for(let i=0;i<N;i++)if(PD.some(p=>Math.hypot(p.x-i*T-16,p.y-j*T-16)<p.r))WT[j*N+i]=1;
 bases.forEach((p,i)=>{mkB(i,'tc',p.x,p.y);
  for(let k=0;k<3;k++)mkU(i,'vil',p.x+(k-1)*24,p.y+p.s*60);
  for(let k=0;k<6;k++)node('f',p.x+p.s*(90+k*14),p.y+p.s*(k*10-20),150);
  for(let k=0;k<12;k++)node('w',p.x+p.s*(40+Math.random()*90),p.y+p.s*(110+Math.random()*60),200);
  for(let k=0;k<4;k++){node('g',p.x+p.s*(150+k*14),p.y+p.s*60,700);node('s',p.x+p.s*(150+k*14),p.y+p.s*100,700)}});
 const rn=(t,n,a,sp)=>{for(let c=0;c<n;c++){const cx=Math.random()*W,cy=Math.random()*W;
  if([...bases,RIFT].some(b=>Math.hypot(cx-b.x,cy-b.y)<170))continue;
  for(let k=0;k<a;k++)node(t,cx+(Math.random()-.5)*sp,cy+(Math.random()-.5)*sp,t=='w'?200:t=='f'?150:700)}};
 rn('w',M.fo,M.fs,M.fp);rn('g',7*(M.gm||1),4,60);rn('s',6*(M.gm||1),4,60);rn('f',8,4,60);
 for(let k=0;k<70;k++)node('w',Math.random()*W,Math.random()*W,200);
 for(let i=0,n=0;n<3&&i<300;i++){const q={x:250+Math.random()*(W-500),y:250+Math.random()*(W-500)},m={x:W-q.x,y:W-q.y};
  if([...bases,RIFT].some(b=>D(q,b)<(b.s?420:200)||D(m,b)<(b.s?420:200))||D(q,m)<200||wt(q.x,q.y)||wt(m.x,m.y))continue;
  S.rf.push({x:q.x,y:q.y,r:14,mr:1},{x:m.x,y:m.y,r:14,mr:1});n++}
 cam.x=bases[0].x-innerWidth/2/cam.z;cam.y=bases[0].y-(innerHeight-130)/2/cam.z;clamp();ex.fill(0);fog();mkTerrain()}

// ---------- niebla de guerra y minimapa ----------
const fogC=document.createElement('canvas');fogC.width=fogC.height=N;
const fg=fogC.getContext('2d'),fi=fg.createImageData(N,N),ex=new Uint8Array(N*N),vs=new Uint8Array(N*N);
const vis=e=>vs[Math.min(N-1,e.y/T|0)*N+Math.min(N-1,e.x/T|0)];
function fog(){vs.fill(0);
 const mark=(x,y,r)=>{const cx=x/T|0,cy=y/T|0;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const X=cx+i,Y=cy+j;if(X>=0&&Y>=0&&X<N&&Y<N&&i*i+j*j<=r*r)vs[Y*N+X]=ex[Y*N+X]=1}};
 S.u.forEach(u=>u.p||mark(u.x,u.y,7));S.b.forEach(b=>b.p||mark(b.x,b.y,9));
 for(let i=0;i<N*N;i++)fi.data[i*4+3]=vs[i]?0:ex[i]?140:255;
 fg.putImageData(fi,0,0)}

// ---------- lógica ----------
function mvTo(a,x,y,s){const dx=x-a.x,dy=y-a.y,d=Math.hypot(dx,dy);
 if(d>s){const an=Math.atan2(dy,dx),sg=a.tr||1;let ok=0;
  for(const o of[0,.5,1,1.6,2.2]){const q=an+o*sg,mx=Math.cos(q)*s,my=Math.sin(q)*s;
   if(!wt(a.x+mx,a.y+my)&&!wt(a.x+mx*14,a.y+my*14)){a.x+=mx;a.y+=my;ok=1;break}}
  if(!ok)a.tr=-sg;
  a.fl=dx<-.01?1:dx>.01?0:a.fl;a.mvg=S.t}return d}
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
   if(!a.cd){a.cd=50;a.fl=a.tg.x<a.x;a.tg.hp-=a.atk*(1+.15*S.age[a.p])*(1+.05*S.pw[a.p]);S.fx.push({a:{x:a.x,y:a.y},b:{x:a.tg.x,y:a.tg.y},t:a.rng>50?12:6,n:a.rng>50?12:6,r:a.rng>50});if((a.p==0||a.tg.p==0)&&S.t-S.sl>5){S.sl=S.t;snd('hit')}}
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
 cam.x=Math.max(0,Math.min(W-innerWidth/cam.z,cam.x));cam.y=Math.max(0,Math.min(W-(innerHeight-130)/cam.z,cam.y))}
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

// ---------- interfaz (estilo Age of Empires 2) ----------
const cost=c=>Object.entries(c).map(([k,v])=>RN[k]+v).join(' ');
const bt=(a,i,l,c,ok=1)=>`<button data-a="${a}"${ok?'':' class="no"'}><i>${i}</i><b>${l}</b>${c?`<small>${cost(c)}</small>`:''}</button>`;
const NM={vil:'Aldeano',sol:'Soldado',arc:'Arquero',cab:'Caballero',cha:'Chamán',tc:'Centro urbano',bar:'Cuartel',house:'Casa',tem:'Templo'};
const pg=$('pt').getContext('2d'),mg=$('mm').getContext('2d'),mmv=$('mm');
let l1='',l2='',l3='',mmd=0;
function hud(){const r=S.res[0],pc=h=>Math.min(100,h/HOLD*100|0),af=k=>afford(0,k);
 const t=Object.keys(RN).map(k=>`<span>${RN[k]} ${r[k]|0}</span>`).join('')+`<span>👥 ${pop(0)}/${cap(0)}</span><span>🕰 Era ${S.age[0]+1}</span><span>🔮 ${S.pw[0]}-${S.pw[1]} (${S.rf.length})</span><span>🌀 ${pc(S.hold[0])}% · ${pc(S.hold[1])}%</span>`;
 if(t!=l1)$('res').innerHTML=l1=t;
 const s=S.sel[0];let c='';
 if(s&&s.p===0&&!s.bt){
  if(s.k=='tc')c+=bt('t:vil','👷','Aldeano',U.vil.cost,af(U.vil.cost))+(S.age[0]<2&&!s.q.some(x=>x.k=='age')?bt('a','🕰','Era '+(S.age[0]+2),AGE[S.age[0]],af(AGE[S.age[0]])):'');
  if(s.k=='bar'){c+=bt('t:sol','🗡','Soldado',U.sol.cost,af(U.sol.cost))+bt('t:arc','🏹','Arquero',U.arc.cost,af(U.arc.cost));if(S.age[0]){const u=UU[S.civ[0]];c+=bt('t:cab','🐎','Caballero',U.cab.cost,af(U.cab.cost))+bt('t:uni','★',u.n,u.cost,af(u.cost))}}
  if(s.k=='tem')c+=bt('t:cha','🔮','Chamán',U.cha.cost,af(U.cha.cost));
  if(s.k=='vil')c+=bt('b:house','🏠','Casa',B.house.cost,af(B.house.cost))+bt('b:bar','⚔','Cuartel',B.bar.cost,af(B.bar.cost))+bt('b:tem','🔮','Templo',B.tem.cost,af(B.tem.cost))}
 if(S.pl)c+=bt('x','✖','Cancelar');
 if(c!=l2)$('cmd').innerHTML=l2=c;
 let h='',p=null;
 if(!S.sel.length)h=`<b>${civ(0).n}</b><small>${civ(0).b}</small><small>Toca una unidad o edificio</small>`;
 else if(S.sel.length>1){p=s;h=`<b>${S.sel.length} unidades</b><small>❤ ${S.sel.reduce((a,u)=>a+u.hp,0)|0}</small>`}
 else{p=s;
  if(s.amt!==undefined)h=`<b>${{w:'Bosque',f:'Arbustos',g:'Mina de oro',s:'Cantera'}[s.t]}</b><small>${RN[s.t]} ${s.amt}</small>`;
  else if(s.mr)h='<b>Mini grieta</b><small>Solo los chamanes pueden recogerla</small>';
  else{h=`<b>${NM[s.k]||UU[S.civ[s.p]].n}${s.p?' (rival)':''}</b><small>❤ ${s.hp|0}/${s.mh|0}${s.atk?` · ⚔ ${s.atk.toFixed(0)}`:''}</small>`;
   if(s.q&&s.q.length)h+=`<small>⏳ ${s.q.length} en cola · ${100-(s.q[0].t/(s.q[0].k=='age'?6:1.5)|0)}%</small>`;
   if(s.bt)h+='<small>🔨 en obra (necesita aldeanos)</small>';if(s.rf)h+=`<small>🔮 ${s.rf}</small>`;
   if(s.carry&&s.carry.n)h+=`<small>${RN[s.carry.t]} ${s.carry.n}/10</small>`}}
 if(h!=l3)$('inf').innerHTML=l3=h;
 pg.clearRect(0,0,64,64);
 if(p&&!p.mr){const sp=p.q?ART.bld(p.k,civ(p.p).c,p.r):p.carry?ART.unit(p.k,civ(p.p).c):ART.n[p.t],k=Math.min(56/sp.width,56/sp.height,2.2);pg.drawImage(sp,32-sp.width*k/2,32-sp.height*k/2,sp.width*k,sp.height*k)}}
const act=e=>{initAudio();snd('click');const a=e.target.closest('button')?.dataset.a;if(!a||!S)return;const[k,v]=a.split(':'),s=S.sel[0];
 if(k=='t')train(0,s,v);else if(k=='a')trainAge(0,s);else if(k=='b')S.pl=v;
 else if(k=='army')S.sel=S.u.filter(u=>u.p==0&&u.k!='vil'&&u.k!='cha');
 else if(k=='sha')S.sel=S.u.filter(u=>u.p==0&&u.k=='cha');
 else if(k=='idle')S.sel=S.u.filter(u=>u.p==0&&u.k=='vil'&&!u.nd&&!u.carry.n&&!u.mv&&!u.bd);
 else if(k=='mute')setMute();else if(k=='menu'){S.over=1;showMenu()}else S.pl=null};
$('cmd').onclick=$('top').onclick=act;
const mmj=e=>{const r=mmv.getBoundingClientRect(),k=W/r.width;cam.x=(e.clientX-r.left)*k-innerWidth/cam.z/2;cam.y=(e.clientY-r.top)*k-(innerHeight-130)/cam.z/2;clamp()};
mmv.onpointerdown=e=>{mmv.setPointerCapture(e.pointerId);mmd=1;mmj(e)};mmv.onpointermove=e=>{if(mmd)mmj(e)};mmv.onpointerup=()=>mmd=0;
function showMenu(msg=''){MSG=msg;menu.hidden=false;
 menu.innerHTML=`<h1>GUERRILLA</h1><small>La Grieta del Mundo</small>${msg?`<h2>${msg}</h2>`:''}<p>${LORE}</p>
 <h3>Mapa</h3><div class="row">${MAPS.map((m,i)=>`<button data-m="${i}"${i==MP?' class="on"':''}><b>${m.n}</b><small>${m.d}</small></button>`).join('')}</div>
 <h3>Dificultad</h3><div class="row">${['Fácil','Normal','Difícil'].map((n,i)=>`<button data-d="${i}"${i==DIF?' class="on"':''}><b>${n}</b></button>`).join('')}</div>
 <h3>Elige tu civilización</h3><div id="civs">${CIVS.map((c,i)=>`<button data-i="${i}" style="border-color:${c.c}"><img width="36" height="40" src="${ART.unit('sol',c.c).toDataURL()}"><b>${c.n}</b><small>${c.b}</small><small>★ ${UU[i].n}</small></button>`).join('')}</div><button data-v="1" class="lnk">▶ Ver introducción</button>`}
menu.onclick=e=>{const b=e.target.closest('button');if(!b)return;initAudio();const d=b.dataset;
 if(d.d)DIF=+d.d,showMenu(MSG);else if(d.m)MP=+d.m,showMenu(MSG);else if(d.v)showIntro(()=>showMenu(MSG));else if(d.i){newGame(+d.i);menu.hidden=true}};

// ---------- dibujo ----------
const ring=(x,y,r,c,w=2)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.ellipse(x,y,r,r*.55,0,0,7);g.stroke()};
const bar=(e,w,dy)=>{g.fillStyle='#000';g.fillRect(e.x-w/2,e.y+dy,w,4);g.fillStyle=e.hp/e.mh>.4?'#5f5':'#f85';g.fillRect(e.x-w/2+.5,e.y+dy+.5,(w-1)*e.hp/e.mh,3)};
function drawRift(t){const R=RIFT,gr=g.createRadialGradient(R.x,R.y,5,R.x,R.y,R.r);gr.addColorStop(0,'rgba(240,200,255,.9)');gr.addColorStop(.35,'rgba(160,70,230,.6)');gr.addColorStop(1,'rgba(90,20,140,0)');
 g.fillStyle=gr;g.beginPath();g.arc(R.x,R.y,R.r*(1+.05*Math.sin(t/15)),0,7);g.fill();g.strokeStyle='#e0b0ff';g.lineWidth=2;
 for(let k=0;k<3;k++){const a=t/40*(k%2?-1:1);g.beginPath();g.arc(R.x,R.y,R.r*(.45+.18*k),a,a+2.2);g.stroke()}}
function dMini(r,t){const y=r.y-10+Math.sin(t/18+r.x)*3;ell(g,r.x,y,18,18,'rgba(200,120,255,.3)');poly(g,[[r.x,y-14],[r.x+8,y],[r.x,y+12],[r.x-8,y]],'#c46bff','#f0d4ff');poly(g,[[r.x,y-14],[r.x+8,y],[r.x,y]],'#e8b8ff')}
function dB(b){const s=ART.bld(b.k,civ(b.p).c,b.r);g.globalAlpha=b.bt?.55:1;g.drawImage(s,b.x-s.width/2,b.y+b.r+10-s.height);g.globalAlpha=1;
 if(b.bt){const w=b.r*1.4;g.fillStyle='#000';g.fillRect(b.x-w/2,b.y+b.r+14,w,4);g.fillStyle='#fc4';g.fillRect(b.x-w/2,b.y+b.r+14,w*(1-b.bt/b.bt0),4)}
 if(S.sel.includes(b)){g.strokeStyle='#fff';g.lineWidth=2;g.strokeRect(b.x-b.r-3,b.y-b.r-3,b.r*2+6,b.r*2+6)}
 if(b.hp<b.mh||S.sel.includes(b))bar(b,b.r*2,-b.r-14)}
function dU(u){const s=ART.unit(u.k,civ(u.p).c),bob=S.t-(u.mvg||-9)<3?Math.abs(Math.sin(S.t/3+u.x))*-2:0;
 if(S.sel.includes(u))ring(u.x,u.y+6,u.r+5,'#fff');
 g.save();g.translate(u.x,u.y+4+bob);if(u.fl)g.scale(-1,1);g.drawImage(s,-20,-36);g.restore();
 if(u.carry.n)ell(g,u.x,u.y-34,3,3,NC[u.carry.t]);
 if(u.hold)ell(g,u.x+(u.fl?-10:10),u.y-30,6,6,'rgba(224,176,255,.6)');
 if(u.hp<u.mh||S.sel.includes(u))bar(u,20,-36)}
function drawMM(){const m=120,k=m/W;mg.setTransform(1,0,0,1,0,0);mg.drawImage(MMT,0,0);
 for(const e of[...S.b,...S.u])if(!e.p||vis(e)){mg.fillStyle=civ(e.p).c;mg.fillRect(e.x*k-1.5,e.y*k-1.5,e.q?4:3,e.q?4:3)}
 mg.fillStyle='#e0b0ff';for(const r of S.rf)if(ex[(r.y/T|0)*N+(r.x/T|0)])mg.fillRect(r.x*k-1.5,r.y*k-1.5,3,3);
 mg.drawImage(fogC,0,0,m,m);mg.strokeStyle='#fff';mg.lineWidth=1;mg.strokeRect(cam.x*k,cam.y*k,innerWidth/cam.z*k,(innerHeight-130)/cam.z*k)}
function draw(){const d=devicePixelRatio||1,z=cam.z,t=S.t,vw=innerWidth/z,vh=innerHeight/z;
 g.setTransform(1,0,0,1,0,0);g.fillStyle='#0d0a14';g.fillRect(0,0,cv.width,cv.height);
 g.setTransform(d*z,0,0,d*z,-cam.x*z*d,-cam.y*z*d);
 g.drawImage(terr,0,0);drawRift(t);
 const L=[],In=e=>e.x>cam.x-80&&e.x<cam.x+vw+80&&e.y>cam.y-60&&e.y<cam.y+vh+120,sn=e=>ex[Math.min(N-1,e.y/T|0)*N+Math.min(N-1,e.x/T|0)];
 for(const n of S.n)if(n.amt>0&&In(n)&&sn(n))L.push(n);
 for(const r of S.rf)if(In(r)&&sn(r))L.push(r);
 for(const b of S.b)if(In(b)&&(!b.p||vis(b)))L.push(b);
 for(const u of S.u)if(In(u)&&(!u.p||vis(u)))L.push(u);
 L.sort((a,b)=>a.y-b.y);
 for(const e of L){if(e.mr)dMini(e,t);else if(e.q)dB(e);else if(e.carry)dU(e);else{const s=ART.n[e.t];g.drawImage(s,e.x-s.width/2,e.y-s.height+8)}}
 for(const f of S.fx){if(f.c){g.strokeStyle=f.c;g.lineWidth=1.5;g.beginPath();g.moveTo(f.a.x,f.a.y);g.lineTo(f.b.x,f.b.y);g.stroke();continue}
  if(f.r){const p=1-f.t/f.n,x=f.a.x+(f.b.x-f.a.x)*p,y=f.a.y+(f.b.y-f.a.y)*p;ln(g,x,y-10,x-(f.b.x-f.a.x)*.08,y-10-(f.b.y-f.a.y)*.08,'#e6d3a0',2)}
  else{g.fillStyle='rgba(255,230,120,'+f.t/f.n+')';g.beginPath();g.arc(f.b.x,f.b.y-8,4+(f.n-f.t),0,7);g.fill()}}
 g.drawImage(fogC,0,0,W,W);drawMM()}

// ---------- bucle ----------
function resize(){const d=devicePixelRatio||1;cv.width=innerWidth*d;cv.height=innerHeight*d;if(S)clamp()}
addEventListener('resize',resize);resize();try{if(localStorage.gi)showMenu();else showIntro(()=>{try{localStorage.gi=1}catch(_){}showMenu()})}catch(_){showIntro(showMenu)}
let lastT=0,acc=0;
(function loop(t){requestAnimationFrame(loop);acc+=Math.min(100,t-lastT);lastT=t;
 if(S&&!S.over&&menu.hidden){while(acc>=16.67){tick();acc-=16.67}hud()}else acc=0;
 if(S)draw()})(0);
