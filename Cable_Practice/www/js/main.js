// Start-up: menu, then the loop
// Menu
$('start').onclick=start;
P={x:150,y:CFG.H/2,r:CFG.R,fx:1,fy:0};
showMenu('menu',false);
requestAnimationFrame(loop);
