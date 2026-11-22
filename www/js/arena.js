// Arena layer: a MOBA-style jungle ground (not a full map). Mossy grass floor, soft dirt patches, two faint trails, stone rings, pebbles, flowers and bushes.
// Obstacles are stone towers, cliffs and boulders. Baked once into an offscreen canvas and re-used every frame.
// Re-baked only when the obstacles, arena width or on-screen scale change. The ground detail is seeded, so it stays the same between rebakes.
let arenaCv=null,arenaBs=0;
function arenaScale(){return Math.min(3,Math.max(1,dpr*sc))}
function mkRng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function rr(g,x,y,w,h,r){r=Math.min(r,w/2,h/2);g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);g.arcTo(x+w,y,x+w,y+r,r);g.lineTo(x+w,y+h-r);g.arcTo(x+w,y+h,x+w-r,y+h,r);g.lineTo(x+r,y+h);g.arcTo(x,y+h,x,y+h-r,r);g.lineTo(x,y+r);g.arcTo(x,y,x+r,y,r);g.closePath()}
const circ=(g,x,y,r)=>{g.beginPath();g.arc(x,y,r,0,7)};

// Obstacles. Small near-square ones become towers, small ones boulders, the rest cliffs.
function pickPart(b){const L=Math.max(b.w,b.h),S=Math.min(b.w,b.h);
 if(L*S<3600)return'boulder';if(L/S<1.4&&L*S<9000)return'tower';return'cliff'}
function partTower(g,b){const w=b.w,h=b.h,gr=g.createLinearGradient(b.x,b.y,b.x+w,b.y+h);gr.addColorStop(0,'#62706a');gr.addColorStop(1,'#323d39');
 rr(g,b.x,b.y,w,h,Math.min(w,h)*.22);g.fillStyle=gr;g.fill();g.strokeStyle='rgba(255,255,255,.14)';g.lineWidth=1.2;g.stroke();
 const cx=b.x+w/2,cy=b.y+h/2,r=Math.min(w,h)*.34;
 g.fillStyle='rgba(0,0,0,.35)';circ(g,cx,cy,r+4);g.fill();
 g.strokeStyle='#8a9a94';g.lineWidth=2;circ(g,cx,cy,r+4);g.stroke();
 g.fillStyle='#1a2420';circ(g,cx,cy,r);g.fill();
 const gem=g.createRadialGradient(cx-r*.2,cy-r*.2,1,cx,cy,r*.7);gem.addColorStop(0,'#d8fbff');gem.addColorStop(1,'#3a9fb5');
 g.fillStyle=gem;circ(g,cx,cy,r*.55);g.fill()}
function partCliff(g,b,R){const pts=[],ins=()=>R()*5,n=Math.max(6,Math.round((b.w+b.h)/22));
 // jittered outline walked clockwise around the rectangle
 const per=2*(b.w+b.h);for(let i=0;i<n;i++){let d=i/n*per,x,y;
  if(d<b.w){x=b.x+d;y=b.y}else if((d-=b.w)<b.h){x=b.x+b.w;y=b.y+d}else if((d-=b.h)<b.w){x=b.x+b.w-d;y=b.y+b.h}else{d-=b.w;x=b.x;y=b.y+b.h-d}
  const cx=b.x+b.w/2,cy=b.y+b.h/2,k=ins(),dx=cx-x,dy=cy-y,l=Math.hypot(dx,dy)||1;pts.push([x+dx/l*k,y+dy/l*k])}
 const gr=g.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);gr.addColorStop(0,'#58645f');gr.addColorStop(1,'#2a332f');
 g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=gr;g.fill();
 g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1.4;g.lineJoin='round';g.stroke();
 g.save();g.clip();
 g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=1.2;g.beginPath();
 for(let i=0,c=Math.max(2,Math.round(b.w*b.h/1800));i<c;i++){const x=b.x+R()*b.w,y=b.y+R()*b.h;g.moveTo(x,y);g.lineTo(x+(R()-.5)*26,y+(R()-.5)*26)}g.stroke();
 g.fillStyle='rgba(70,130,80,.55)';for(let i=0;i<4;i++){circ(g,b.x+R()*b.w,b.y+(R()<.5?0:b.h),4+R()*6);g.fill()}
 g.restore()}
function partBoulder(g,b){const gr=g.createRadialGradient(b.x+b.w*.35,b.y+b.h*.3,2,b.x+b.w/2,b.y+b.h/2,Math.max(b.w,b.h)*.7);gr.addColorStop(0,'#7b8882');gr.addColorStop(1,'#2e3834');
 rr(g,b.x,b.y,b.w,b.h,Math.min(b.w,b.h)*.45);g.fillStyle=gr;g.fill();g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1.2;g.stroke()}

function pathPoly(g,pts){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]))}
function bakeArena(){
 const bs=arenaBs=arenaScale(),W=CFG.W,H=CFG.H;
 if(!arenaCv)arenaCv=document.createElement('canvas');
 arenaCv.width=Math.ceil(W*bs);arenaCv.height=Math.ceil(H*bs);
 const g=arenaCv.getContext('2d');g.setTransform(bs,0,0,bs,0,0);
 const R=mkRng(7777+W);
 // jungle floor: base color, soft mottling, grass tufts
 g.fillStyle=C.floor;g.fillRect(0,0,W,H);
 for(let i=0,n=Math.round(16*W/1000);i<n;i++){const x=R()*W,y=R()*H,r=80+R()*140,m=g.createRadialGradient(x,y,0,x,y,r);m.addColorStop(0,R()<.5?'rgba(70,120,70,.09)':'rgba(10,30,20,.18)');m.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=m;g.fillRect(x-r,y-r,r*2,r*2)}
 g.strokeStyle='rgba(140,200,130,.08)';g.lineWidth=1;g.lineCap='round';g.beginPath();
 for(let i=0,n=Math.round(W*H/700);i<n;i++){const x=R()*W,y=R()*H;g.moveTo(x,y);g.lineTo(x+(R()-.5)*4,y-3-R()*4)}g.stroke();
 // soft dirt patches and two faint winding trails (ground detail only, not lanes)
 for(let i=0,n=Math.round(7*W/1000);i<n;i++){const x=R()*W,y=R()*H,r=30+R()*50,d=g.createRadialGradient(x,y,0,x,y,r);d.addColorStop(0,'rgba(120,104,66,.16)');d.addColorStop(1,'rgba(120,104,66,0)');g.fillStyle=d;g.fillRect(x-r,y-r,r*2,r*2)}
 g.lineCap='round';g.lineJoin='round';
 for(let t=0;t<2;t++){const y0=H*(t?.72:.28)+(R()-.5)*60,pts=[];for(let k=0;k<=6;k++)pts.push([-20+k*(W+40)/6,y0+Math.sin(k*1.3+t*2)*55+(R()-.5)*40]);
  const tr=()=>{g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let k=1;k<pts.length-1;k++){const m=[(pts[k][0]+pts[k+1][0])/2,(pts[k][1]+pts[k+1][1])/2];g.quadraticCurveTo(pts[k][0],pts[k][1],m[0],m[1])}g.lineTo(pts[pts.length-1][0],pts[pts.length-1][1]);g.stroke()};
  g.strokeStyle='rgba(8,16,10,.22)';g.lineWidth=52;tr();g.strokeStyle=C.lane;g.globalAlpha=.4;g.lineWidth=42;tr();g.globalAlpha=1}
 // stone rings: faint circular markings on the ground
 for(let i=0,n=Math.round(3*W/1000);i<n;i++){const x=120+R()*(W-240),y=90+R()*(H-180),r=34+R()*26;g.strokeStyle='rgba(205,215,190,.11)';g.lineWidth=1.6;circ(g,x,y,r);g.stroke();g.setLineDash([3,7]);circ(g,x,y,r-9);g.stroke();g.setLineDash([]);g.fillStyle='rgba(205,215,190,.1)';circ(g,x,y,3);g.fill()}
 // pebbles and tiny flowers
 for(let i=0,n=Math.round(70*W/1000);i<n;i++){g.fillStyle=R()<.7?'rgba(170,180,170,.16)':'rgba(10,20,14,.2)';circ(g,R()*W,R()*H,1+R()*2.2);g.fill()}
 for(let i=0,n=Math.round(36*W/1000);i<n;i++){g.fillStyle=['rgba(240,225,150,.5)','rgba(235,235,240,.45)','rgba(230,150,170,.4)'][Math.floor(R()*3)];circ(g,R()*W,R()*H,1.3+R()*.8);g.fill()}
 // bushes: leafy clusters, walkable (they are decoration, only the grey stone blocks)
 for(let i=0,n=Math.round(14*W/1000);i<n;i++){const x=60+R()*(W-120),y=30+R()*(H-60);  for(let k=0;k<4;k++){const bx=x+(R()-.5)*26,by=y+(R()-.5)*14,r=8+R()*6;g.fillStyle='rgba(22,56,34,.9)';circ(g,bx,by,r);g.fill();g.fillStyle='rgba(80,150,90,.35)';circ(g,bx-2,by-3,r*.55);g.fill()}}
 const v=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,Math.hypot(W,H)/2);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.3)');
 g.fillStyle=v;g.fillRect(0,0,W,H);
 // obstacles
 for(const b of obs){const type=pickPart(b);
  g.fillStyle='rgba(0,0,0,.45)';rr(g,b.x+3,b.y+5,b.w,b.h,6);g.fill();
  if(type==='tower')partTower(g,b);else if(type==='boulder')partBoulder(g,b);else partCliff(g,b,mkRng(Math.floor(b.x*31+b.y*17)))}
 // map edge: dark fog band with a thin stone rim
 const band=12;g.fillStyle='rgba(3,8,6,.7)';
 g.fillRect(0,0,W,band);g.fillRect(0,H-band,W,band);g.fillRect(0,band,band,H-2*band);g.fillRect(W-band,band,band,H-2*band);
 g.strokeStyle=C.stone;g.globalAlpha=.55;g.lineWidth=1.6;g.strokeRect(band,band,W-2*band,H-2*band);g.globalAlpha=1;
 arenaDirty=false}
function drawArena(){if(arenaDirty||Math.abs(arenaScale()-arenaBs)>.15)bakeArena();ctx.drawImage(arenaCv,0,0,CFG.W,CFG.H)}
