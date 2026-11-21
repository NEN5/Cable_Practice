// Joystick, skill buttons, split-screen touch, keyboard
// Joystick
const jEl=$('joy'),kn=$('knob');let jid=null;
function jmove(e){const r=jEl.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=r.width*.4;
 let dx=e.clientX-cx,dy=e.clientY-cy;const l=Math.hypot(dx,dy);if(l>max){dx*=max/l;dy*=max/l}joy.x=dx/max;joy.y=dy/max;kn.style.transform=`translate(${dx}px,${dy}px)`}
jEl.addEventListener('pointerdown',e=>{jid=e.pointerId;jEl.setPointerCapture(jid);jmove(e)});
jEl.addEventListener('pointermove',e=>{if(e.pointerId===jid)jmove(e)});
const jend=e=>{if(e.pointerId===jid){jid=null;joy.x=joy.y=0;kn.style.transform=''}};
jEl.addEventListener('pointerup',jend);jEl.addEventListener('pointercancel',jend);

// Skill buttons: tap = auto-aim, hold and drag = manual aim
function bindSkill(el,kind){let id=null,cx=0,cy=0;
 el.addEventListener('pointerdown',e=>{if(S.phase!=='play'||S.paused)return;id=e.pointerId;el.setPointerCapture(id);const r=el.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;aim={kind,dx:0,dy:0,drag:false}});
 el.addEventListener('pointermove',e=>{if(e.pointerId!==id||!aim)return;const vx=e.clientX-cx,vy=e.clientY-cy,l=Math.hypot(vx,vy);aim.drag=l>16;if(aim.drag){aim.dx=vx/l;aim.dy=vy/l}});
 el.addEventListener('pointerup',e=>{if(e.pointerId!==id||!aim)return;const d=aimDir();aim=null;id=null;kind==='cable'?cable(d):cut(d)});
 el.addEventListener('pointercancel',()=>{aim=null;id=null})}
bindSkill($('cab'),'cable');bindSkill($('ult'),'cut');

// Split screen: left half = movement (touch anywhere, floating joystick); right half = skills (swipe to fire a cable that way, tap to fire toward the tap). Each touch only controls its own half, so holding a skill button never fires a second cable from the left side.
const SWIPE=24,mid=()=>innerWidth/2;let lj=null;
const ljEnd=()=>{lj=null;joy.x=joy.y=0;kn.style.transform=''};
cv.addEventListener('pointerdown',e=>{if(S.phase!=='play'||S.paused)return;
 if(e.clientX<mid()){if(lj||jid!==null)return;lj={id:e.pointerId,x0:e.clientX,y0:e.clientY};try{cv.setPointerCapture(e.pointerId)}catch(_){}return}
 /* Right half of the arena does nothing: cables are cast only with the Steel Cables button (or Q on a keyboard). */});
cv.addEventListener('pointermove',e=>{
 if(lj&&e.pointerId===lj.id){const max=55;let dx=e.clientX-lj.x0,dy=e.clientY-lj.y0;const l=Math.hypot(dx,dy);if(l>max){dx*=max/l;dy*=max/l}joy.x=dx/max;joy.y=dy/max;const k=jEl.getBoundingClientRect().width*.4/max;kn.style.transform=`translate(${dx*k}px,${dy*k}px)`;return}
 if(sw&&e.pointerId===sw.id){const dx=e.clientX-sw.x0,dy=e.clientY-sw.y0;if(Math.hypot(dx,dy)>SWIPE){sw.drag=true;sw.dir=norm(dx,dy)}}});
cv.addEventListener('pointerup',e=>{if(lj&&e.pointerId===lj.id){ljEnd();return}
 if(!sw||e.pointerId!==sw.id)return;const s=sw;sw=null;if(S.phase!=='play')return;let d;
 if(s.drag)d=s.dir;else{const r=cv.getBoundingClientRect();d=norm((e.clientX-r.left-ox)/sc-P.x,(e.clientY-r.top-oy)/sc-P.y)}cable(d)});
cv.addEventListener('pointercancel',e=>{if(lj&&e.pointerId===lj.id)ljEnd();if(sw&&e.pointerId===sw.id)sw=null});
// Keyboard and mouse
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;if(S.phase!=='play'||S.paused)return;
 if(k==='q'){let d;if(mouse)d=norm(mouse.x-P.x,mouse.y-P.y);else d=autoDir();cable(d)}
 if(k==='e'||k===' '){e.preventDefault();cut(norm(T.x-P.x,T.y-P.y))}});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mouse={x:(e.clientX-r.left-ox)/sc,y:(e.clientY-r.top-oy)/sc}});
