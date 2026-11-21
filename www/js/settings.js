// Settings, saved config, Edit UI
// ---- Settings (saved in localStorage) ----
const DEF={cutcd:25,pull:700,zoom:1,joy:1,cab:1,ult:1,ov:false,fps:false,snd:true,sfx:.7,music:.5,noobs:false,vib:false,noen:false,en:1,op:{joy:1,en:1,cab:1,ult:1},pos:{joy:[0,0],en:[0,0],cab:[0,0],ult:[0,0]}};
let cfg=JSON.parse(JSON.stringify(DEF));
try{const o=JSON.parse(localStorage.getItem('fannySettings')||'null');
 if(o&&typeof o==='object'){for(const k in DEF)if(k!=='pos'&&k!=='op'&&typeof o[k]===typeof DEF[k])cfg[k]=o[k];
  if(o.pos)for(const k in DEF.pos)if(Array.isArray(o.pos[k])&&o.pos[k].length===2)cfg.pos[k]=[+o.pos[k][0]||0,+o.pos[k][1]||0];
  if(o.op)for(const k in DEF.op)if(typeof o.op[k]==='number')cfg.op[k]=clamp(o.op[k],.2,1)}}catch(e){}
const saveCfg=()=>{try{localStorage.setItem('fannySettings',JSON.stringify(cfg))}catch(e){}};
const UI={joy:$('joy'),en:$('en'),cab:$('cab'),ult:$('ult')};
function place(){const w=innerWidth,h=innerHeight;for(const k in UI){const p=cfg.pos[k];let t=(p[0]||p[1])?`translate(${p[0]*w}px,${p[1]*h}px)`:'';if(k==='en')t+=` scale(${cfg.en})`;UI[k].style.transform=t;UI[k].style.opacity=cfg.op[k]}}
function applyCfg(){musicSync();CFG.cable.cd=0;CFG.cut.cd=cfg.cutcd;CFG.cable.speed=cfg.pull;if(MG)MG.gain.value=cfg.sfx;$('fps').hidden=!cfg.fps;
 const rs=document.documentElement.style;rs.setProperty('--jk',cfg.joy);rs.setProperty('--ck',cfg.cab);rs.setProperty('--uk',cfg.ult);
 document.body.classList.toggle('ov',cfg.ov);cdC=0;cdU=Math.min(cdU,cfg.cutcd);place();resize()}
// Zoom above 100% follows the player; at 100% or below the whole arena is shown.
function view(){const base=Math.min(cw/CFG.W,ch/CFG.H)*.97;sc=base*cfg.zoom;const vw=cw/sc,vh=ch/sc;
 ox=vw>=CFG.W?(cw-CFG.W*sc)/2:-clamp(P.x-vw/2,0,CFG.W-vw)*sc;
 oy=vh>=CFG.H?(ch-CFG.H*sc)/2:-clamp(P.y-vh/2,0,CFG.H-vh)*sc}
const pct=v=>Math.round(v*100)+'%';
const FIELDS=[
 ['cutcd','Cut Throat cooldown',0,60,1,v=>v+' s'],
 ['pull','Cable pull speed',300,1500,25,v=>String(v)],
 ['sfx','Sound effects volume',0,1,.05,pct],
 ['music','Music volume',0,1,.05,pct],
 ['zoom','Zoom',.5,2,.05,pct]];
const syncs=[];
FIELDS.forEach(([k,label,min,max,step,fmt])=>{const row=document.createElement('label');row.className='row';
 row.innerHTML=`<span>${label}</span><output></output><div class="trk"><input type="range" min="${min}" max="${max}" step="${step}"></div>`;
 const inp=row.querySelector('input'),out=row.querySelector('output');
 const sync=()=>{inp.value=cfg[k];out.textContent=fmt(cfg[k])};sync();syncs.push(sync);
 inp.oninput=()=>{cfg[k]=+inp.value;out.textContent=fmt(cfg[k]);applyCfg();saveCfg()};
 // Sliders ignore a raw touch-down, so a swipe that starts on one just scrolls the panel. A horizontal drag or a tap sets the value.
 const trk=row.querySelector('.trk');let g=null;
 const setFrom=x=>{const r=inp.getBoundingClientRect(),f=clamp((x-r.left-9)/Math.max(1,r.width-18),0,1);inp.value=min+f*(max-min);inp.oninput()};
 trk.addEventListener('pointerdown',e=>{g={x:e.clientX,y:e.clientY,id:e.pointerId,drag:e.pointerType!=='touch'};if(g.drag){trk.setPointerCapture(e.pointerId);setFrom(e.clientX)}});
 trk.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;if(!g.drag){const dx=Math.abs(e.clientX-g.x),dy=Math.abs(e.clientY-g.y);if(dx>8&&dx>dy){g.drag=true;trk.setPointerCapture(e.pointerId)}}if(g.drag)setFrom(e.clientX)});
 trk.addEventListener('pointerup',e=>{if(g&&e.pointerId===g.id&&!g.drag&&Math.hypot(e.clientX-g.x,e.clientY-g.y)<8)setFrom(e.clientX);g=null});
 trk.addEventListener('pointercancel',()=>{g=null});
 $('rows').appendChild(row)});
$('sndchk').checked=cfg.snd;$('ovchk').checked=cfg.ov;$('noobchk').checked=cfg.noobs;$('vibchk').checked=cfg.vib;$('fpschk').checked=cfg.fps;$('noenchk').checked=cfg.noen;
let editing=false;
const syncPause=()=>{S.paused=!$('sheet').hidden||editing||!$('shop').hidden};
$('gear').onclick=()=>{$('sheet').hidden=!$('sheet').hidden;syncPause()};
$('sclose').onclick=()=>{$('sheet').hidden=true;syncPause()};
$('noobchk').onchange=e=>{cfg.noobs=e.target.checked;saveCfg();if(S.phase==='play'){makeObs();resolve(P,P.r);spawnT()}};
$('vibchk').onchange=e=>{cfg.vib=e.target.checked;saveCfg();if(cfg.vib)buzz(30)};
$('fpschk').onchange=e=>{cfg.fps=e.target.checked;saveCfg();applyCfg()};
$('noenchk').onchange=e=>{cfg.noen=e.target.checked;saveCfg();if(S.phase==='play')makeHaz()};
$('ovchk').onchange=e=>{cfg.ov=e.target.checked;applyCfg();saveCfg()};
$('sndchk').onchange=e=>{cfg.snd=e.target.checked;saveCfg();if(cfg.snd)sfx('cast',SK.eq)};
$('sedit').onclick=()=>{$('sheet').hidden=true;editing=true;document.body.classList.add('edit');$('editbar').hidden=false;syncPause()};
$('edone').onclick=()=>{editing=false;document.body.classList.remove('edit');$('editbar').hidden=true;selCtl(null);syncPause();saveCfg()};
let sel=null;const NAMES={joy:'Joystick',en:'HP bar',cab:'Steel Cables',ult:'Cut Throat'};
function slider(parent,label,min,max,step,get,set,fmt){const row=document.createElement('div');row.className='row';
 row.innerHTML=`<span>${label}</span><output></output><div class="trk"><input type="range" min="${min}" max="${max}" step="${step}"></div>`;
 const inp=row.querySelector('input'),out=row.querySelector('output'),trk=row.querySelector('.trk');
 const show=()=>{inp.value=get();out.textContent=fmt(get())};show();
 const setFrom=x=>{const r=inp.getBoundingClientRect(),f=clamp((x-r.left-9)/Math.max(1,r.width-18),0,1);set(+(min+f*(max-min)).toFixed(2));saveCfg();show()};
 let id=null;
 trk.addEventListener('pointerdown',e=>{id=e.pointerId;trk.setPointerCapture(id);setFrom(e.clientX)});
 trk.addEventListener('pointermove',e=>{if(e.pointerId===id)setFrom(e.clientX)});
 const up=e=>{if(e.pointerId===id)id=null};trk.addEventListener('pointerup',up);trk.addEventListener('pointercancel',up);
 parent.appendChild(row)}
// Selecting a control in Edit UI shows its own size and opacity sliders.
function selCtl(k){sel=k;for(const j in UI)UI[j].classList.toggle('sel',j===k);$('epanel').hidden=!k;if(!k)return;
 $('ename').textContent=NAMES[k];const rows=$('erows');rows.innerHTML='';
 slider(rows,'Size',.6,1.8,.05,()=>cfg[k],v=>{cfg[k]=v;applyCfg()},pct);
 slider(rows,'Opacity',.2,1,.05,()=>cfg.op[k],v=>{cfg.op[k]=v;applyCfg()},pct)}
$('ereset').onclick=()=>{if(!sel)return;cfg[sel]=1;cfg.op[sel]=1;cfg.pos[sel]=[0,0];applyCfg();saveCfg();selCtl(sel)};
$('sall').onclick=()=>{cfg=JSON.parse(JSON.stringify(DEF));syncs.forEach(f=>f());$('ovchk').checked=false;$('noobchk').checked=false;$('vibchk').checked=false;$('fpschk').checked=false;$('noenchk').checked=false;$('sndchk').checked=true;applyCfg();saveCfg();if(S.phase==='play'){makeObs();resolve(P,P.r);makeHaz();proj=[];spawnT()}};
// Layout editing: drag any control; positions are stored as fractions of the screen.
Object.entries(UI).forEach(([k,el])=>{el.classList.add('ed');let id=null,sx=0,sy=0,p0=[0,0],r0=null;
 el.addEventListener('pointerdown',e=>{if(!editing)return;selCtl(k);e.stopImmediatePropagation();e.preventDefault();id=e.pointerId;el.setPointerCapture(id);
  sx=e.clientX;sy=e.clientY;p0=[cfg.pos[k][0]*innerWidth,cfg.pos[k][1]*innerHeight];r0=el.getBoundingClientRect()},true);
 el.addEventListener('pointermove',e=>{if(id===null||e.pointerId!==id)return;e.stopImmediatePropagation();
  const dx=clamp(e.clientX-sx,-r0.left,innerWidth-r0.right),dy=clamp(e.clientY-sy,-r0.top,innerHeight-r0.bottom);
  cfg.pos[k]=[(p0[0]+dx)/innerWidth,(p0[1]+dy)/innerHeight];place()},true);
 const up=e=>{if(id===null||e.pointerId!==id)return;e.stopImmediatePropagation();id=null;saveCfg()};
 el.addEventListener('pointerup',up,true);el.addEventListener('pointercancel',up,true)});
addEventListener('resize',place);
applyCfg();
