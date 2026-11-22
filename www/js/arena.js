// Arena layer: floor, grid, hazard-stripe border and crates are baked once into an offscreen canvas and re-used every frame.
// Re-baked only when the obstacles, arena width or on-screen scale change.
let arenaCv=null,arenaBs=0;
function arenaScale(){return Math.min(3,Math.max(1,dpr*sc))}
function bakeArena(){
 const bs=arenaBs=arenaScale(),W=CFG.W,H=CFG.H;
 if(!arenaCv)arenaCv=document.createElement('canvas');
 arenaCv.width=Math.ceil(W*bs);arenaCv.height=Math.ceil(H*bs);
 const g=arenaCv.getContext('2d');g.setTransform(bs,0,0,bs,0,0);
 g.fillStyle=C.floor;g.fillRect(0,0,W,H);
 // floor plates: fine grid with a small cross where every second line meets
 g.strokeStyle=C.grid;g.lineWidth=1;g.beginPath();
 for(let x=50;x<W;x+=50){g.moveTo(x,0);g.lineTo(x,H)}for(let y=50;y<H;y+=50){g.moveTo(0,y);g.lineTo(W,y)}g.stroke();
 g.strokeStyle=C.wall;g.lineWidth=1.5;g.beginPath();
 for(let x=100;x<W;x+=100)for(let y=100;y<H;y+=100){g.moveTo(x-4,y);g.lineTo(x+4,y);g.moveTo(x,y-4);g.lineTo(x,y+4)}g.stroke();
 const v=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,Math.hypot(W,H)/2);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.38)');
 g.fillStyle=v;g.fillRect(0,0,W,H);
 // crates: soft shadow, steel face, bevel, brace and corner bolts
 for(const b of obs){
  g.fillStyle='rgba(0,0,0,.4)';g.fillRect(b.x+4,b.y+6,b.w,b.h);
  g.fillStyle=C.wall;g.fillRect(b.x,b.y,b.w,b.h);
  g.fillStyle='rgba(255,255,255,.07)';g.fillRect(b.x,b.y,b.w,2);g.fillRect(b.x,b.y,2,b.h);
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(b.x,b.y+b.h-2,b.w,2);g.fillRect(b.x+b.w-2,b.y,2,b.h);
  g.strokeStyle='rgba(255,255,255,.07)';g.lineWidth=1.2;g.strokeRect(b.x+7.5,b.y+7.5,b.w-15,b.h-15);
  g.beginPath();g.moveTo(b.x+7.5,b.y+7.5);g.lineTo(b.x+b.w-7.5,b.y+b.h-7.5);g.moveTo(b.x+b.w-7.5,b.y+7.5);g.lineTo(b.x+7.5,b.y+b.h-7.5);g.stroke();
  g.fillStyle=C.wallTop;for(const [px,py] of [[4,4],[b.w-4,4],[4,b.h-4],[b.w-4,b.h-4]]){g.beginPath();g.arc(b.x+px,b.y+py,1.7,0,7);g.fill()}
 }
 // border: hazard stripe band
 const p=document.createElement('canvas');p.width=p.height=28;const q=p.getContext('2d');
 q.fillStyle=C.ink;q.fillRect(0,0,28,28);q.fillStyle=C.hazard;
 for(let i=-1;i<3;i++){q.beginPath();q.moveTo(i*14,28);q.lineTo(i*14+14,28);q.lineTo(i*14+28,0);q.lineTo(i*14+14,0);q.closePath();q.fill()}
 const band=12;g.fillStyle=g.createPattern(p,'repeat');g.globalAlpha=.9;
 g.fillRect(0,0,W,band);g.fillRect(0,H-band,W,band);g.fillRect(0,band,band,H-2*band);g.fillRect(W-band,band,band,H-2*band);g.globalAlpha=1;
 g.strokeStyle=C.wallTop;g.lineWidth=2;g.strokeRect(band,band,W-2*band,H-2*band);
 arenaDirty=false}
function drawArena(){if(arenaDirty||Math.abs(arenaScale()-arenaBs)>.15)bakeArena();ctx.drawImage(arenaCv,0,0,CFG.W,CFG.H)}
