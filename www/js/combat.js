// Cables, Cut Throat, hooks, tornado, hits, update()
function say(x,y,txt,col){fx.push({x,y,txt,col,t:0})}

function rayHit(dx,dy,range){for(let d=6;d<=range;d+=4){const px=P.x+dx*d,py=P.y+dy*d;
  if(px<=2||py<=2||px>=CFG.W-2||py>=CFG.H-2||inObs(px,py,1))return{x:px,y:py,d,hero:false}}return null}
function cableCost(){return Math.max(1,CFG.cable.cost-(now-lastC<CFG.cable.window?chain*CFG.cable.step:0))}
function cable(dir){if(S.phase!=='play'||S.paused||dash||cdC>0)return;const [dx,dy]=dir;cdC=0;buzz(10);sfx('cast',SK.eq);chain=now-lastC<CFG.cable.window?chain+1:1;lastC=now;P.fx=dx;P.fy=dy;
 const h=rayHit(dx,dy,CFG.cable.range);
 if(!h){cLine={x1:P.x,y1:P.y,x2:P.x+dx*CFG.cable.range,y2:P.y+dy*CFG.cable.range,t:.18,miss:true};say(P.x,P.y-24,'Miss',C.danger);return}
 const L=h.d-(P.r+2);if(L<2){say(P.x,P.y-24,'Too close',C.danger);return}
 cabs.push({ax:h.x,ay:h.y,ox:P.x,oy:P.y,dx,dy,hd:h.d,t:0,att:false,r:0});if(cabs.length>40)cabs.shift()}
function cut(dir){if(S.phase!=='play'||S.paused||dash||cdU>0)return;
 const d=Math.hypot(T.x-P.x,T.y-P.y);
 if(d<=CFG.cut.range){cdU=CFG.cut.cd;endFlight();const [dx,dy]=norm(T.x-P.x,T.y-P.y);P.fx=dx;P.fy=dy;const back=P.r+T.r-2;
  dash={sx:P.x,sy:P.y,tx:T.x-dx*back,ty:T.y-dy*back,speed:CFG.cut.speed,kind:'cut',hit:true};sfx('cut')}
 else say(P.x,P.y-24,'No target in range',C.danger)}
function autoDir(){return Math.hypot(joy.x,joy.y)>.3?norm(joy.x,joy.y):norm(T.x-P.x,T.y-P.y)}
// Cut Throat lands 3 hits when the dash arrives.
function arrive(){P.x=dash.tx;P.y=dash.ty;const k=dash.kind;dash=null;if(k==='cut'){sfx('cutHit');hitT(3,false)}}
// Speed from the video's timer test (same distance, same direction): 1 cable 2.04s, 2 cables 1.21s, 3 cables 1.06s, i.e. x1, x1.69, x1.92. The pair gives 1+boost*(sm-1); each cable after the 2nd adds a shrinking extra (ratio 'more'). Aligned cables (sm near 2) get the full effect.
function extraBoost(sm){let e=0,r=CFG.cable.more;for(let i=3;i<=flN;i++){e+=CFG.cable.boost*Math.pow(r,i-2)}return e*Math.max(0,sm-1)}
// Grappling hook: the hook travels out first, then anchors at the wall hit. Active anchors are a FIFO queue of 2: a 3rd attach drops the oldest.
function attach(c){const d=Math.hypot(c.ax-P.x,c.ay-P.y);
 if(d<P.r+4){c.dead=true;return}
 c.att=true;flN++;sfx('attach',SK.eq);
 const at=cabs.filter(k=>k.att&&!k.dead&&!k.dummy);
 while(at.length>2){const o=at.shift();o.dummy=true;o.dt=0}
 fl={boost:1,side:0,deg:true,t:0};
 if(at.length>1){const p1=at[0],p2=at[1],u=norm(p1.ax-P.x,p1.ay-P.y),v=norm(p2.ax-P.x,p2.ay-P.y),sm=Math.hypot(u[0]+v[0],u[1]+v[1]);
  const ex=p2.ax-p1.ax,ey=p2.ay-p1.ay,len=Math.hypot(ex,ey),sd=ex*(P.y-p1.ay)-ey*(P.x-p1.ax);
  fl={boost:1+CFG.cable.boost*(sm-1)+extraBoost(sm),side:Math.sign(sd),deg:len<6||Math.abs(sd)/len<3,dot0:u[0]*v[0]+u[1]*v[1],crossed:false,dx:(u[0]+v[0])/(sm||1),dy:(u[1]+v[1])/(sm||1),t:0}}}
function endFlight(){cabs=cabs.filter(c=>!c.att);fl=null;flN=0}
function hooks(dt){for(const c of cabs)if(c.dummy){c.dt+=dt;if(c.dt>CFG.cable.dummy)c.dead=true}
 for(const c of cabs)if(!c.att&&!c.dead){c.t+=CFG.cable.hook*dt;if(c.t>=c.hd)attach(c)}cabs=cabs.filter(c=>!c.dead)}
// Cable flight. One anchor: pull straight at it and stop there. Two anchors: fly in a straight line along the bisector of the two cables, fixed at the moment the pair forms (even if the cables are uneven), and detach once she has crossed the line P1-P2 and the angle between the cables is back to its entry value. Narrower entry angle means faster.
function flyStep(dt){const at=cabs.filter(c=>c.att&&!c.dead&&!c.dummy);if(!at.length||!fl){endFlight();return}
 const a=at[at.length-1],b=at.length>1?at[at.length-2]:null;
 fl.t+=dt;if(fl.t>10){endFlight();return}
 let dx,dy,land=null;const spd=CFG.cable.speed*fl.boost;
 if(!b||fl.deg){const t=b&&Math.hypot(b.ax-P.x,b.ay-P.y)<Math.hypot(a.ax-P.x,a.ay-P.y)?b:a;
  const ex=t.ax-P.x,ey=t.ay-P.y,d=Math.hypot(ex,ey);if(d<=P.r+2){endFlight();return}
  dx=ex/d;dy=ey/d;land=d-(P.r+2)}
 else{dx=fl.dx;dy=fl.dy}
 P.fx=dx;P.fy=dy;const st=spd*dt,step=land!==null?Math.min(st,land):st,ox=P.x,oy=P.y;
 P.x+=dx*step;P.y+=dy*step;
 if(resolve(P,P.r)){P.x=ox;P.y=oy;lose('hit wall');endFlight();return}
 if(land!==null){if(land-step<=.5)endFlight();return}
 const ex=a.ax-b.ax,ey=a.ay-b.ay,s1=ex*(P.y-b.ay)-ey*(P.x-b.ax);
 if(!fl.crossed&&Math.sign(s1)*fl.side<=0)fl.crossed=true;
 if(fl.crossed){const dotAt=(x,y)=>{const u=norm(b.ax-x,b.ay-y),v=norm(a.ax-x,a.ay-y);return u[0]*v[0]+u[1]*v[1]},g1=dotAt(P.x,P.y)-fl.dot0;
  if(g1>=0){const g0=dotAt(ox,oy)-fl.dot0,t=g0<0?-g0/(g1-g0):1;P.x=ox+(P.x-ox)*t;P.y=oy+(P.y-oy)*t;endFlight()}}}
// Auto Tornado Strike: fires when she touches an enemy mid-flight, if energy and its internal cooldown allow. Refund per hero hit.
function tornado(){const t=CFG.t1;if(now<t1cd)return;t1cd=now+t.cd;tor.push({x:P.x,y:P.y,t:0});say(P.x,P.y-44,'Tornado Strike',C.accent)}
// Each touch deals 1 hit (0.35s per-target cooldown). A kill extends the streak and pays base points plus up to +5 streak bonus.
function lose(m){if(streak>0){say(P.x,P.y-44,'Streak lost: '+m,C.danger);streak=0}}
function bumpStreak(){S.bs=Math.max(S.bs||0,streak);if(streak>S.ms){S.ms=streak;try{localStorage.setItem('cableMasterMaxStreak',S.ms)}catch(e){}}}
function hitT(n,fly){T.hp-=n;T.hit=now+.35;if(fly)tornado();
 if(T.hp>0){say(T.x,T.y-T.r-8,'-'+n,C.text);return}
 buzz(25);kf.push({x:T.x,y:T.y,r:T.r,col:T.col,big:T.n!=='Common',t:0});streak++;bumpStreak();const pts=T.pts+Math.min(streak-1,5);S.score+=pts;S.kills++;
 S.coins+=T.coin;try{localStorage.setItem('cableMasterCoins',S.coins)}catch(e){}say(T.x,T.y-20,(T.n==='Common'?'':T.n+' ')+'+'+pts+'  +'+T.coin+'c',T.col);if(streak>1)say(T.x,T.y-44,'Streak x'+streak,C.accent);
 if(S.kills%3===0){makeObs();resolve(P,P.r)}spawnT()}
function touchCheck(x0,y0,fly){const dx=P.x-x0,dy=P.y-y0,l2=dx*dx+dy*dy,t=l2?clamp(((T.x-x0)*dx+(T.y-y0)*dy)/l2,0,1):0;
 if(Math.hypot(x0+dx*t-T.x,y0+dy*t-T.y)<P.r+T.r){if(now>=T.hit)hitT(1,fly)}}

function segDist(x0,y0,x1,y1,px,py){const dx=x1-x0,dy=y1-y0,l2=dx*dx+dy*dy,t=l2?clamp(((px-x0)*dx+(py-y0)*dy)/l2,0,1):0;return Math.hypot(x0+dx*t-px,y0+dy*t-py)}
function hurt(n,why){if(inv>0||S.phase!=='play')return;inv=1;php=Math.max(0,php-n);buzz(40);say(P.x,P.y-24,'-'+n+' HP',C.danger);lose(why);if(php<=0)end()}
// Projectiles from shooting targets (the Mythic rarity). Hit = 10 HP and breaks the streak; obstacles block shots.
function projStep(dt){
 if(T&&T.shoots){T.fire-=dt;if(T.fire<=0){const [dx,dy]=norm(P.x-T.x,P.y-T.y);proj.push({x:T.x,y:T.y,vx:dx*230,vy:dy*230,r:6});T.fire=2.2}}
 for(const q of proj){q.x+=q.vx*dt;q.y+=q.vy*dt;
  if(q.x<0||q.y<0||q.x>CFG.W||q.y>CFG.H||inObs(q.x,q.y,0)){q.dead=true;continue}
  if(!dash&&inv<=0&&Math.hypot(q.x-P.x,q.y-P.y)<P.r+q.r){q.dead=true;hurt(10,'shot')}}
 proj=proj.filter(q=>!q.dead)}
function update(dt){if(S.phase!=='play'||S.paused)return;now+=dt;
 cdC=Math.max(0,cdC-dt);cdU=Math.max(0,cdU-dt);inv=Math.max(0,inv-dt);
 const px0=P.x,py0=P.y;hooks(dt);const fly0=!dash&&cabs.some(c=>c.att);
 if(dash){const dx=dash.tx-P.x,dy=dash.ty-P.y,d=Math.hypot(dx,dy),st=dash.speed*dt;
  if(d<=st)arrive();else{P.x+=dx/d*st;P.y+=dy/d*st}}
 else if(cabs.some(c=>c.att))flyStep(dt);
 else{let vx=joy.x+((keys.d||keys.arrowright)?1:0)-((keys.a||keys.arrowleft)?1:0),vy=joy.y+((keys.s||keys.arrowdown)?1:0)-((keys.w||keys.arrowup)?1:0);
  const m=Math.hypot(vx,vy);if(m>1){vx/=m;vy/=m}if(m>.05){P.fx=vx/(m>1?1:m);P.fy=vy/(m>1?1:m);const f=norm(vx,vy);P.fx=f[0];P.fy=f[1]}
  P.x+=vx*CFG.speed*dt;P.y+=vy*CFG.speed*dt;resolve(P,P.r)}
 // Streak: breaks the moment there is no active cable or dash, on a wall hit, or on a drifter hit.
 if(streak>0&&!dash&&!cabs.length)lose('Stopped');
 if(T.moving)bounce(T,dt);touchCheck(px0,py0,fly0);
 haz.forEach(h=>{bounce(h,dt);if(!dash&&inv<=0&&segDist(px0,py0,P.x,P.y,h.x,h.y)<P.r+h.r){const fly=cabs.some(c=>c.att);hurt(20,'hit');if(!fly){const [nx,ny]=norm(P.x-h.x,P.y-h.y);P.x+=nx*36;P.y+=ny*36;resolve(P,P.r)}}});
 projStep(dt);
 fx.forEach(f=>f.t+=dt);fx=fx.filter(f=>f.t<.9);kf.forEach(f=>f.t+=dt);kf=kf.filter(f=>f.t<.36);tor.forEach(f=>f.t+=dt);tor=tor.filter(f=>f.t<.35);if(cLine){cLine.t-=dt;if(cLine.t<=0)cLine=null}}
