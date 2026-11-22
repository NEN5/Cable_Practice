// Menu, game over and shop screens, start()/end()
// ---- Menu, game over and shop screens ----
let lastMode='menu';
function setStats(a){$('stats').innerHTML=a.map(([l,v])=>`<div class="stat"><small>${l}</small><b>${v}</b></div>`).join('')}
function showMenu(mode,nb){lastMode=mode;const over=mode==='over';
 $('ttl').textContent=over?'Run over':'Cable Master';$('sub').hidden=over;$('nb').hidden=!nb;
 setStats(over?[['Score',S.score],['Best',S.best],['Kills',S.kills]]:[['Best score',S.best],['Max streak',S.ms],['Coins',S.coins]]);
 $('start').textContent=over?'Play again':'Play';$('overlay').hidden=false;fitCard()}
// Scale the card down if it is still taller or wider than the stage (small phones, odd preview sizes).
function fitCard(){const o=$('overlay'),c=$('card');if(o.hidden)return;c.style.transform='';c.style.marginBottom='';
 const cs=getComputedStyle(o),aw=o.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),ah=o.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
 const k=Math.min(1,aw/c.offsetWidth,ah/c.offsetHeight);if(k<.999){c.style.transform='scale('+k+')';c.style.marginBottom=(-c.offsetHeight*(1-k))+'px'}}
addEventListener('resize',fitCard);
let pv=[];
const COIN='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#e2b04a"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#a97c1f" stroke-width="1.6"/></svg>';
function renderShop(){const g=$('sgrid');g.innerHTML='';pv=[];$('scoins').textContent=S.coins;
 TIERS.forEach(tr=>{const h=document.createElement('div');h.className='th';h.innerHTML=`<i style="background:${tr.col}"></i>${tr.n}<small>${tr.note||''}</small>`;g.appendChild(h);
 SKINS.filter(s=>s.t===tr.id).forEach(sk=>{const own=SK.owned.includes(sk.id),eq=SK.eq===sk.id,d=document.createElement('div');d.className='sk'+(eq?' on':'');d.style.setProperty('--tc',tr.col);
  d.innerHTML=`<canvas></canvas><div class="nm">${sk.n}</div><div class="ds">${sk.desc}</div>`;
  const b=document.createElement('button');b.className='btn '+(eq?'eqd':own?'':'buy');
  if(eq){b.textContent='Equipped';b.disabled=true}
  else if(own){b.textContent='Equip';b.onclick=()=>{SK.eq=sk.id;saveSK();renderShop()}}
  else{b.innerHTML=COIN+sk.price;if(S.coins<sk.price)b.classList.add('lock');b.onclick=()=>buy(sk)}
  d.querySelector('canvas').onclick=()=>{sfx('cast',sk.id);setTimeout(()=>sfx('attach',sk.id),320)};
  d.appendChild(b);g.appendChild(d);pv.push({cv:d.querySelector('canvas'),sk})})})}
function buy(sk){const el=$('shopcoin');el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
 if(S.coins<sk.price)return;
 S.coins-=sk.price;SK.owned.push(sk.id);SK.eq=sk.id;saveSK();try{localStorage.setItem('cableMasterCoins',S.coins)}catch(e){}renderShop()}
function shopDraw(){const t=performance.now()/1000,d=devicePixelRatio||1;
 pv.forEach(({cv:c,sk})=>{const r=c.getBoundingClientRect(),w=Math.round(r.width*d),h=Math.round(r.height*d);if(!w)return;
  if(c.width!==w||c.height!==h){c.width=w;c.height=h}
  const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);
  g.fillStyle=C.player;g.beginPath();g.arc(18,r.height-16,6,0,7);g.fill();{const d=norm(r.width-36,-(r.height-32));drawEyes(g,18,r.height-16,6,d[0],d[1])}
  drawCable(g,18,r.height-16,r.width-18,16,sk,1,t,3)})}
// The shop opens from the menu or from the HUD bag button during a run (the game pauses while it is open).
function openShop(){joy.x=joy.y=0;aim=null;$('shop').hidden=false;renderShop();syncPause()}
$('shopbtn').onclick=openShop;$('hshop').onclick=openShop;
$('sback').onclick=()=>{$('shop').hidden=true;pv=[];syncPause();if(S.phase!=='play')showMenu(lastMode,false)};

function start(){live=false;fitWorld();live=true;P={x:150,y:CFG.H/2,r:CFG.R,fx:1,fy:0};S.score=0;S.kills=0;S.bs=0;streak=0;idle=0;S.time=CFG.time;S.phase='play';now=0;php=CFG.hp;cdC=cdU=0;dash=null;cabs=[];fx=[];kf=[];cLine=null;inv=0;fl=null;flN=0;tor=[];t1cd=0;lastCable=-9;chain=0;lastC=-99;
 makeObs();makeHaz();spawnT();proj=[];$('overlay').hidden=true;$('shop').hidden=true;syncPause()}
function end(){live=false;S.phase='over';dash=null;aim=null;const nb=S.score>S.best;if(nb){S.best=S.score;try{localStorage.setItem('fannyBest',S.best)}catch(e){}}
 showMenu('over',nb)}
