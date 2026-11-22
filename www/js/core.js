// Config, canvas, game state, rarity tiers, small helpers
// Matched to Fanny where sources exist: move speed 265, Steel Cable cost 14 (1 less per recast within 5s, no cooldown), Cut Throat 12 energy and 25s cooldown. Cable speed, range and energy regen are estimates.
const CFG={W:1000,H:600,R:14,speed:265,eMax:100,regen:8,
 cable:{cost:14,step:1,window:5,range:1300,speed:700,hook:4000,cd:0,boost:.69,more:.33,dummy:3},
 cut:{cost:12,range:240,cd:25,speed:1500,dmg:70,mark:.3},
 t1:{cost:8,cd:1.5,refund:6,r:110},
 time:60,hp:100,comboWindow:2.5};
const $=id=>document.getElementById(id);
const cv=$('cv'),ctx=cv.getContext('2d');
let C={},sc=1,ox=0,oy=0,dpr=1,cw=0,ch=0;
function theme(){const s=getComputedStyle(document.documentElement);['floor','grid','trace','copper','lane','river','stone','wall','wallTop','accent','danger','gold','player','text','muted','hazard','ink'].forEach(k=>C[k]=s.getPropertyValue('--'+k).trim())}
theme();
let live=false,arenaDirty=true;
// Widen the arena to the stage's shape so it fills the screen. Height stays 600, so speeds and ranges feel the same.
function fitWorld(){if(cw<=0||ch<=0)return;const w=Math.round(Math.max(1000,Math.min(1500,CFG.H*cw/ch)));if(w!==CFG.W){CFG.W=w;arenaDirty=true}}
function resize(){const r=cv.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);cw=r.width;ch=r.height;cv.width=cw*dpr;cv.height=ch*dpr;if(!live)fitWorld();sc=Math.min(cw/CFG.W,ch/CFG.H);ox=(cw-CFG.W*sc)/2;oy=(ch-CFG.H*sc)/2}
addEventListener('resize',resize);resize();

const S={mode:'static',phase:'menu',paused:false,score:0,time:CFG.time,kills:0,best:0,bs:0,ms:0,coins:0};
try{S.best=+localStorage.getItem('fannyBest')||0;S.coins=+localStorage.getItem('cableMasterCoins')||0;S.ms=+localStorage.getItem('cableMasterMaxStreak')||0}catch(e){}
let P,T,obs=[],haz=[],dash=null,cabs=[],stuck=0,rem=0,vdx=0,vdy=0,fx=[],php,cdC=0,cdU=0,lastCable=-9,chain=0,lastC=-99,now=0,aim=null,cLine=null,inv=0,fl=null,flN=0,tor=[],t1cd=0;
// Target types: hp = hits to kill, pts = base points, sp = speed multiplier. Streak = consecutive kills without a drifter hit or stopping.
let streak=0,idle=0,sw=null,proj=[];const buzz=n=>{if(!cfg.vib)return;try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
// Rarity tiers: Common is the baseline. hp = hits to kill, pts = score, coin = coins dropped, w = spawn weight.
const TY=[{n:'Common',hp:1,r:CFG.R,pts:1,coin:1,col:'#e8c15a',sp:1,w:65},{n:'Rare',hp:3,r:CFG.R,pts:3,coin:3,col:'#5b9bd5',sp:1,w:17},{n:'Epic',hp:5,r:CFG.R,pts:5,coin:6,col:'#9b7fd1',sp:1,w:8},{n:'Legendary',hp:8,r:CFG.R,pts:8,coin:12,col:'#e08a4a',sp:1,w:4},{n:'Mythic',hp:5,r:CFG.R,pts:6,coin:10,col:'#d9689a',sp:1,w:6,shoots:true}];
function pickTy(){const L=TY;let q=Math.random()*L.reduce((a,t)=>a+t.w,0);for(const t of L){if((q-=t.w)<0)return t}return L[0]}
const joy={x:0,y:0},keys={};let mouse=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a);
const norm=(x,y)=>{const l=Math.hypot(x,y)||1;return [x/l,y/l]};
