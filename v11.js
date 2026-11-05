/* Maricica V11 — personaje articulate si actiuni vizibile pe fiecare replica.
   Extensie izolata: nu modifica playerul, MP3-urile sau jocurile. */
(()=>{
'use strict';
const ART='assets/cinema/';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const variants={};
const actionAt=i=>{
 if(i<=1)return 'opening';
 if(i===2)return 'wake';
 if(i===3||i===4)return 'mirror';
 if(i>=5&&i<=6)return 'notice';
 if(i>=7&&i<=9)return 'objects';
 if(i>=10&&i<=13)return 'refuse';
 if(i===14)return 'walk';
 if(i>=15&&i<=18)return 'greet';
 if(i>=19&&i<=20)return 'hands';
 if(i>=21&&i<=26)return 'sad';
 if(i===27)return 'walk';
 if(i>=28&&i<=35)return 'objects';
 if(i>=36&&i<=39)return 'wash';
 if(i>=40&&i<=42)return 'comb';
 if(i>=43&&i<=46)return 'brush';
 if(i>=47&&i<=51)return 'proud';
 if(i===52)return 'hug';
 return 'finale';
};
function buildPuppet(variant){
 const root=document.createElement('div');
 root.className='v11-puppet';root.setAttribute('aria-hidden','true');
 root.innerHTML='<img class="v11-body" alt="" draggable="false"><img class="v11-arm v11-arm-left" alt="" draggable="false"><img class="v11-arm v11-arm-right" alt="" draggable="false"><span class="v11-blink"></span>';
 setVariant(root,variant);
 return root;
}
function setVariant(root,variant){
 if(variants.get===variant)return;
 if(root.dataset.variant===variant)return;
 root.dataset.variant=variant;
 root.querySelector('.v11-body').src=ART+'maricica-'+variant+'-body.webp';
 root.querySelector('.v11-arm-left').src=ART+'maricica-'+variant+'-left.webp';
 root.querySelector('.v11-arm-right').src=ART+'maricica-'+variant+'-right.webp';
}
function makeStage(scene){
 if(scene.querySelector('.v11-theater'))return;
 const theater=document.createElement('div');theater.className='v11-theater';
 theater.innerHTML='<div class="v11-spot" aria-hidden="true"></div><div class="v11-actor-zone"></div><div class="v11-effects" aria-hidden="true"><span class="v11-sink">💧</span><span class="v11-foam">● ● ●</span><span class="v11-spark">✦ ✧ ✦</span><span class="v11-heart">♥</span><span class="v11-tear">💧</span><span class="v11-speech">♫</span></div><div class="v11-action-object" aria-hidden="true"><img alt=""></div>';
 scene.appendChild(theater);
 theater.querySelector('.v11-actor-zone').appendChild(buildPuppet('dirty'));
 const img=theater.querySelector('.v11-action-object img');
 img.addEventListener('error',()=>{theater.querySelector('.v11-action-object').hidden=true});
}
function objFor(action){
 if(action==='comb')return 'comb';
 if(action==='brush')return 'brush';
 if(action==='wash')return 'soap';
 if(action==='mirror')return 'mirror';
 if(action==='hug'||action==='sad')return 'teddy';
 return null;
}
let oldLine=-1,oldScene=null;
function sync(){
 if(state.view!=='story')return;
 const scene=document.querySelector('.v8-scene');if(!scene)return;
 makeStage(scene);
 const i=state.index,action=actionAt(i);
 const theater=scene.querySelector('.v11-theater');
 const actor=theater.querySelector('.v11-puppet');
 const playback=!!(state.playing&&!audio.paused&&!audio.ended&&!state.waiting);
 scene.dataset.v11Action=action;
 scene.dataset.v11Active=playback&&!reduced.matches?'yes':'no';
 const speaker=LINES[i]&&LINES[i][1]||'Narator';
 scene.dataset.v11Talking=speaker==='Maricica'?'yes':'no';
 // Povestea foloseste acelasi personaj 3D, cu gesturi de brate realizate din straturile sursa.
 setVariant(actor,i>=36?'clean':'dirty');
 const object=theater.querySelector('.v11-action-object');
 const key=objFor(action);
 object.hidden=!key;
 if(key){
  const path=key==='teddy'?'assets/cinema5/teddy-cutout.webp':ART+key+'.webp';
  if(object.querySelector('img').getAttribute('src')!==path)object.querySelector('img').src=path;
 }
 // Repornim gestul la schimbarea replicii, inclusiv cand aceeasi actiune continua.
 if(oldLine!==i||oldScene!==scene){
  theater.classList.remove('v11-restart');void theater.offsetWidth;theater.classList.add('v11-restart');
  oldLine=i;oldScene=scene;
 }
 const progress=Number.isFinite(audio.duration)&&audio.duration>0?Math.min(1,audio.currentTime/audio.duration):0;
 scene.style.setProperty('--v11-progress',progress.toFixed(3));
}
const priorCaption=updateCaption;
updateCaption=function(){priorCaption();sync()};
const priorStory=renderStory;
renderStory=function(){priorStory();sync()};
['play','pause','ended','seeking','seeked','loadedmetadata'].forEach(type=>audio.addEventListener(type,()=>requestAnimationFrame(sync)));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestAnimationFrame(sync)});
reduced.addEventListener?.('change',sync);
// Compatibil cu schimbarea scenei si cu modul de reluare al inregistrarilor.
window.MaricicaAnimationV11={sync,actionAt,version:11};
})();