// Synthesized sound effects + background music
// ---- Sound (synthesized with Web Audio, no files). Normal skins share one sound; every higher tier has its own cast and hook-attach sound. ----
let AC=null,MG=null,DL=null,NB=null;
function audio(){return cfg.snd?actx():null}
function actx(){
 if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();
  MG=AC.createGain();MG.gain.value=cfg.sfx;const cp=AC.createDynamicsCompressor();MG.connect(cp);cp.connect(AC.destination);
  DL=AC.createDelay(.5);DL.delayTime.value=.19;const fb=AC.createGain();fb.gain.value=.38;const wt=AC.createGain();wt.gain.value=.5;DL.connect(fb);fb.connect(DL);DL.connect(wt);wt.connect(MG);
  NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){AC=null;return null}}
 if(AC.state==='suspended')AC.resume();return AC}
function tone(o){const c=AC,t0=c.currentTime+(o.t||0),osc=c.createOscillator(),g=c.createGain();osc.type=o.type||'sine';
 osc.frequency.setValueAtTime(o.f,t0);if(o.f2)osc.frequency.exponentialRampToValueAtTime(o.f2,t0+o.d);
 if(o.vib){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(osc.frequency);l.start(t0);l.stop(t0+o.d+.05)}
 g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(o.g||.2,t0+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,t0+o.d);
 osc.connect(g);let out=g;if(o.lp){const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;g.connect(f);out=f}
 out.connect(MG);if(o.wet){const w=c.createGain();w.gain.value=o.wet;out.connect(w);w.connect(DL)}
 osc.start(t0);osc.stop(t0+o.d+.05)}
function nz(o){const c=AC,t0=c.currentTime+(o.t||0),s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=NB;s.loop=true;
 f.type=o.type||'bandpass';f.Q.value=o.q||1;f.frequency.setValueAtTime(o.f,t0);if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t0+o.d);
 g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(o.g||.2,t0+(o.a||.005));g.gain.exponentialRampToValueAtTime(.0001,t0+o.d);
 s.connect(f);f.connect(g);g.connect(MG);if(o.wet){const w=c.createGain();w.gain.value=o.wet;g.connect(w);w.connect(DL)}
 s.start(t0,Math.random()*.5);s.stop(t0+o.d+.05)}
const crackle=(n,span,g,f)=>{for(let i=0;i<n;i++)nz({t:Math.random()*span,d:.025,type:'highpass',f:f*(.8+Math.random()*.5),g:g*(.5+Math.random()),a:.001})};
const castBase=()=>{nz({d:.02,type:'highpass',f:6000,g:.2,a:.001});nz({d:.16,f:500,f2:4200,q:1.4,g:.3});tone({f:700,f2:1900,d:.09,type:'triangle',g:.12});tone({f:230,f2:120,d:.12,g:.1})};
const hitBase=()=>{tone({f:190,f2:70,d:.13,g:.35});nz({d:.05,f:1300,q:1.5,g:.2});tone({f:1800,d:.06,type:'triangle',g:.08})};
const SND={
 cast:{base:castBase,
  ember(){nz({d:.2,f:400,f2:2800,q:1.2,g:.25});tone({f:160,f2:320,d:.22,type:'sawtooth',lp:900,g:.1});crackle(6,.25,.12,5000)},
  frost(){nz({d:.18,f:1500,f2:6000,q:2,g:.22});[2093,2637,3136].forEach((f,i)=>tone({f,d:.35,g:.09,t:i*.035,wet:.3}))},
  jade(){nz({d:.2,f:300,f2:1800,g:.2});tone({f:330,f2:660,d:.22,g:.16,vib:[14,18]});tone({f:660,f2:990,d:.18,t:.05,type:'triangle',g:.08})},
  sunset(){nz({d:.18,f:500,f2:3000,g:.22});[392,494,587,784].forEach((f,i)=>tone({f,d:.25,type:'triangle',g:.08,t:i*.04,wet:.25}))},
  royal(){nz({d:.2,f:800,f2:5000,q:1.2,g:.28});tone({f:440,f2:880,d:.14,type:'sawtooth',lp:2500,g:.08});[659,880,1319].forEach((f,i)=>tone({f,d:.5,g:i<2?.1:.08,t:.02+i*.035,wet:.3}));tone({f:3520,d:.3,t:.1,g:.05})},
  aurora(){tone({f:220,f2:440,d:.45,a:.1,type:'sawtooth',lp:1800,g:.07,wet:.4});tone({f:223,f2:446,d:.45,a:.1,type:'sawtooth',lp:1800,g:.07,wet:.4});[1047,1319,1568,1760,2093].forEach((f,i)=>tone({f,d:.3,g:.05,t:i*.06,wet:.5}))},
  phoenix(){nz({d:.4,type:'lowpass',f:200,f2:2500,g:.45,a:.05});tone({f:400,f2:1600,d:.3,type:'sawtooth',lp:2600,g:.09});tone({f:90,f2:60,d:.3,g:.25});crackle(10,.4,.14,3500)},
  celestia(){[523,659,784,1047].forEach(f=>tone({f,d:.7,a:.08,g:.06,wet:.5}));nz({d:.3,f:2000,f2:7000,g:.1});tone({f:2093,d:.5,t:.1,g:.05,wet:.6});tone({f:3136,d:.5,t:.2,g:.05,wet:.6})}},
 attach:{base:hitBase,
  ember(){hitBase();tone({f:120,f2:50,d:.2,g:.25});crackle(8,.2,.12,4500)},
  frost(){tone({f:200,f2:90,d:.08,g:.2});tone({f:3136,d:.35,g:.1,wet:.3});tone({f:4186,d:.3,t:.01,g:.07,wet:.3});nz({d:.05,type:'highpass',f:7000,g:.15})},
  jade(){tone({f:180,f2:80,d:.1,g:.2});tone({f:523,d:.4,type:'triangle',g:.22});tone({f:1046,d:.2,g:.08})},
  sunset(){tone({f:180,f2:80,d:.1,g:.2});tone({f:784,d:.5,g:.12,wet:.3});tone({f:1175,d:.4,g:.07,wet:.3})},
  royal(){tone({f:160,f2:70,d:.15,g:.3});nz({d:.04,f:5000,q:2,g:.15});tone({f:2349,d:.6,g:.1,wet:.3});tone({f:3520,d:.5,g:.07,wet:.3})},
  aurora(){tone({f:180,f2:80,d:.1,g:.22});[392,494,587,740].forEach((f,i)=>tone({f,d:.6,a:.02,g:.06,t:i*.02,wet:.5}))},
  phoenix(){tone({f:130,f2:38,d:.35,g:.5});nz({d:.3,type:'lowpass',f:800,f2:100,g:.4});crackle(10,.3,.12,3500)},
  celestia(){tone({f:180,f2:80,d:.1,g:.2});[1047,1319,1568,2093].forEach((f,i)=>tone({f,d:.8,g:.07,t:i*.04,wet:.6}))}}};
function sfx(kind,id){if(!audio())return;try{(SND[kind][id]||SND[kind].base)()}catch(e){}}
// ---- Background music: assets/bgm.mp3 loops. 0% = paused. ----
// Where audio.volume can be set (Android WebView, Chrome, desktop) the track plays straight through the <audio> element.
// Only where volume is read-only (iOS) is it routed through a gain node. Routing everywhere could end up silent
// (suspended context, ringer switch), and the old code swallowed play() errors so there was no way to see why.
var BG=null,BGG=null,bgOn=false,bgVolOK=null;
function volSettable(){if(bgVolOK===null){try{const a=new Audio();a.volume=.5;bgVolOK=a.volume===.5}catch(e){bgVolOK=true}}return bgVolOK}
function musicSync(){if(!BG)return;
 if(BGG)BGG.gain.value=cfg.music;else BG.volume=cfg.music;
 if(!bgOn)return;
 if(cfg.music>0&&!document.hidden){if(BG.paused){const p=BG.play();if(p&&p.catch)p.catch(e=>console.warn('Music play() was blocked, retrying on the next tap:',e&&e.name))}}else BG.pause()}
function musicStart(){BG=BG||$('bgm');if(!BG)return;
 if(!BG._err){BG._err=1;BG.addEventListener('error',()=>console.warn('Music failed to load, media error code',BG.error&&BG.error.code))}
 if(!BGG&&!volSettable()&&actx()){try{const s=AC.createMediaElementSource(BG);BGG=AC.createGain();s.connect(BGG);BGG.connect(AC.destination)}catch(e){BGG=null}}
 bgOn=true;musicSync()}
// Browsers only allow audio after a user gesture (touch counts on release), so unlock on the first press, release or key.
['pointerdown','pointerup','keydown'].forEach(ev=>addEventListener(ev,()=>{audio();musicStart()},{passive:true}));
document.addEventListener('visibilitychange',musicSync);
