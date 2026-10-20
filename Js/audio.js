'use strict';
// Audio procedural (WebAudio): música generativa por civilización, viento y pájaros, tambores de batalla y efectos
let AC=null,MUTE=0,MG,NB,fight=0,nt=0,stp=0;
const SC=[0,3,5,7,10,12,15],RS=[0,2,3,5,7,8,10,1,4];
function initAudio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(_){AC=null;return}setupAudio();setInterval(sched,250)}
function setupAudio(){MG=AC.createGain();MG.gain.value=MUTE?0:.5;MG.connect(AC.destination);
 NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const w=AC.createBufferSource(),f=AC.createBiquadFilter(),gn=AC.createGain(),lf=AC.createOscillator(),lg=AC.createGain();
 w.buffer=NB;w.loop=true;f.type='bandpass';f.frequency.value=500;f.Q.value=.6;gn.gain.value=.05;lf.frequency.value=.12;lg.gain.value=.03;
 lf.connect(lg);lg.connect(gn.gain);w.connect(f);f.connect(gn);gn.connect(MG);w.start();lf.start();nt=AC.currentTime+.1}
function setMute(){MUTE=1-MUTE;if(MG)MG.gain.value=MUTE?0:.5;const m=$('mu');if(m)m.textContent=MUTE?'🔇':'🔊'}
function tone(f,t,d,ty,v,lp){const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 let n=o;if(lp){const q=AC.createBiquadFilter();q.type='lowpass';q.frequency.value=lp;o.connect(q);n=q}n.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.05)}
function hitN(t,d,v,hp){const s=AC.createBufferSource(),q=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;q.type='highpass';q.frequency.value=hp;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(q);q.connect(g);g.connect(MG);s.start(t);s.stop(t+d)}
function drum(t,f,v){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(f*2,t);o.frequency.exponentialRampToValueAtTime(f/2,t+.15);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(g);g.connect(MG);o.start(t);o.stop(t+.22)}
function bird(t){const f=2200+Math.random()*1200,o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.4,t+.08);o.frequency.exponentialRampToValueAtTime(f*.9,t+.18);g.gain.setValueAtTime(.025,t);g.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(g);g.connect(MG);o.start(t);o.stop(t+.22)}
function step(t,i,fl){const c=typeof S!='undefined'&&S?S.civ[0]:0,b=110*2**(RS[c]/12),q=60/(fl?132:84);
 if(i%16==0)tone(b/2,t,q*8,'triangle',.06,400);
 if(i%2==0&&Math.random()<(fl?.9:.55))tone(b*2**((SC[Math.random()*SC.length|0]+(Math.random()<.3?12:0))/12),t,q*1.5,fl?'sawtooth':'triangle',fl?.035:.06,fl?1200:2400);
 if(fl){if(i%4==0)drum(t,70,.22);if(i%8==4)hitN(t,.1,.1,1800)}else if(i%8==0)drum(t,55,.1)}
function sched(){if(!AC||MUTE)return;const now=AC.currentTime,fl=fight>.3;fight=Math.max(0,fight-.02);if(nt<now)nt=now;
 while(nt<now+.6){step(nt,stp++,fl);nt+=60/(fl?132:84)/2}
 if(!fl&&Math.random()<.05)bird(now+.1)}
const arp=(a,t,s,ty,d,v)=>a.forEach((f,i)=>tone(f,t+i*s,d,ty,v));
function snd(n){if(!AC||MUTE)return;const t=AC.currentTime;
 if(n=='hit'){fight=Math.min(1,fight+.12);hitN(t,.08,.12,1500);tone(240+Math.random()*120,t,.08,'square',.05,2000)}
 else if(n=='spawn')arp([523,784],t,.09,'sine',.15,.08);
 else if(n=='done')arp([392,494,587],t,.1,'triangle',.2,.1);
 else if(n=='age')arp([262,330,392,523],t,.14,'triangle',.4,.1);
 else if(n=='rift')arp([880,1108,1318],t,.06,'sine',.3,.07);
 else if(n=='heal'){tone(988,t,.25,'sine',.04);tone(1318,t+.07,.25,'sine',.03)}
 else if(n=='win')arp([392,523,659,784],t,.18,'triangle',.5,.12);
 else if(n=='lose')arp([220,185,147,110],t,.25,'sawtooth',.5,.07);
 else tone(660,t,.04,'square',.03)}
