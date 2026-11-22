// draw(), HUD, shop previews, main loop()
function draw(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cw*dpr,ch*dpr);if(P)view();
 ctx.setTransform(dpr*sc,0,0,dpr*sc,dpr*ox,dpr*oy);const W=CFG.W,H=CFG.H;
 drawArena();
 if(!P)return;
 haz.forEach(h=>{ctx.fillStyle=C.danger;ctx.globalAlpha=.18;ctx.beginPath();ctx.arc(h.x,h.y,h.r+6,0,7);ctx.fill();ctx.globalAlpha=.7;ctx.strokeStyle=C.danger;ctx.lineWidth=1.5;ctx.setLineDash([3,5]);ctx.lineDashOffset=-performance.now()/40;ctx.beginPath();ctx.arc(h.x,h.y,h.r+9,0,7);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,7);ctx.fill()});
 proj.forEach(q=>{ctx.fillStyle='#d9689a';ctx.globalAlpha=.25;ctx.beginPath();ctx.arc(q.x,q.y,q.r+4,0,7);ctx.fill();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.fill()});
 if(T&&S.phase!=='menu'){ctx.strokeStyle=T.col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(T.x,T.y,T.r,0,7);ctx.stroke();ctx.globalAlpha=now<T.hit?.45:1;ctx.fillStyle=T.col;ctx.beginPath();ctx.arc(T.x,T.y,T.r-7,0,7);ctx.fill();ctx.globalAlpha=1;
  if(T.shoots){if(T.fire<.5){ctx.globalAlpha=.5;ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(T.x,T.y);ctx.lineTo(P.x,P.y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
   const r=T.r+5;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(T.x,T.y-r);ctx.lineTo(T.x+r,T.y);ctx.lineTo(T.x,T.y+r);ctx.lineTo(T.x-r,T.y);ctx.closePath();ctx.stroke()}
  if(T.max>1){ctx.lineWidth=4;ctx.beginPath();ctx.arc(T.x,T.y,T.r+6,-Math.PI/2,-Math.PI/2+6.283*T.hp/T.max);ctx.stroke()}
  }
 tor.forEach(f=>{const k=f.t/.35;ctx.globalAlpha=1-k;ctx.strokeStyle=C.accent;ctx.lineWidth=4;ctx.beginPath();ctx.arc(f.x,f.y,CFG.t1.r*(.3+.7*k),0,7);ctx.stroke()});ctx.globalAlpha=1;
 const at2=cabs.filter(c=>c.att).slice(-2),sk=curSkin(),tt=performance.now()/1000;
 cabs.forEach(c=>{const tx=c.att?c.ax:c.ox+c.dx*c.t,ty=c.att?c.ay:c.oy+c.dy*c.t;drawCable(ctx,P.x,P.y,tx,ty,sk,(!c.att||at2.includes(c))?1:.35,tt,3)});ctx.globalAlpha=1;
 if(cLine){ctx.globalAlpha=Math.max(0,cLine.t/.18);ctx.strokeStyle=C.danger;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cLine.x1,cLine.y1);ctx.lineTo(cLine.x2,cLine.y2);ctx.stroke();ctx.globalAlpha=1}
 if(aim&&S.phase==='play'){ctx.strokeStyle=aim.kind==='cable'?C.accent:C.danger;ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();
  if(aim.kind==='cable'){const d=aimDir();ctx.moveTo(P.x,P.y);ctx.lineTo(P.x+d[0]*CFG.cable.range,P.y+d[1]*CFG.cable.range)}else ctx.arc(P.x,P.y,CFG.cut.range,0,7);ctx.stroke();ctx.setLineDash([])}
 if(sw&&sw.drag&&S.phase==='play'){const d=sw.dir,h=rayHit(d[0],d[1],CFG.cable.range),L=h?h.d:CFG.cable.range;ctx.strokeStyle=C.accent;ctx.lineWidth=2;ctx.globalAlpha=.7;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(P.x,P.y);ctx.lineTo(P.x+d[0]*L,P.y+d[1]*L);ctx.stroke();ctx.setLineDash([]);if(h){ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(h.x,h.y,5,0,7);ctx.fill()}ctx.globalAlpha=1}
 ctx.globalAlpha=inv>0&&Math.floor(inv*10)%2?.4:1;ctx.fillStyle=C.player;ctx.beginPath();ctx.arc(P.x,P.y,P.r,0,7);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.stroke();
 ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(P.x+P.fx*(P.r-3),P.y+P.fy*(P.r-3),5,0,7);ctx.fill();ctx.globalAlpha=1;
 ctx.font='700 22px "Barlow Condensed","Roboto Condensed",sans-serif';ctx.textAlign='center';ctx.lineJoin='round';ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.6)';fx.forEach(f=>{ctx.globalAlpha=1-f.t/.9;const y=f.y-f.t*40;ctx.strokeText(f.txt,f.x,y);ctx.fillStyle=f.col;ctx.fillText(f.txt,f.x,y)});ctx.globalAlpha=1}
function aimDir(){return aim.drag?[aim.dx,aim.dy]:(aim.kind==='cable'?autoDir():norm(T.x-P.x,T.y-P.y))}

// HUD: only touch the DOM when a value actually changed (the WebView re-styles the page on every write).
const hv={},ultCd=$('ult').querySelector('.cd'),ultN=$('ult').querySelector('.cdn');
function setT(id,v){if(hv[id]!==v){hv[id]=v;$(id).textContent=v}}
function setS(id,p,v){const el=typeof id==='string'?$(id):id,k=(typeof id==='string'?id:id.parentNode.id)+p;if(hv[k]!==v){hv[k]=v;el.style[p]=v}}
let lc=S.coins;
function hud(){if(S.coins!==lc){lc=S.coins;const el=$('coinui');el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}
 setT('mx',S.ms);setT('bs',Math.max(S.best,S.score));setT('sc',S.score);setT('stk',streak?'x'+streak:'0');setT('cn',S.coins);
 const h=php==null?CFG.hp:php;setS('fill','width',Math.round(h/CFG.hp*200)/2+'%');setS('fill','background',h<30?'var(--danger)':'var(--ok)');setT('enT',Math.ceil(h));
 const low=cdU>0,e=low?Math.round((1-cdU/(CFG.cut.cd||1))*200)/2:100,n=low?Math.ceil(cdU):'';
 if(hv.e!==e){hv.e=e;ultCd.style.setProperty('--e',e+'%')}
 if(hv.cdn!==n){hv.cdn=n;ultN.textContent=n}
 if(hv.low!==low){const u=$('ult');u.classList.toggle('low',low);if(hv.low===true&&!low){u.classList.remove('rdy');void u.offsetWidth;u.classList.add('rdy')}hv.low=low}
 const a1=!!(aim&&aim.kind==='cable'),a2=!!(aim&&aim.kind==='cut');
 if(hv.a1!==a1){hv.a1=a1;$('cab').classList.toggle('aim',a1)}
 if(hv.a2!==a2){hv.a2=a2;$('ult').classList.toggle('aim',a2)}}
let last=performance.now();
let fpsA=0,fpsN=0,skipF=0;
function fpsTick(d){fpsA+=d;fpsN++;if(fpsA>=.5){$('fps').textContent=Math.round(fpsN/fpsA)+' FPS \u00b7 '+(fpsA/fpsN*1000).toFixed(1)+' ms';fpsA=0;fpsN=0}}
function loop(t){const raw=Math.max(0,(t-last)/1000),dt=Math.min(.05,raw);last=t;
 const n=Math.max(1,Math.ceil(dt*120-1e-6));for(let i=0;i<n;i++)update(dt/n);
 const idle=S.phase!=='play'||S.paused;if(!idle||(skipF^=1))draw();hud();if(!$('shop').hidden)shopDraw();if(cfg.fps&&raw>0)fpsTick(raw);requestAnimationFrame(loop)}
