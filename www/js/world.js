// Arena: obstacles, hazards, targets, bouncing
function resolve(o,r){let hit=false;
 const W=CFG.W,H=CFG.H;
 if(o.x<r){o.x=r;hit=true}if(o.x>W-r){o.x=W-r;hit=true}if(o.y<r){o.y=r;hit=true}if(o.y>H-r){o.y=H-r;hit=true}
 for(const b of obs){const cx=clamp(o.x,b.x,b.x+b.w),cy=clamp(o.y,b.y,b.y+b.h);let dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy);
  if(d<r){hit=true;if(d>0){o.x=cx+dx/d*r;o.y=cy+dy/d*r}else{const l=o.x-b.x,rr=b.x+b.w-o.x,t=o.y-b.y,bt=b.y+b.h-o.y,m=Math.min(l,rr,t,bt);
   if(m===l)o.x=b.x-r;else if(m===rr)o.x=b.x+b.w+r;else if(m===t)o.y=b.y-r;else o.y=b.y+b.h+r}}}
 return hit}
function inObs(x,y,m){return obs.some(b=>x>b.x-m&&x<b.x+b.w+m&&y>b.y-m&&y<b.y+b.h+m)}
function makeObs(){obs=[];arenaDirty=true;if(cfg.noobs)return;const n=Math.round((5+Math.floor(Math.random()*3))*CFG.W/1000);
 for(let i=0,t=0;i<n&&t<200;t++){const w=rnd(50,150),h=rnd(36,120),x=rnd(60,CFG.W-w-60),y=rnd(50,CFG.H-h-50);
  const b={x,y,w,h};if(Math.hypot(x+w/2-P.x,y+h/2-P.y)<Math.max(w,h)/2+90)continue;
  if(obs.some(o=>x<o.x+o.w+40&&x+w+40>o.x&&y<o.y+o.h+40&&y+h+40>o.y))continue;obs.push(b);i++}}
function makeHaz(){haz=[];if(cfg.noen)return;for(let i=0,n=Math.round(3*CFG.W/1000);i<n;i++){let x,y,k=0;do{x=rnd(40,CFG.W-40);y=rnd(40,CFG.H-40)}while((inObs(x,y,20)||Math.hypot(x-P.x,y-P.y)<200)&&k++<80);
 const a=rnd(0,6.28);haz.push({x,y,r:12,vx:Math.cos(a)*65,vy:Math.sin(a)*65})}}
function spawnT(){let x,y,k=0;do{x=rnd(40,CFG.W-40);y=rnd(40,CFG.H-40)}while((inObs(x,y,24)||Math.hypot(x-P.x,y-P.y)<260)&&k++<150);
 const a=rnd(0,6.28),moving=Math.random()<.5,ty=pickTy(),v=moving?(85+S.kills*4)*ty.sp:0;
 T={x,y,r:ty.r,hp:ty.hp,max:ty.hp,pts:ty.pts,coin:ty.coin,n:ty.n,col:ty.col,shoots:!!ty.shoots,fire:1.5,hit:0,moving,vx:Math.cos(a)*v,vy:Math.sin(a)*v,born:now,marks:0}}
function bounce(o,dt){let nx=o.x+o.vx*dt;const t={x:nx,y:o.y};if(resolve({x:nx,y:o.y},o.r)&&(nx!==clamp(nx,o.r,CFG.W-o.r)||obs.some(b=>Math.hypot(clamp(nx,b.x,b.x+b.w)-nx,clamp(o.y,b.y,b.y+b.h)-o.y)<o.r)))o.vx=-o.vx;else o.x=nx;
 let ny=o.y+o.vy*dt;if(ny<o.r||ny>CFG.H-o.r||obs.some(b=>Math.hypot(clamp(o.x,b.x,b.x+b.w)-o.x,clamp(ny,b.y,b.y+b.h)-ny)<o.r))o.vy=-o.vy;else o.y=ny}
