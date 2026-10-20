'use strict';
// Introducción narrada: 5 escenas dibujadas por código con el lore del juego
function scene(x,i,p,w,h){
 const z=1+.05*p;x.setTransform(z,0,0,z,-(z-1)*w/2,-(z-1)*h/2);
 const sk=(a,b)=>{const g=x.createLinearGradient(0,0,0,h*.75);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,w,h)};
 const hills=(c,y,a,f)=>{x.fillStyle=c;x.beginPath();x.moveTo(0,h);for(let k=0;k<=w;k+=12)x.lineTo(k,y+Math.sin(k*f+a)*h*.03+Math.sin(k*f*2.3)*h*.015);x.lineTo(w,h);x.fill()};
 const sp=(k,c,px,py,s,fl)=>{const im=ART.unit(k,c);x.save();x.translate(px,py);if(fl)x.scale(-1,1);x.drawImage(im,-20*s,-36*s,40*s,44*s);x.restore()};
 const u=Math.min(w,h*1.4)/700,star=(n)=>{for(let k=0;k<n;k++)ell(x,(k*137)%w,(k*71)%(h*.5),1+k%2,1+k%2,'rgba(255,255,255,'+(.4+.4*Math.sin(p*9+k))+')')};
 const beam=(a)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(200,120,255,0)');g.addColorStop(.7,'rgba(200,120,255,'+a+')');g.addColorStop(1,'rgba(255,230,255,'+a+')');x.fillStyle=g;x.fillRect(w/2-w*.05*(.5+a),0,w*.1*(.5+a),h)};
 if(i==0){sk('#f7c873','#6aa0d8');ell(x,w*.7,h*.28,h*.07,h*.07,'#fff3c4');hills('#6f9a5a',h*.55,0,.004);hills('#4a7d3e',h*.66,2,.006);
  [[.15,'#c0503c'],[.3,'#4a8a2a'],[.5,'#3f7fe0'],[.68,'#e8d27a'],[.82,'#b04fd8']].forEach(([a,c],k)=>x.drawImage(ART.bld('house',c,16),w*a,h*(.6+.03*(k%2)),52*u*1.6,52*u*1.6));
  for(let k=0;k<5;k++){const bx=(p*w*.5+k*w*.2)%w,by=h*.2+k*18*u;ln(x,bx,by,bx+8*u,by+5*u,'#222',2);ln(x,bx+8*u,by+5*u,bx+16*u,by,'#222',2)}}
 if(i==1){sk('#e8935a','#3a3a6a');hills('#3c5a3a',h*.62,1,.005);CIVS.forEach((c,k)=>{const bx=w*(.07+k*.107),by=h*.5;ln(x,bx,by,bx,h*.8,'#4a3a2a',3);const f=Math.sin(p*10+k)*4*u;poly(x,[[bx,by],[bx+34*u,by+f+4*u],[bx+34*u,by+30*u+f],[bx,by+26*u]],c.c,'#000');sp('sol',c.c,bx+20*u,h*.84,1.4*u*1.2,k%2)})}
 if(i==2){sk('#0b0820','#2a1546');star(80);hills('#150f24',h*.7,3,.004);beam(Math.min(1,p*1.4)*.7);x.strokeStyle='#e0b0ff';x.lineWidth=3*u;x.shadowColor='#c46bff';x.shadowBlur=20;for(let k=0;k<6;k++){let px=w/2,py=h*.72;x.beginPath();x.moveTo(px,py);for(let s=0;s<6;s++){px+=Math.sin(k*9+s*2.1)*35*u*p;py+=(k%2?1:-.3)*20*u*p;x.lineTo(px,py)}x.stroke()}x.shadowBlur=0}
 if(i==3){sk('#2a1050','#8a3fc0');star(60);beam(.85);hills('#150f24',h*.72,5,.005);ell(x,w/2,h*.38+Math.sin(p*8)*8*u,18*u,18*u,'#f0d4ff');ell(x,w/2,h*.38+Math.sin(p*8)*8*u,40*u,40*u,'rgba(200,120,255,.3)');
  CIVS.forEach((c,k)=>sp(k%3==0?'cab':k%3==1?'arc':'sol',c.c,w*(k<5?.1+k*.06:.62+(k-5)*.07),h*.86,1.3*u*1.2,k>=5))}
 if(i==4){sk('#3a0d1a','#7a2a3a');hills('#2a1018',h*.7,2,.005);for(let k=0;k<9;k++){sp(k%2?'sol':'arc',CIVS[k].c,w*(.08+k%5*.07),h*.78+(k/5|0)*28*u,1.5*u*1.2,0);sp(k%2?'cab':'sol',CIVS[8-k].c,w*(.92-k%5*.07),h*.78+(k/5|0)*28*u,1.5*u*1.2,1)}
  x.globalAlpha=Math.min(1,p*3);x.fillStyle='#f1d98a';x.font='bold '+(h*.14)+'px Georgia,serif';x.textAlign='center';x.shadowColor='#c46bff';x.shadowBlur=25;x.fillText('GUERRILLA',w/2,h*.32);x.shadowBlur=0;x.globalAlpha=1}
 for(let k=0;k<20;k++)ell(x,(k*97+p*w*.1)%w,h*(1-((k*53+p*300)%100)/100),2,2,i>=2?'rgba(224,176,255,.6)':'rgba(255,255,255,.35)');
 x.setTransform(1,0,0,1,0,0);const v=x.createRadialGradient(w/2,h/2,h*.4,w/2,h/2,h*.9);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.65)');x.fillStyle=v;x.fillRect(0,0,w,h)}
function showIntro(done){const I=$('intro'),c=$('ic'),x=c.getContext('2d'),tx=$('it'),G=$('go');let t0=0,go=0,raf;
 const end=()=>{go=0;cancelAnimationFrame(raf);I.hidden=true;done()};
 const frame=ts=>{if(!go)return;raf=requestAnimationFrame(frame);if(!t0)t0=ts;const el=(ts-t0)/1000,i=Math.min(SCN.length-1,el/7|0);
  if(el>=7*SCN.length)return end();scene(x,i,(el%7)/7,c.width,c.height);tx.textContent=SCN[i].slice(0,Math.min(SCN[i].length,(el%7)*16|0))};
 I.hidden=false;G.hidden=false;tx.textContent='';c.width=innerWidth;c.height=innerHeight;scene(x,2,.5,c.width,c.height);
 $('skip').onclick=end;G.onclick=()=>{initAudio();G.hidden=true;go=1;raf=requestAnimationFrame(frame)}}
