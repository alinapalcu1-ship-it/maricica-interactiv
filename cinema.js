/* MARICICA CINEMA — Revizie artistică și narativă 3D.
 * Păstrăm toate înregistrările audio, navigația, timpii și logica jocurilor deja verificate.
 * Facem doar upgrade vizual și eliminăm modul de poveste repetitiv.
 */
(()=>{
'use strict';
const art='assets/cinema/';
const backgrounds=['01-bedroom.webp','02-bathroom.webp','03-classroom.webp','04-return.webp','05-care.webp','06-finale.webp'];
const prop3d=id=>`${art}${id}.webp`;
const dirtyAt=i=>i>=2&&i<40;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function rig(variant='clean',label='Maricica, fetița cu fundițe roșii'){
  const p=`${art}maricica-${variant}`;
  return `<div class="cine-actor" data-variant="${variant}" data-gesture="idle" role="img" aria-label="${escapeHtml(label)}"><img class="cine-body" src="${p}-body.webp" alt="" draggable="false"><img class="cine-arm arm-left" src="${p}-left.webp" alt="" draggable="false"><img class="cine-arm arm-right" src="${p}-right.webp" alt="" draggable="false"></div>`;
}
function particles(){return `<div class="cine-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>`}
function setVariant(actor,variant){if(!actor||actor.dataset.variant===variant)return;actor.dataset.variant=variant;actor.querySelector('.cine-body').src=`${art}maricica-${variant}-body.webp`;actor.querySelector('.arm-left').src=`${art}maricica-${variant}-left.webp`;actor.querySelector('.arm-right').src=`${art}maricica-${variant}-right.webp`;}
function fixIcons(scope){if(!scope)return;scope.querySelectorAll('img[src^="assets/objects/"]').forEach(el=>{const original=el.getAttribute('src');const name=original.slice(original.lastIndexOf('/')+1).replace('.svg','');el.src=prop3d(name);el.classList.add('cine-3d-icon');el.addEventListener('error',()=>{el.src=original},{once:true})})}

// Original 3D Maricica appears on every screen, never substituted by a new unrelated model.
stageDecor=function(ci){
 const c=CHAPTERS[ci];let left='';
 if(ci===2){left=`<img src="${art}friend.webp" class="cine-support cine-friend" alt="Colega Maricicăi, fetiță 3D cu ochelari mov" draggable="false"><img src="${art}teddy.webp" class="cine-support cine-teddy" alt="Ursulețul de pluș 3D" draggable="false">`}
 else if(ci===5){left=`<img src="${art}teddy.webp" class="cine-support cine-teddy finale-teddy" alt="Ursulețul vesel" draggable="false">`}
 else if(ci===1||ci===3||ci===4){left=`<div class="cine-prop-pair" aria-hidden="true"><img class="cine-prop soap" data-voice="Săpunul" src="${prop3d('soap')}" alt=""><img class="cine-prop comb" data-voice="Pieptenele" src="${prop3d('comb')}" alt=""><img class="cine-prop brush" data-voice="Periuța de dinți" src="${prop3d('brush')}" alt=""><img class="cine-prop water" data-voice="Apa" src="${prop3d('water')}" alt=""></div>`}
 else {left=`<img src="${prop3d('mirror')}" alt="" class="cine-mirror" draggable="false">`}
 return `<div class="cine-scene cine-scene-${ci+1}">
   <div class="cine-backdrop" style="background-image:url('${art}${backgrounds[ci]}')"></div>
   <div class="cine-film-light"></div><div class="cine-floor-glow"></div>
   ${left}${rig(dirtyAt(state.index)?'dirty':'clean')}${particles()}
   <div class="cine-caption"><span class="cine-caption-kicker">MOMENTUL ${ci+1} DIN 6</span><strong>${escapeHtml(c.title)}</strong><span>${escapeHtml(c.desc)}</span></div>
   <div class="cine-sound-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
 </div>`;
};

const oldCaption=updateCaption;
updateCaption=function(){
 oldCaption();if(state.view!=='story')return;
 const el=document.querySelector('.story-stage');if(!el)return;
 const speaker=LINES[state.index]?.[1]||'Narator';
 const actor=el.querySelector('.cine-actor');
 setVariant(actor,dirtyAt(state.index)?'dirty':'clean');
 if(actor){
  actor.classList.toggle('is-speaking',speaker==='Maricica'&&state.playing);
  let gesture='idle';
  if(state.index>=19&&state.index<=26)gesture='sad';
  if(state.index>=10&&state.index<=14)gesture='no';
  if(state.index>=36&&state.index<=39)gesture='washing';
  if(state.index>=40&&state.index<=42)gesture='combing';
  if(state.index>=43&&state.index<=46)gesture='brushing';
  if(state.index===4||state.index>=47)gesture='happy';
  if(speaker==='Maricica'&&gesture==='idle')gesture='talking';
  actor.dataset.gesture=gesture;
 }
 const friend=el.querySelector('.cine-friend'),bear=el.querySelector('.cine-teddy');
 if(friend){friend.classList.toggle('is-speaking',speaker==='Fetița');friend.classList.toggle('is-greeting',state.index===17||state.index===18)}
 if(bear){bear.classList.toggle('is-speaking',speaker==='Ursulețul');bear.classList.toggle('is-comforting',state.index>=21&&state.index<=26)}
 el.querySelectorAll('.cine-prop').forEach(node=>node.classList.toggle('is-speaking',speaker===node.dataset.voice||speaker==='Obiectele'));
 el.classList.toggle('clean-reveal',state.index>=40);
 el.classList.toggle('sad-moment',state.index>=21&&state.index<=26);
 el.classList.toggle('cine-narrating',state.playing);
};
audio.addEventListener('pause',()=>{document.querySelector('.cine-actor')?.classList.remove('is-speaking')});
audio.addEventListener('play',()=>{if(state.view==='story')updateCaption()});

renderHome=function(){
 app.innerHTML=`<section class="cine-home" aria-label="Bun venit în lumea Maricicăi">
 <div class="cine-home-visual">
   <div class="cine-home-room"></div><div class="cine-home-light"></div>
   <img src="${art}teddy.webp" class="cine-home-teddy" alt="Ursulețul Maricicăi" draggable="false">
   ${rig('clean')}${particles()}
   <span class="cine-home-welcome">Bună, copii! <span>♥</span></span>
   <div class="cine-home-ribbon">O aventură despre grija față de noi</div>
 </div>
 <div class="cine-home-copy">
   <div class="cine-eyebrow"><span>✦</span> POVESTE ANIMATĂ • 3 ANI</div>
   <h1>Maricica <em>învață să fie curată</em></h1>
   <p class="cine-lead">O fetiță veselă, un ursuleț și prieteni care o ajută să descopere cât de bine este să avem grijă de noi.</p>
   <div class="cine-home-actions">
    <button class="cine-cta cine-cta-pink" data-action="listen"><span class="cine-cta-icon">▶</span><span><strong>Ascultă povestea</strong><small>6 momente animate • cu vocile personajelor</small></span><span class="cine-cta-arrow">›</span></button>
    <button class="cine-cta cine-cta-blue" data-action="guided-start"><span class="cine-cta-icon">✋</span><span><strong>Ne jucăm cu Maricica!</strong><small>Întrebări, mișcări și pauze pentru copii</small></span><span class="cine-cta-arrow">›</span></button>
   </div>
   <div class="cine-home-chips"><span>✿ Fără reclame</span><span>♡ Fără punctaje</span><span>♫ Voci în română</span></div>
 </div>
 </section>`;
};

// Preserve guided ElevenLabs logic and pauses; upgrade only its presentation.
const oldGuided=renderGuided;
renderGuided=function(){
 oldGuided();if(state.view!=='guided')return;
 const stage=app.querySelector('.guided-stage');if(stage){
   stage.classList.add('cine-guided-stage');
   const old=stage.querySelector('.guided-maricica');if(old){const div=document.createElement('div');div.innerHTML=rig((guided.phase==='intro')?'dirty':'clean');old.replaceWith(div.firstElementChild)}
   const actor=stage.querySelector('.cine-actor');
   const motion=guided.phase==='motion' ? ['hands','washing','combing','brushing'][guided.motion] : guided.phase==='question'?'talking':guided.phase==='done'?'happy':'idle';
   if(actor){actor.dataset.gesture=motion;actor.classList.toggle('is-speaking',guided.audioActive)}
   const bubbles=document.createElement('div');bubbles.innerHTML=particles();stage.appendChild(bubbles.firstChild);
 }
 fixIcons(app);
 const wrong=app.querySelector('.guided-remark');if(wrong&&guided.wrong)wrong.textContent='Nu-i nimic! Mai încercăm împreună. ♥';
};
const oldGames=renderGames;
renderGames=function(){oldGames();if(state.view!=='games')return;fixIcons(app);
 const title=app.querySelector('.games-header h1');if(title)title.textContent='Descoperă și învață!';
 const header=app.querySelector('.games-header');if(header&&!header.querySelector('.cine-mini-actor'))header.insertAdjacentHTML('beforeend',`<img class="cine-mini-actor" src="${art}maricica-clean.webp" alt="Maricica se bucură de joc">`)
};
const oldFinale=showFinale;
showFinale=function(){stopAll();state.view='finale';app.innerHTML=`<section class="cine-finale"><div class="cine-finale-stage"><div class="cine-backdrop" style="background-image:url('${art}06-finale.webp')"></div><img class="cine-finale-bear" src="${art}teddy.webp" alt="Ursulețul vesel"><img class="cine-finale-maricica" src="${art}maricica-clean.webp" alt="Maricica este bucuroasă și curată">${particles()}</div><div class="cine-finale-copy"><div class="cine-eyebrow">★ POVESTEA S-A ÎNCHEIAT</div><h1>Bravo, Maricica!</h1><p>Maricica a învățat să se îngrijească. Acum vrea să se joace cu voi!</p><button class="cine-cta cine-cta-blue" data-action="guided-start"><span class="cine-cta-icon">✋</span><span><strong>Hai să ne jucăm!</strong><small>Răspundem și ne mișcăm împreună</small></span><span class="cine-cta-arrow">›</span></button><button class="pill-button outline" data-action="listen">↻ Ascultă povestea din nou</button><button class="pill-button mint" data-action="home">⌂ Acasă</button></div></section>`;tonal(true);launchConfetti(app.querySelector('.cine-finale-stage'),55)};

// Clear old menu options from the educator guide, preserving valid educational aims.
showTeacher=function(){audio.pause();guidedAudio.pause();state.playing=false;sfxAudio.pause();window.speechSynthesis?.cancel();modalRoot.innerHTML=`<div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Ghid pentru educatoare"><div class="modal-card"><button class="modal-close" data-action="close-info" aria-label="Închide">×</button><span class="modal-badge">Ghid pentru educatoare</span><h2>Maricica învață să fie curată</h2><div class="teacher-body"><p><strong>Grupă:</strong> mică (3 ani). <strong>Poveste:</strong> 6 momente cu înregistrări ElevenLabs, apoi un joc distinct.</p><p><strong>Obiective:</strong> identificarea obiectelor de igienă, asocierea acestora cu acțiunile, observarea emoțiilor Maricicăi, imitarea gesturilor de îngrijire și consolidarea autonomiei.</p><p><strong>Desfășurare:</strong> „Ascultă povestea” pentru activitatea de limbaj. „Ne jucăm cu Maricica!” pentru 3 întrebări interactive urmate de 4 mișcări cu pauze de 6–8 secunde; există opțiunea „+5 secunde”.</p><p>Jocul nu colectează date și nu penalizează răspunsurile greșite. Copiii pot încerca din nou. Pentru dezvoltarea limbajului, educatoarea poate pune întrebări suplimentare despre ceea ce simte Maricica.</p><p><strong>Material:</strong> adaptare educațională după „Maricica” de Luiza Vlădescu. Personajul principal respectă modelul vizual selectat; animațiile sunt realizate prin manipularea unor imagini 3D în straturi (2,5D), nu filmare video 3D.</p></div><div class="game-actions"><button class="pill-button" data-action="close-info">Am înțeles ♡</button></div></div></div>`};

// Some views have already been painted by the original script. Replace after enhancements load.
renderHome();
})();
