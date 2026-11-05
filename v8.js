/* MARICICA 8 — sincronizare vizuală la nivel de replică, 2.5D cinematografică.
 * Nu alterează fișierele ElevenLabs și nu necesită servicii externe.
 */
(()=>{
'use strict';
const BASE='assets/cinema5/';
const ICON='assets/cinema/';
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const objects=[['soap','Săpunul'],['comb','Pieptenele'],['brush','Periuța de dinți'],['water','Apa']];
const alias={'Săpunul':'soap','Pieptenele':'comb','Periuța de dinți':'brush','Apa':'water'};
const assets={
  bedroom:`${BASE}01-bedroom-clear.webp`,
  dirtyMirror:`${BASE}mirror-dirty.webp`,
  classroom:`${BASE}03-classroom-titleless.webp`,
  wash:`${BASE}05-washing-clear.webp`,
  comb:`${BASE}05-combing-clear.webp`,
  brush:`${BASE}05-brushing-clear.webp`,
  cleanMirror:`${BASE}02-mirror-clean.webp`,
  hug:'assets/cinema4/06-finale.webp',
  kindergarten:`${BASE}06-finale-clear.webp`
};
const byLine=(idx)=>{
 if(idx<=2)return assets.bedroom;
 if(idx<=5)return assets.dirtyMirror;
 if(idx<=14)return assets.dirtyMirror;
 if(idx<=26)return assets.classroom;
 if(idx<=35)return assets.dirtyMirror;
 if(idx<=39)return assets.wash;
 if(idx<=42)return assets.comb;
 if(idx<=45)return assets.brush;
 if(idx<=51)return assets.cleanMirror;
 if(idx===52)return assets.hug;
 if(idx===53)return assets.cleanMirror;
 return assets.kindergarten;
};
let outroShowing=false, outroTimer=null;
let lastIndex=-1;
function propTemplate(id,label){return `<div class="v8-object v8-${id}" data-object="${id}" aria-hidden="true"><span class="v8-halo"></span><img src="${ICON}${id}.webp?v=8" alt=""></div>`;}
const oldDecor=stageDecor;
stageDecor=function(ci){
 const initial=byLine(state.index);
 const chars=objects.map(([id,name])=>propTemplate(id,name)).join('');
 return `<div class="v5-scene v8-scene v8-chapter-${ci+1}" role="img" aria-label="Ilustrație din povestea Maricica" style="--v5-photo:url('${initial}')">
 <div class="v8-background-glow" aria-hidden="true"></div>
 <img class="v5-scene-photo v8-film-photo" src="${initial}" alt="" draggable="false">
 <div class="v8-film-shine" aria-hidden="true"></div>
 <div class="v8-objects" aria-hidden="true">${chars}</div>
 <div class="v8-friend" aria-hidden="true"><img src="${BASE}friend-lift.webp" alt=""></div>
 <img class="v8-teddy" src="${BASE}teddy-cutout.webp" alt="" aria-hidden="true" draggable="false">
 <div class="v8-animated-stars" aria-hidden="true"><i></i><i></i><i></i></div>
 </div>`;
};
function renderAnimatedLine(){
 if(state.view!=='story')return;
 const idx=state.index,scene=document.querySelector('.v8-scene');
 if(!scene)return;
 const path=byLine(idx),photo=scene.querySelector('.v8-film-photo');
 if(photo && photo.getAttribute('src')!==path){
   photo.src=path;
   scene.style.setProperty('--v5-photo',`url('${path}')`);
   photo.classList.remove('v8-enter');void photo.offsetWidth;photo.classList.add('v8-enter');
 }
 scene.dataset.line=String(idx);
 scene.dataset.mood=(idx>=15&&idx<=26)?'sad':(idx<=35?'dirty':'happy');
 const currentVoice=LINES[idx]?.[1]||'Narator';
 const playing=Boolean(state.playing && !audio.paused && !audio.ended);
 scene.dataset.playing=playing?'yes':'no';
 scene.dataset.voice=String(currentVoice);
 scene.classList.toggle('v8-friend-show',playing&&(idx===17||idx===18));
 scene.classList.toggle('v8-teddy-show',playing&&(idx>=21&&idx<=25));
 scene.classList.toggle('v8-objects-on',playing&&(Object.hasOwn(alias,currentVoice)||currentVoice==='Obiectele'));
 scene.querySelectorAll('.v8-object').forEach(el=>{
   const active=playing&&(alias[currentVoice]===el.dataset.object||currentVoice==='Obiectele');
   el.classList.toggle('v8-is-talking',active);
 });
 // Nu afișăm etichetele persoanelor, dar păstrăm replicile și toate controalele.
 const speaker=document.querySelector('.speech-panel .speaker');if(speaker)speaker.textContent='';
 const badge=document.querySelector('.speech-panel .speaker-icon');if(badge)badge.textContent='';
 const head=document.querySelector('.story-head .story-crumb strong');if(head)head.hidden=true;
 const nextBtn=document.querySelector('[data-action="next-scene"]');
 if(nextBtn&&!outroShowing)nextBtn.innerHTML='Continuă <span>→</span>';
 lastIndex=idx;
 if(outroShowing&&idx!==54){outroShowing=false;clearTimeout(outroTimer)}
}
const v5Caption=updateCaption;
updateCaption=function(){v5Caption();renderAnimatedLine()};
audio.addEventListener('play',()=>requestAnimationFrame(renderAnimatedLine));
audio.addEventListener('pause',()=>requestAnimationFrame(renderAnimatedLine));
audio.addEventListener('seeking',()=>requestAnimationFrame(renderAnimatedLine));

// Epilogul aparține poveștii: un ultim cadru cu Maricica la joacă după MP3-ul "Sfârșit".
// Înregistrările originale rămân intacte; noul text este afișat (nu pretindem că e ElevenLabs).
audio.addEventListener('ended',e=>{
 if(state.view!=='story'||state.index!==LINES.length-1||outroShowing)return;
 e.stopImmediatePropagation();
 outroShowing=true;state.playing=false;
 const scene=document.querySelector('.v8-scene'),photo=scene?.querySelector('.v8-film-photo');
 if(scene&&photo){photo.src=assets.kindergarten;scene.style.setProperty('--v5-photo',`url('${assets.kindergarten}')`);scene.classList.add('v8-outro');scene.querySelectorAll('.v8-object').forEach(p=>p.classList.remove('v8-is-talking'));}
 const sub=document.querySelector('.speech-panel .subtitle');
 if(sub)sub.textContent='Maricica se joacă acum fericită cu prietenii ei la grădiniță.';
 const number=document.querySelector('.progress-nums');if(number)number.textContent='✓';
 const bar=document.querySelector('.progress-fill');if(bar)bar.style.width='100%';
 const next=document.querySelector('[data-action="next-scene"]');if(next)next.textContent='La jocuri →';
 clearTimeout(outroTimer);
 outroTimer=setTimeout(()=>{if(state.view==='story'&&outroShowing){outroShowing=false;showFinale()}},6500);
},true);

const baseHome=renderHome;
renderHome=function(){clearTimeout(outroTimer);outroShowing=false;baseHome();const teddy=app.querySelector('.v4-home-teddy,.cine-home-teddy');if(teddy)teddy.src=`${BASE}teddy-cutout.webp`};
// Etichetele de capitol nu trebuie să apară nici după navigare/repaint.
const oldRenderStory=renderStory;
renderStory=function(){oldRenderStory();renderAnimatedLine()};
window.MaricicaMotion={
 onAudioStart(character){const scene=document.querySelector('.v8-scene');if(scene){scene.dataset.voice=character;renderAnimatedLine()}},
 animateTalkingObject(id){const el=document.querySelector(`.v8-object[data-object="${id}"]`);if(el){el.classList.remove('v8-is-talking');void el.offsetWidth;el.classList.add('v8-is-talking')}},
 animateFriendPopup(){document.querySelector('.v8-scene')?.classList.add('v8-friend-show')},
 playSceneMotion(sceneId){document.querySelector('.v8-scene')?.setAttribute('data-scene',String(sceneId))}
};
})();
