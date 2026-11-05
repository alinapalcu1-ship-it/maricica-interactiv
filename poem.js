(function poemModule(){
'use strict';
const ROOT='assets/poem/';
const BACK='assets/cinema5/';
const POEM=[
 'Apa, mâna și săpunul',
 'Numai trei, dar parcă-s unul.',
 'Spală-ntâi perechile:',
 'Ochii și urechile.',
 'Spală corpul jumătate,',
 'Și pe față și pe spate.',
 'Bucuroasă, periuța',
 'Spală dinții: uța, uța!'
];
const SCENES=[
 {name:'Trei prieteni', lines:[0,1], clips:[0,1,2], img:ROOT+'01-apa-mana-sapun.webp', fallback:BACK+'05-washing-clear.webp', tip:'Atinge apa, mânuța și săpunul.', props:[['💧','Apa'],['✋','Mâna'],['🧼','Săpunul']]},
 {name:'Ochii și urechile', lines:[2,3], clips:[3,4], img:ROOT+'02-ochii-urechile.webp', fallback:BACK+'02-mirror-clean.webp', tip:'Arată ochișorii și urechile.',props:[['👀','Ochii'],['👂','Urechile']]},
 {name:'Spălăm corpul',lines:[4],clips:[5],img:ROOT+'03-corpul.webp',fallback:BACK+'05-washing-clear.webp',tip:'Mimează cum te speli pe corp.',props:[['🫧','Spumă'],['🧽','Buretele']]},
 {name:'Față și spate',lines:[5],clips:[6],img:ROOT+'04-fata-spatele.webp',fallback:BACK+'05-washing-clear.webp',tip:'Arată partea din față și spatele.',props:[['😊','Fața'],['🫧','Spatele']]},
 {name:'Dințișori curați',lines:[6,7],clips:[7,8],img:ROOT+'05-periuta.webp',fallback:BACK+'05-brushing-clear.webp',tip:'Mișcă mâna ca și cum ai peria dințișorii.',props:[['🪥','Periuța'],['✨','Dinții curați']]}
];
const TITLE='Prietenii curățeniei';
const audio=new Audio();
audio.preload='auto';
let page=0,activeLine=-1,playing=false,runId=0,playList=[],playPos=0,spoken=null;
let pulseTimeout=0;
const host=document.getElementById('app');
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function speechText(i){return i===0?TITLE:POEM[i-1];}
function sceneOfClip(i){return SCENES.findIndex(s=>s.clips.includes(i));}
function stop(){
 runId++;playing=false;playList=[];activeLine=-1;
 audio.pause();audio.removeAttribute('src');audio.load();
 if(window.speechSynthesis)window.speechSynthesis.cancel();
 if(spoken){spoken.onend=null;spoken.onerror=null;spoken=null;}
 clearTimeout(pulseTimeout);
}
function goHome(){
 stop();
 if(typeof navHome==='function')navHome();else{state.view='home';renderHome();}
}
function loadSceneImage(sceneNo){
 const img=host.querySelector('.poem-stage-photo');
 if(!img)return;
 const current=SCENES[sceneNo];
 img.src=current.fallback;
 const candidate=new Image();
 candidate.onload=()=>{if(state.view==='poem'&&page===sceneNo&&img.isConnected){img.src=current.img;img.dataset.hq='yes';}};
 candidate.onerror=()=>{ /* material local verificat doar dacă este încărcat */ };
 candidate.src=current.img;
}
function paint(){
 if(state.view!=='poem')return;
 const scene=SCENES[page];
 host.innerHTML=`<section class="poem-view" aria-label="${TITLE}">
  <div class="poem-top"><button type="button" class="poem-home" data-poem="home" aria-label="Acasă">⌂ Acasă</button><span class="poem-tag">POEZIE INTERACTIVĂ · GRUPA MICĂ</span></div>
  <div class="poem-intro"><span class="poem-flower" aria-hidden="true">✿</span><h1>${TITLE}</h1><p>Ascultăm, privim și imităm împreună!</p></div>
  <div class="poem-layout">
    <section class="poem-stage" aria-label="Ilustrația ${page+1} din ${SCENES.length}">
      <img class="poem-stage-photo" alt="${safe(scene.name)} — Maricica și prietenii curățeniei" draggable="false">
      <div class="poem-stage-light" aria-hidden="true"></div>
      <div class="poem-extra-foam" aria-hidden="true">${page===2||page===3?'<b>◌</b><b>○</b><b>◌</b><b>○</b><b>◌</b><b>○</b><b>◌</b><b>○</b><b>◌</b>':''}</div>
      <div class="poem-touch-row">${scene.props.map(([ico,name],i)=>`<button class="poem-touch" type="button" data-poem="touch" data-object="${safe(name)}" title="${safe(name)}" aria-label="Atinge ${safe(name)}"><span aria-hidden="true">${ico}</span><small>${safe(name)}</small></button>`).join('')}</div>
      <div class="poem-touch-feedback" aria-live="polite"></div>
    </section>
    <aside class="poem-reading">
      <div class="poem-counter"><span>Momentul ${page+1} din ${SCENES.length}</span><strong>${safe(scene.name)}</strong></div>
      <div class="poem-stanza" aria-live="polite">${scene.lines.map(i=>`<p class="${activeLine===i+1?'poem-active-line':''}">${safe(POEM[i])}</p>`).join('')}</div>
      <p class="poem-move-hint"><span aria-hidden="true">✋</span> ${safe(scene.tip)}</p>
      <div class="poem-audio-controls">
        <button type="button" data-poem="scene-play" class="poem-button poem-main">${playing?'■ Oprește':'▶ Ascultă versurile'}</button>
        <button type="button" data-poem="all-play" class="poem-button poem-secondary">♫ Toată poezia</button>
      </div>
      <div class="poem-navigation">
        <button type="button" data-poem="previous" ${page===0?'disabled':''} aria-label="Momentul anterior">← Înapoi</button>
        <div class="poem-dots" aria-label="Momentele poeziei">${SCENES.map((_,i)=>`<button type="button" data-poem="jump" data-page="${i}" class="${page===i?'current':''}" aria-label="Momentul ${i+1}" aria-current="${page===i?'step':'false'}"></button>`).join('')}</div>
        <button type="button" data-poem="next">${page===SCENES.length-1?'↺ Din nou':'Înainte →'}</button>
      </div>
    </aside>
  </div>
  <div class="poem-full-poem"><details><summary>Vezi toate versurile</summary><p>${POEM.map(safe).join('<br>')}</p></details></div>
 </section>`;
 loadSceneImage(page);
}
function speakFallback(i,onDone,id){
 if(id!==runId||state.view!=='poem')return;
 if(state.muted){onDone();return;}
 if(!('speechSynthesis' in window)){onDone();return;}
 const u=new SpeechSynthesisUtterance(speechText(i));
 u.lang='ro-RO';u.rate=.83;u.pitch=1.08;
 const voices=window.speechSynthesis.getVoices();
 u.voice=voices.find(v=>v.lang.toLowerCase().startsWith('ro'))||null;
 let finished=false;
 const complete=()=>{if(finished)return;finished=true;spoken=null;if(id===runId)onDone();};
 u.onend=complete;u.onerror=complete;spoken=u;
 try{window.speechSynthesis.speak(u);}
 catch(e){complete();}
}
function sequenceNext(id){
 if(id!==runId||state.view!=='poem')return;
 if(playPos>=playList.length){playing=false;activeLine=-1;paint();return;}
 const idx=playList[playPos++];
 const target=sceneOfClip(idx);
 if(target>=0)page=target;
 activeLine=idx;
 paint();
 const complete=()=>sequenceNext(id);
 if(state.muted){complete();return;}
 const file=`audio/poem/${idx+1}_Chapter_1.mp3`;
 audio.pause();
 audio.onended=null;audio.onerror=null;
 audio.src=file;
 let handled=false;
 audio.onended=()=>{if(handled)return;handled=true;complete();};
 audio.onerror=()=>{if(handled)return;handled=true;audio.pause();speakFallback(idx,complete,id);};
 const promise=audio.play();
 if(promise && typeof promise.catch==='function')promise.catch(()=>{if(!handled){handled=true;speakFallback(idx,complete,id);}});
}
function play(indices){
 stop();
 playing=true;playList=[...indices];playPos=0;
 sequenceNext(runId);
}
function start(){
 stopAll();
 document.getElementById('modal-root').innerHTML='';
 state.view='poem';page=0;activeLine=-1;
 paint();
}
function touch(name,control){
 const feedback=host.querySelector('.poem-touch-feedback');
 if(feedback){
  feedback.textContent=`✨ ${name}!`;
  feedback.classList.remove('show');void feedback.offsetWidth;feedback.classList.add('show');
  clearTimeout(pulseTimeout);pulseTimeout=setTimeout(()=>feedback.classList.remove('show'),1600);
 }
 if(control){control.classList.remove('poem-popped');void control.offsetWidth;control.classList.add('poem-popped');}
 if(!state.muted&&typeof tonal==='function')tonal(true);
}
function homeButton(){
 if(state.view!=='home')return;
 const root=host.querySelector('.cine-home-actions')||host.querySelector('.home-actions')||host.querySelector('.home-layout');
 if(!root||root.querySelector('[data-poem="start"]'))return;
 const b=document.createElement('button');
 b.type='button';b.dataset.poem='start';
 b.className='cine-cta cine-cta-pink poem-home-entry';
 b.innerHTML='<span class="cine-cta-icon" aria-hidden="true">♫</span><span><strong>Prietenii curățeniei</strong><small>Poezie cu imagini și gesturi · 2–3 ani</small></span><span class="cine-cta-arrow" aria-hidden="true">›</span>';
 root.appendChild(b);
}
const previousHome=renderHome;
renderHome=function(){previousHome();homeButton();};
document.addEventListener('click',e=>{
 const target=e.target.closest('[data-poem]');
 if(!target)return;
 e.preventDefault();e.stopImmediatePropagation();
 const act=target.dataset.poem;
 if(act==='start'){start();return;}
 if(state.view!=='poem')return;
 if(act==='home'){goHome();return;}
 if(act==='scene-play'){if(playing){stop();paint();}else play(SCENES[page].clips);return;}
 if(act==='all-play'){play([0,1,2,3,4,5,6,7,8]);return;}
 if(act==='touch'){touch(target.dataset.object,target);return;}
 if(act==='previous'||act==='next'||act==='jump'){
  stop();
  page=act==='previous'?Math.max(0,page-1):act==='next'?(page+1)%SCENES.length:Math.min(SCENES.length-1,Math.max(0,Number(target.dataset.page)||0));
  paint();
 }
},true);
window.addEventListener('pagehide',()=>{if(state.view==='poem')stop()});
window.MaricicaPoem={open:start,stop,version:'1.0',sceneCount:SCENES.length};
if(state.view==='home')homeButton();
})();
