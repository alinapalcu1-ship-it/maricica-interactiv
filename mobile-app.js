/* Maricica Mobile Experience v1 — viewer separat si navigare mobila, fara a modifica modulele. */
(function(){
'use strict';
const d=document, app=d.getElementById('app');
if(!app)return;
const mobile=()=>matchMedia('(max-width: 900px), (pointer: coarse)').matches;
const selectors={
 story:'.story-stage .v8-film-photo, .story-stage .v5-scene-photo, .story-stage .v4-photo-scene',
 poem:'.poem-stage .poem-stage-photo'
};
let currentType=null,sourceButton=null,zoom=1,rotated=false,manualRotate=false,pan={x:0,y:0},drag=null,scheduled=false,focusBack=null,scrollAt=0;
let viewer=null,photo=null,description=null,zoomLabel=null,rotateButton=null;
function imageOf(type){return app.querySelector(selectors[type]);}
function typeFromImage(img){return img?.closest('.poem-stage')?'poem':'story';}
function labelFor(type){
 if(type==='poem'){
  return app.querySelector('.poem-counter strong')?.textContent?.trim()||'Prietenii curățeniei';
 }
 const n=app.querySelector('.speech-panel .subtitle')?.textContent?.trim();
 return n?.slice(0,140)||'Maricica – ilustrația poveștii';
}
function makeViewer(){
 if(viewer)return;
 viewer=d.createElement('div');
 viewer.id='maricica-image-viewer';
 viewer.className='mapp-viewer';
 viewer.hidden=true;
 viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');
 viewer.setAttribute('aria-label','Imagine pe tot ecranul');
 viewer.innerHTML='<div class="mapp-viewer-top"><strong><span class="mapp-viewer-flower">✿</span> Maricica</strong><button type="button" class="mapp-viewer-close" data-mapp-view="close" aria-label="Închide imaginea">✕ <span>Închide</span></button></div>'+
 '<div class="mapp-viewer-canvas"><img class="mapp-viewer-photo" alt="" draggable="false"></div>'+
 '<div class="mapp-viewer-footer"><p class="mapp-viewer-description" aria-live="polite"></p><div class="mapp-viewer-tools">'+
 '<button type="button" data-mapp-view="rotate" aria-label="Rotește imaginea cu 90 de grade">↻ <span>Întoarce</span></button>'+
 '<button type="button" data-mapp-view="less" aria-label="Micșorează imaginea">−</button>'+
 '<span class="mapp-viewer-zoom-status" aria-live="polite">100%</span>'+
 '<button type="button" data-mapp-view="more" aria-label="Mărește imaginea">＋</button></div></div>';
 d.body.appendChild(viewer);
 photo=viewer.querySelector('.mapp-viewer-photo');
 description=viewer.querySelector('.mapp-viewer-description');
 zoomLabel=viewer.querySelector('.mapp-viewer-zoom-status');
 rotateButton=viewer.querySelector('[data-mapp-view="rotate"]');
 viewer.addEventListener('click',e=>{
  const btn=e.target.closest('[data-mapp-view]');
  if(btn){
   const cmd=btn.dataset.mappView;
   if(cmd==='close')closeViewer();
   if(cmd==='rotate'){manualRotate=true;rotated=!rotated;pan={x:0,y:0};applyView();}
   if(cmd==='less'){zoom=Math.max(1,Math.round((zoom-.25)*100)/100);if(zoom===1)pan={x:0,y:0};applyView();}
   if(cmd==='more'){zoom=Math.min(2.5,Math.round((zoom+.25)*100)/100);applyView();}
  }else if(e.target===viewer)closeViewer();
 });
 photo.addEventListener('dblclick',()=>{zoom=zoom>1?1:1.5;pan={x:0,y:0};applyView();});
 photo.addEventListener('pointerdown',e=>{
  if(zoom<=1)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:pan.x,startY:pan.y};
  try{photo.setPointerCapture(e.pointerId)}catch(err){}
 });
 photo.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  pan.x=Math.max(-innerWidth*.75,Math.min(innerWidth*.75,drag.startX+e.clientX-drag.x));
  pan.y=Math.max(-innerHeight*.75,Math.min(innerHeight*.75,drag.startY+e.clientY-drag.y));
  applyView();
 });
 ['pointerup','pointercancel','lostpointercapture'].forEach(name=>photo.addEventListener(name,()=>drag=null));
}
function applyView(){
 if(!viewer)return;
 viewer.dataset.rotated=rotated?'yes':'no';
 viewer.style.setProperty('--mapp-zoom',String(zoom));
 viewer.style.setProperty('--mapp-pan-x',pan.x+'px');
 viewer.style.setProperty('--mapp-pan-y',pan.y+'px');
 zoomLabel.textContent=Math.round(zoom*100)+'%';
 rotateButton.setAttribute('aria-pressed',rotated?'true':'false');
 viewer.querySelector('[data-mapp-view="less"]').disabled=zoom<=1;
 viewer.querySelector('[data-mapp-view="more"]').disabled=zoom>=2.5;
}
function syncPhoto(){
 if(!viewer||viewer.hidden||!currentType)return;
 const src=imageOf(currentType);
 if(!src)return;
 const value=src.getAttribute('src')||src.currentSrc||src.src;
 if(value&&photo.getAttribute('src')!==value)photo.src=value;
 const title=labelFor(currentType);
 if(description.textContent!==title)description.textContent=title;
 photo.alt=src.alt||title;
}
function openViewer(type,trigger){
 if(!mobile())return;
 const src=imageOf(type);if(!src)return;
 makeViewer();
 currentType=type;focusBack=trigger||d.activeElement;scrollAt=window.scrollY||0;
 zoom=1;pan={x:0,y:0};drag=null;
 rotated=innerHeight>innerWidth&&innerWidth<=900;manualRotate=false;
 viewer.hidden=false;d.body.classList.add('mapp-viewer-open');
 syncPhoto();applyView();
 viewer.querySelector('.mapp-viewer-close').focus({preventScroll:true});
}
function closeViewer(){
 if(!viewer||viewer.hidden)return;
 viewer.hidden=true;currentType=null;drag=null;
 d.body.classList.remove('mapp-viewer-open');
 if(focusBack?.isConnected)focusBack.focus({preventScroll:true});
 else window.scrollTo({top:scrollAt,behavior:'instant'});
}
function addZoomButton(type,stage){
 if(stage.querySelector('.mapp-zoom-launch'))return;
 const btn=d.createElement('button');
 btn.type='button';btn.className='mapp-zoom-launch';
 btn.dataset.mappZoom=type;
 btn.setAttribute('aria-label','Deschide imaginea pe tot ecranul și rotește');
 btn.innerHTML='<span aria-hidden="true">⛶</span><small>Ecran complet</small>';
 stage.appendChild(btn);
}
function decorate(){
 if(!mobile())return;
 const story=app.querySelector('.story-stage');
 const poem=app.querySelector('.poem-stage');
 if(story&&imageOf('story'))addZoomButton('story',story);
 if(poem&&imageOf('poem'))addZoomButton('poem',poem);
}
const nav=d.createElement('nav');
nav.className='mapp-dock';
nav.setAttribute('aria-label','Navigare rapidă în aplicație');
nav.innerHTML='<button type="button" data-mapp-nav="home"><span aria-hidden="true">⌂</span><small>Acasă</small></button>'+
 '<button type="button" data-mapp-nav="story"><span aria-hidden="true">📖</span><small>Poveste</small></button>'+
 '<button type="button" data-mapp-nav="poem"><span aria-hidden="true">♫</span><small>Poezie</small></button>'+
 '<button type="button" data-mapp-nav="games"><span aria-hidden="true">🧩</span><small>Jocuri</small></button>';
d.body.appendChild(nav);
function updateDock(){
 if(!mobile())return;
 const view=state.view||'home';
 const selected=view==='home'?'home':view==='story'?'story':view==='poem'?'poem':'games';
 nav.querySelectorAll('button').forEach(b=>{
  const active=b.dataset.mappNav===selected;
  b.classList.toggle('active',active);
  if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
 });
}
function toSection(which){
 closeViewer();
 if(which==='home'){
  if(state.view==='poem')window.MaricicaPoem?.stop?.();
  navHome();
 }else if(which==='story'){
  if(state.view==='poem')window.MaricicaPoem?.stop?.();
  launchStory('listen');
 }else if(which==='poem'){
  if(state.view!=='poem')window.MaricicaPoem?.open?.();
 }else if(which==='games'){
  if(state.view==='poem')window.MaricicaPoem?.stop?.();
  startGames();
 }
 updateDock();window.scrollTo({top:0,behavior:'instant'});
}
d.addEventListener('click',e=>{
 const navBtn=e.target.closest('[data-mapp-nav]');
 if(navBtn){e.preventDefault();e.stopImmediatePropagation();toSection(navBtn.dataset.mappNav);return;}
 const expand=e.target.closest('[data-mapp-zoom]');
 if(expand){e.preventDefault();e.stopImmediatePropagation();openViewer(expand.dataset.mappZoom,expand);return;}
 const picture=e.target.closest('.v8-film-photo,.v5-scene-photo,.v4-photo-scene,.poem-stage-photo');
 if(picture&&mobile()&&(picture.closest('.story-stage')||picture.closest('.poem-stage'))){
  e.preventDefault();openViewer(typeFromImage(picture),picture);
 }
},true);
d.addEventListener('keydown',e=>{
 if(viewer&&!viewer.hidden){
  if(e.key==='Escape'){e.preventDefault();closeViewer();}
  if(e.key.toLowerCase()==='r'){e.preventDefault();rotated=!rotated;manualRotate=true;applyView();}
 }
});
window.addEventListener('resize',()=>{
 if(viewer&&!viewer.hidden&&!manualRotate){rotated=innerHeight>innerWidth&&innerWidth<=900;applyView();}
 schedule();
});
function schedule(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;decorate();updateDock();syncPhoto();});
}
const observer=new MutationObserver(schedule);
observer.observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
schedule();
window.MaricicaMobileExperience={openStory:()=>openViewer('story'),openPoem:()=>openViewer('poem'),close:closeViewer,version:'1.0'};
})();