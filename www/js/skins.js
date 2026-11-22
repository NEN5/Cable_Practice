// Cable skins (shop data) and drawCable()
// ---- Cable skins (shop) ----
// fx is drawn statelessly from time, so the same code renders the shop previews and the live cables.
const TIERS=[{id:'normal',n:'Normal',note:'Color only',col:'#8a9bb0'},{id:'elite',n:'Elite',col:'#4a9fe0'},{id:'epic',n:'Epic',col:'#9b7fd1'},{id:'legendary',n:'Legendary',col:'#e08a4a'},{id:'mythic',n:'Mythic',col:'#d9689a'}];
const SKINS=[
 {id:'classic',t:'normal',n:'Classic',desc:'Steel gray.',price:0,col:'#8a9bb0'},
 {id:'crimson',t:'normal',n:'Crimson',desc:'Deep red.',price:80,col:'#d9534f'},
 {id:'azure',t:'normal',n:'Azure',desc:'Clear blue.',price:80,col:'#4a9fe0'},
 {id:'moss',t:'normal',n:'Moss',desc:'Forest green.',price:80,col:'#6ab36a'},
 {id:'amber',t:'normal',n:'Amber',desc:'Warm yellow.',price:80,col:'#e0a63a'},
 {id:'ember',t:'elite',n:'Ember',desc:'Glowing line with rising sparks.',price:250,col:'#e8823a',fx:'ember'},
 {id:'frost',t:'elite',n:'Frost',desc:'Pale ice with twinkling crystals.',price:250,col:'#9fd3ee',fx:'frost'},
 {id:'jade',t:'epic',n:'Jade',desc:'Flowing, wavy green cable.',price:500,col:'#3fb985',fx:'wave'},
 {id:'sunset',t:'epic',n:'Sunset',desc:'Rose to amber gradient with soft glow.',price:500,col:'#ee6f88',col2:'#f4a940',fx:'grad'},
 {id:'royal',t:'legendary',n:'Royal',desc:'Braided gold with a travelling shimmer.',price:1000,col:'#e3b94f',fx:'royal'},
 {id:'aurora',t:'legendary',n:'Aurora',desc:'Slowly shifting colors with a soft glow.',price:1000,col:'#6fd0c0',fx:'aurora'},
 {id:'phoenix',t:'mythic',n:'Phoenix',desc:'Twin flames, wide glow and rising embers.',price:2000,col:'#e0502c',col2:'#ffc24a',fx:'phoenix'},
 {id:'celestia',t:'mythic',n:'Celestia',desc:'Pearl and gold strands, stars and shimmer.',price:2000,col:'#f1d98a',fx:'celestia'}];
const skinById=id=>SKINS.find(s=>s.id===id);
let SK={owned:['classic'],eq:'classic'};
try{const o=JSON.parse(localStorage.getItem('cableMasterSkins')||'null');
 if(o&&Array.isArray(o.owned)){SK.owned=o.owned.filter(id=>skinById(id));if(!SK.owned.includes('classic'))SK.owned.unshift('classic');if(skinById(o.eq)&&SK.owned.includes(o.eq))SK.eq=o.eq}}catch(e){}
const saveSK=()=>{try{localStorage.setItem('cableMasterSkins',JSON.stringify(SK))}catch(e){}};
const curSkin=()=>skinById(SK.eq)||SKINS[0];
function drawCable(g,x0,y0,x1,y1,sk,a,t,w){
 const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,n=clamp(Math.round(L/28),3,22),fx=sk.fx;
 g.save();g.lineCap='round';g.lineJoin='round';
 const ln=(col,lw,al)=>{g.globalAlpha=a*al;g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()};
 const pt=(s,o)=>[x0+dx*s+nx*o,y0+dy*s+ny*o];
 const dot=(x,y,r,col,al)=>{g.globalAlpha=a*al;g.fillStyle=col;g.beginPath();g.arc(x,y,Math.max(.1,r),0,7);g.fill()};
 const star=(x,y,r,al)=>{g.globalAlpha=a*al;g.strokeStyle='#fff';g.lineWidth=1.2;g.beginPath();g.moveTo(x-r,y);g.lineTo(x+r,y);g.moveTo(x,y-r);g.lineTo(x,y+r);g.stroke()};
 const wavy=(col,lw,al,ph,amp,k,sp)=>{const N=Math.max(8,Math.ceil(L/6));g.globalAlpha=a*al;g.strokeStyle=col;g.lineWidth=lw;g.beginPath();
  for(let q=0;q<=N;q++){const s=q/N,o=Math.sin(s*L/k-t*sp+ph)*amp*Math.sin(Math.PI*s),p=pt(s,o);q?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])}g.stroke()};
 if(fx==='ember'){ln(sk.col,w,1);ln('#ffe2b0',1,.8);
  for(let i=0;i<n;i++){const ph=(t*.8+i*.618)%1,s=clamp((i+.5+Math.sin(i*12.9)*.4)/n,0,1),p=pt(s,Math.sin(i*5.3)*3);dot(p[0],p[1]-ph*16,2.4*(1-ph)+.5,i%2?'#ffb347':'#ff7a2a',1-ph)}}
 else if(fx==='frost'){ln(sk.col,w,1);ln('#ffffff',1,.7);
  for(let i=0;i<n;i++){const p=pt((i+.5)/n,Math.sin(i*4.1)*5),al=.5+.5*Math.sin(t*3+i*1.7);if(al>.12)star(p[0],p[1],2.5+2.5*al,al)}}
 else if(fx==='wave'){wavy(sk.col,w,1,0,3.2,16,7);wavy('#c9f5df',w*.4,.8,.8,3.2,16,7)}
 else if(fx==='grad'){const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,sk.col);gr.addColorStop(1,sk.col2);ln(gr,w+7,.18);ln(gr,w,1);ln('#ffffff',1,.35)}
 else if(fx==='royal'){wavy('#a97c1f',w*.75,1,0,2.4,14,2);wavy('#f0cf6e',w*.75,1,Math.PI,2.4,14,2);
  const s=(t*.5)%1,p=pt(s,0);dot(p[0],p[1],6,'#fff3c4',.25);dot(p[0],p[1],3,'#fff8de',.95);
  for(let i=0;i<Math.ceil(n/2);i++){const q=pt((i+.5)/Math.ceil(n/2),Math.sin(i*3.3)*4),al=.5+.5*Math.sin(t*2.6+i*2.1);if(al>.15)star(q[0],q[1],2+2*al,al*.9)}}
 else if(fx==='aurora'){const h=(t*40)%360,gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,`hsl(${h},70%,62%)`);gr.addColorStop(.5,`hsl(${(h+70)%360},70%,62%)`);gr.addColorStop(1,`hsl(${(h+140)%360},70%,62%)`);
  ln(gr,w+8,.2);ln(gr,w,1);ln('#ffffff',1,.35);
  for(let i=0;i<Math.ceil(n/2);i++){const p=pt((i+.5)/Math.ceil(n/2),Math.sin(i*2.7)*5),al=.5+.5*Math.sin(t*2.2+i*1.9);if(al>.15)star(p[0],p[1],2+2*al,al*.9)}}
 else if(fx==='phoenix'){const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,sk.col);gr.addColorStop(1,sk.col2);ln(gr,w+10,.22);
  wavy('#d8432c',w,1,0,2.8,14,6);wavy('#ffc24a',w*.5,1,1,2.8,14,6);
  for(let i=0;i<n;i++){const ph=(t*.9+i*.618)%1,s=clamp((i+.5+Math.sin(i*12.9)*.4)/n,0,1),p=pt(s,Math.sin(i*5.3)*4);dot(p[0],p[1]-ph*18,2.6*(1-ph)+.5,i%2?'#ffd27a':'#ff6a2a',1-ph)}}
 else if(fx==='celestia'){wavy('#fff4d0',w*.8,1,0,2.4,15,3);wavy('#e8c46a',w*.45,.9,Math.PI,2.4,15,3);
  for(const o of [0,.5]){const p=pt((t*.45+o)%1,0);dot(p[0],p[1],6,'#fff8de',.25);dot(p[0],p[1],3,'#ffffff',.95)}
  for(let i=0;i<Math.ceil(n/2);i++){const p=pt((i+.5)/Math.ceil(n/2),Math.sin(i*3.3)*5),al=.5+.5*Math.sin(t*2.4+i*2.3);if(al>.15)star(p[0],p[1],2+2.5*al,al)}}
 else ln(sk.col,w,1);
 dot(x1,y1,w+1,sk.col2||sk.col,1);
 g.restore()}
