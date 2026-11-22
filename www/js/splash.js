// Splash screen: shown on every app launch for about 2.6s, tap to skip.
(function(){const el=document.getElementById('splash');if(!el)return;let done=false;
 const hide=()=>{if(done)return;done=true;el.classList.add('out');setTimeout(()=>el.remove(),500)};
 el.addEventListener('pointerdown',hide);setTimeout(hide,2600)})();
