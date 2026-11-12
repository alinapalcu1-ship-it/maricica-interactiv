/* Maricica kiosk safety: one-touch refresh and cleanup for Samsung interactive board. */
(function(){
'use strict';
const header=document.querySelector('.header-tools');
if(!header)return;
const html='<span aria-hidden="true">↻</span>';
const make=(cls,label)=>{
 const button=document.createElement('button');
 button.type='button';button.className=cls;button.id=cls.includes('mapp-refresh-global')?'maricica-refresh':'maricica-refresh-floating';
 button.innerHTML=html;button.setAttribute('aria-label',label);
 button.title=label;return button;
};
const main=make('icon-btn mapp-refresh-global','Reîmprospătează aplicația');
const floating=make('mapp-refresh-floating','Reîmprospătează aplicația');
header.insertBefore(main,document.getElementById('about-btn')||null);
document.body.appendChild(floating);
let refreshing=false;
function refresh(){
 if(refreshing)return;
 refreshing=true;
 try{window.MaricicaHygieneWorkshops?.cancelDrag?.()}catch(e){}
 document.querySelectorAll('.hg-drag-ghost,.v5-piece-ghost').forEach(el=>el.remove());
 document.querySelectorAll('#app img').forEach(el=>{el.draggable=false;});
 try{window.speechSynthesis?.cancel()}catch(e){}
 try{typeof stopAll==='function'&&stopAll()}catch(e){}
 window.location.reload();
}
main.addEventListener('click',refresh);
floating.addEventListener('click',refresh);
window.MaricicaRefresh=refresh;
document.addEventListener('dragstart',e=>{
 const hit=e.target.closest('#app img,#app svg,#app .wg-object-tile,#app .wg-hub-tile');
 if(hit){e.preventDefault();}
},true);
document.addEventListener('pointercancel',()=>document.querySelectorAll('.hg-drag-ghost,.v5-piece-ghost').forEach(n=>n.remove()),true);
function clearGhosts(){
 document.querySelectorAll('.hg-drag-ghost,.v5-piece-ghost').forEach(n=>n.remove());
}
document.addEventListener('pointerup',clearGhosts,false);
document.addEventListener('lostpointercapture',clearGhosts,false);
document.addEventListener('contextmenu',e=>{
 if(e.target.closest?.('#app .wg-app,#app .hg-view'))e.preventDefault();
},true);

window.addEventListener('blur',()=>document.querySelectorAll('.hg-drag-ghost,.v5-piece-ghost').forEach(n=>n.remove()));
document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('.hg-drag-ghost,.v5-piece-ghost').forEach(n=>n.remove());});
})();
