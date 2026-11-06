/* Maricica v4 — poveste vizuală + puzzle și memory pentru 3 ani.
   Nu schimbă înregistrările ElevenLabs, păstrează pauzele deja configurate. */
(()=>{
'use strict';
const p='assets/cinema4/';
const c='assets/cinema/';
const book=['01-bedroom.webp','02-bathroom.webp','03-classroom.webp','04-return.webp','05-care.webp','06-finale.webp'];
const objectPhoto=id=>`${c}${id==='bear'?'teddy':id}.webp${['soap','water','comb','brush'].includes(id)?'?v=6':''}`;
const snap=()=>document.querySelector('.cine-actor');
const originalHome=renderHome;
// The original chosen Maricica: one clean full-body PNG with no separated cut-out arms.
renderHome=function(){
 app.innerHTML=`<section class="v4-home">
 <div class="v4-home-media"><div class="v4-home-wall"></div><span class="v4-home-stars">✦ ✧ ✦</span><img class="v4-home-hero" src="${c}maricica-clean.webp" alt="Maricica, cu rochița roșie și două fundițe" draggable="false"><img class="v4-home-teddy" src="${c}teddy.webp" alt="Ursulețul Maricicăi" draggable="false"><span class="v4-cloud">Bună, copii! ♡</span></div>
 <div class="v4-home-content"><span class="v4-topline">✿ POVESTE ȘI JOCURI • 3 ANI</span><h1>Maricica <span>învață să fie curată</span></h1><p>O poveste despre mânuțe curate, prietenie și grija față de noi.</p>
 <div class="v4-start-grid"><button class="v4-main-action v4-pink" data-action="listen"><span aria-hidden="true">📖</span><strong>Ascultă povestea</strong><small>Cu vocile personajelor</small></button><button class="v4-main-action v4-cyan" data-action="guided-start"><span aria-hidden="true">🫧</span><strong>Ne jucăm cu Maricica</strong><small>Întrebări și mișcări</small></button><button class="v4-main-action v4-yellow" data-v4="memory"><span aria-hidden="true">💝</span><strong>Memory</strong><small>Găsește perechile</small></button></div>
 <div class="v4-friendly">✨ Fără reclame &nbsp; ♡ Fără cronometru &nbsp; 🔊 În limba română</div></div>
 </section>`;
};
// Full-bleed cinema photos. Girls and friends are already integrated into the illustrated frames.
// Bathroom receives an identical Maricica reflection over the on-screen mirror area.
stageDecor=function(ci){
 const ch=CHAPTERS[ci], src=`${p}${book[ci]}`;
 const bathroom=ci===1||ci===3;
 const face=state.index<40?'dirty':'clean';
 const mirror=bathroom?`<div class="v4-gloss-reflection" aria-hidden="true"><img src="${c}maricica-${face}.webp" alt=""></div>`:'';
 const largeProps=(ci===1||ci===3||ci===4)?`<div class="v4-large-objects" aria-label="Săpun, pieptene și periuță de dinți"><img src="${objectPhoto('soap')}" alt="Săpun"><img src="${objectPhoto('comb')}" alt="Pieptene"><img src="${objectPhoto('brush')}" alt="Periuță de dinți"></div>`:'';
 return `<div class="v4-cinema-scene v4-scene-${ci+1}" role="img" aria-label="${escapeHtml(ch.title)}, ilustrație 3D">
 <img class="v4-photo-scene" src="${src}" alt="" draggable="false">${mirror}${largeProps}
 <span class="v4-cinema-shimmer" aria-hidden="true">✦</span>
 <div class="v4-scene-legend"><small>MOMENTUL ${ci+1} DIN 6</small><strong>${escapeHtml(ch.title)}</strong><span>${escapeHtml(ch.desc)}</span></div>
 </div>`;
};
// Hook caption updates to reflect Maricica's transition from unwashed to clean.
const prevCaption=updateCaption;
updateCaption=function(){prevCaption();const root=document.querySelector('.v4-cinema-scene');if(!root)return;
 const r=root.querySelector('.v4-gloss-reflection img');if(r)r.src=`${c}maricica-${state.index<40?'dirty':'clean'}.webp`;
 root.classList.toggle('v4-is-playing',state.playing);
};
// The guided learning stage is immersive but keeps the existing recorded voice/pauses.
const oldGuided=renderGuided;
renderGuided=function(){oldGuided();if(state.view!=='guided')return;
 const stage=app.querySelector('.guided-stage');if(!stage)return;
 const actor=stage.querySelector('.cine-actor');
 if(actor){actor.outerHTML=`<img class="v4-guided-girl" src="${c}maricica-${guided.phase==='intro'?'dirty':'clean'}.webp" alt="Maricica">`}
 stage.classList.add('v4-guided-stage');
 stage.querySelectorAll('.cine-particles').forEach(x=>x.remove());
 stage.insertAdjacentHTML('beforeend',`<div class="v4-stage-props" aria-hidden="true"><img src="${objectPhoto('soap')}"><img src="${objectPhoto('comb')}"><img src="${objectPhoto('brush')}"></div>`);
};
// Memory educativ. Puzzle este eliminat din aplicatie.
let memory={cards:[],shown:[],matched:[],locked:false,moves:0,complete:false,version:0};
let memoryTimer=null;
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function launchMemory(){stopAll();state.view='v4-memory';if(memoryTimer)clearTimeout(memoryTimer);
 const base=['soap','comb'];memory={cards:shuffle([...base,...base]).map((id,i)=>({id,i})),shown:[],matched:[],locked:false,moves:0,complete:false,version:memory.version+1};renderMemory();speak('Găsește perechile. Întoarce două cartonașe.')}
function memoryFlip(i){if(state.view!=='v4-memory'||memory.locked||memory.matched.includes(i)||memory.shown.includes(i))return;
 memory.shown.push(i);renderMemory();if(memory.shown.length===2){memory.moves++;const [a,b]=memory.shown;if(memory.cards[a].id===memory.cards[b].id){memory.matched.push(a,b);memory.shown=[];tonal(true);if(memory.matched.length===4){memory.complete=true;speak('Bravo! Ai găsit toate perechile!');setTimeout(()=>launchConfetti(document.querySelector('.v4-game-surface'),35),100)}renderMemory()}
 else{memory.locked=true;tonal(false);const v=memory.version;memoryTimer=setTimeout(()=>{if(state.view!=='v4-memory'||v!==memory.version)return;memory.shown=[];memory.locked=false;renderMemory()},1300)}}}
function renderMemory(){if(state.view!=='v4-memory')return;
 app.innerHTML=`<section class="v4-play-view"><div class="v4-breadcrumb"><button data-action="home">⌂ Acasă</button><span>›</span><strong>Memory cu Maricica</strong></div><div class="v4-game-surface v4-memory-surface"><div class="v4-game-heading"><div><small>💝 JOC DE MEMORIE</small><h1>Găsește perechile!</h1><p>Întoarce două cartonașe. Caută imaginile la fel.</p></div><img src="${c}maricica-clean.webp" alt="Maricica te încurajează" /></div>
 <div class="v4-memory-grid">${memory.cards.map((card,i)=>{const open=memory.shown.includes(i)||memory.matched.includes(i);return `<button class="v4-memory-card ${open?'is-open':''} ${memory.matched.includes(i)?'is-matched':''}" data-v4="flip" data-id="${i}" aria-label="Cartonașul ${i+1}${open?', '+(card.id==='soap'?'săpun':'pieptene'):''}" ${memory.matched.includes(i)?'disabled':''}>${open?`<img src="${objectPhoto(card.id)}" alt=""><strong>${card.id==='soap'?'Săpun':'Pieptene'}</strong>`:'<img class="v4-card-back" src="'+p+'memory-back.webp" alt="">'}</button>`}).join('')}</div>
 <div class="v4-memory-footer">${memory.complete?'<h2>🌟 Minunat! Ai găsit toate perechile!</h2>':'<p>Nu ne grăbim. Poți încerca de câte ori vrei!</p>'}<div class="v4-game-cta"><button data-v4="reset-memory">↻ Reia</button></div></div></div></section>`;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-v4]');if(!t)return;const action=t.dataset.v4;switch(action){case'memory':launchMemory();break;case'flip':memoryFlip(Number(t.dataset.id));break;case'reset-memory':launchMemory();break;}});
// Old third-party games are hidden from the main flow. The recorded guided lesson remains intact.
const oldGames=renderGames; renderGames=function(){launchMemory()};
renderHome();
})();
