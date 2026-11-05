/* Maricica • Atelierele curateniei v1.0 — extensie izolata V10.
   Nu schimba povestea, poezia, Puzzle, Memory sau vocile inregistrate. */
(function(){
'use strict';
const host=document.getElementById('app');
const palette={red:{name:'Roșu',hex:'#fa647b',light:'#ffe3e7',dark:'#bc3854'},yellow:{name:'Galben',hex:'#f4bf45',light:'#fff2c9',dark:'#a76d22'},blue:{name:'Albastru',hex:'#5eafe9',light:'#d8f2ff',dark:'#326baf'}};
const sortTokens=[
 {id:'a',kind:'soap',color:'red'},{id:'b',kind:'brush',color:'blue'},{id:'c',kind:'towel',color:'yellow'},
 {id:'d',kind:'brush',color:'yellow'},{id:'e',kind:'towel',color:'red'},{id:'f',kind:'soap',color:'blue'},
 {id:'g',kind:'soap',color:'yellow'},{id:'h',kind:'towel',color:'blue'},{id:'i',kind:'brush',color:'red'}
];
const needs=[{id:'soap',label:'Săpun',needed:true},{id:'ball',label:'Minge',needed:false},{id:'brush',label:'Periuță',needed:true},{id:'towel',label:'Prosop',needed:true},{id:'car',label:'Mașinuță',needed:false},{id:'comb',label:'Pieptene',needed:true}];
const names={soap:'Săpun',brush:'Periuță',towel:'Prosop',comb:'Pieptene',ball:'Minge',car:'Mașinuță'};
const spots=[{x:185,y:187},{x:305,y:178},{x:425,y:181},{x:545,y:190},{x:185,y:333},{x:305,y:340},{x:425,y:336},{x:545,y:330}];
let sort={phase:'colors',selected:null,placed:[],picked:[],feedback:'Atinge un obiect, apoi coșulețul de aceeași culoare.'};
let clean=new Set(),brushDown=false,drag=null,suppressClick=0;
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','&quot;':'&quot;'}[c]||'&#39;'));}
function icon(kind,color){
 const c=(palette[color]||palette.blue).hex;
 const begin='<svg class="hg-icon" viewBox="0 0 120 106" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
 const finish='</svg>';
 const shine='<ellipse cx="43" cy="29" rx="17" ry="5" fill="#fff" opacity=".5"/>';
 if(kind==='soap')return begin+'<ellipse cx="62" cy="90" rx="40" ry="8" fill="#745472" opacity=".13"/><rect x="18" y="22" width="84" height="65" rx="24" fill="'+c+'" stroke="#fff" stroke-width="4"/><rect x="25" y="28" width="70" height="48" rx="20" fill="#fff" opacity=".19"/>'+shine+'<circle cx="88" cy="20" r="8" fill="#fff" opacity=".92"/><circle cx="101" cy="37" r="4" fill="#fff" opacity=".9"/><path d="M47 61 Q60 45 74 61" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>';
 if(kind==='brush')return begin+'<ellipse cx="61" cy="89" rx="40" ry="7" fill="#745472" opacity=".12"/><g transform="rotate(-22 62 54)"><rect x="15" y="47" width="91" height="22" rx="11" fill="'+c+'" stroke="#fff" stroke-width="3"/><rect x="53" y="51" width="35" height="5" rx="3" fill="#fff" opacity=".63"/><rect x="15" y="39" width="30" height="13" rx="5" fill="#fff"/><path d="M19 41v-11M25 41V27M31 41V29M37 41V28M43 41V31" fill="none" stroke="'+c+'" stroke-width="4" stroke-linecap="round"/></g></svg>';
 if(kind==='towel')return begin+'<ellipse cx="61" cy="93" rx="43" ry="7" fill="#745472" opacity=".12"/><rect x="22" y="16" width="75" height="74" rx="12" fill="'+c+'" stroke="#fff" stroke-width="4"/><rect x="28" y="21" width="63" height="63" rx="8" fill="#fff" opacity=".22"/><path d="M31 68h58" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M31 77h58" stroke="#fff" stroke-width="3" stroke-dasharray="2 6" opacity=".8"/></svg>';
 if(kind==='comb')return begin+'<g transform="rotate(-25 60 54)"><rect x="17" y="32" width="87" height="22" rx="10" fill="#db8ce4" stroke="#fff" stroke-width="3"/>'+Array.from({length:11},(_,i)=>'<rect x="'+(23+i*7)+'" y="50" width="4" height="26" rx="2" fill="#a95fba"/>').join('')+'</g></svg>';
 if(kind==='ball')return begin+'<circle cx="60" cy="53" r="35" fill="#ffbd59" stroke="#fff" stroke-width="4"/><path d="M38 25Q74 50 93 73M27 72Q55 45 73 21" stroke="#f47480" stroke-width="9" fill="none"/><circle cx="49" cy="35" r="9" fill="#fff" opacity=".6"/></svg>';
 return begin+'<rect x="19" y="39" width="80" height="36" rx="13" fill="#8ebdee" stroke="#fff" stroke-width="4"/><path d="M35 39l12-19h30l13 19" fill="#b7dcfa" stroke="#fff" stroke-width="4"/><circle cx="38" cy="78" r="11" fill="#585a80" stroke="#fff" stroke-width="3"/><circle cx="80" cy="78" r="11" fill="#585a80" stroke="#fff" stroke-width="3"/><rect x="32" y="44" width="14" height="7" rx="3" fill="#fff"/></svg>';
}
function basketSVG(color){
 const p=palette[color];
 return '<svg class="hg-basket-svg" viewBox="0 0 160 112" aria-hidden="true"><ellipse cx="80" cy="100" rx="71" ry="9" fill="#654e73" opacity=".12"/><path d="M47 44Q55 3 80 3Q105 3 114 44" fill="none" stroke="'+p.dark+'" stroke-width="10" stroke-linecap="round"/><path d="M10 39H150L136 99Q80 115 24 99Z" fill="'+p.hex+'" stroke="#fff" stroke-width="5"/><path d="M28 53H132M25 69H135M27 86H133M53 47L48 102M80 47V107M107 47L112 102" stroke="'+p.dark+'" stroke-width="4" opacity=".43"/><rect x="8" y="34" width="144" height="15" rx="7" fill="'+p.light+'" stroke="'+p.hex+'" stroke-width="5"/><ellipse cx="60" cy="63" rx="25" ry="7" fill="#fff" opacity=".24"/></svg>';
}
function homeCards(){
 if(state.view!=='home')return;
 const grid=host.querySelector('.v4-start-grid');
 if(!grid||grid.querySelector('[data-hg="open-sort"]'))return;
 const cards='<button class="v4-main-action hg-home-card hg-home-sort" type="button" data-hg="open-sort"><span aria-hidden="true">🧺</span><strong>Coșulețele de igienă</strong><small>Sortează culorile și alege obiectele</small></button>'+
 '<button class="v4-main-action hg-home-card hg-home-brush" type="button" data-hg="open-brush"><span aria-hidden="true">🪥</span><strong>Dințișorii veseli</strong><small>Curăță dinții cu periuța</small></button>';
 grid.insertAdjacentHTML('beforeend',cards);
}
const renderHomeBeforeHygiene=renderHome;
renderHome=function(){renderHomeBeforeHygiene();homeCards();};
function newGame(which){
 stopAll();
 document.getElementById('modal-root').innerHTML='';
 state.view=which==='sort'?'hygiene-sort':'hygiene-brush';
 if(which==='sort')sort={phase:'colors',selected:null,placed:[],picked:[],feedback:'Atinge un obiect, apoi coșulețul de aceeași culoare.'};
 else clean=new Set();
 draw();
}
function shell(tag,title,subtitle,inside){
 host.innerHTML='<section class="hg-view" aria-label="'+esc(title)+'"><header class="hg-header"><button class="hg-back" data-hg="home" type="button">⌂ <span>Acasă</span></button><div class="hg-titles"><span class="hg-kicker">✿ ATELIER INTERACTIV · GRUPA MICĂ</span><h1>'+title+'</h1><p>'+subtitle+'</p></div><span class="hg-tag">'+tag+'</span></header>'+inside+'</section>';
}
function sidePanel(message,content,actions){
 return '<aside class="hg-guide"><div class="hg-guide-top"><img src="assets/cinema/maricica-clean.webp" alt="Maricica zâmbește și încurajează copiii"><div><strong>Hai să încercăm!</strong><p>'+message+'</p></div></div>'+content+'<div class="hg-guide-actions">'+actions+'</div></aside>';
}
function sortStage(){
 const done=sort.placed.length===sortTokens.length;
 const baskets=['red','yellow','blue'].map(color=>{
 const p=palette[color],n=sort.placed.filter(id=>sortTokens.find(t=>t.id===id).color===color).length;
 return '<button type="button" class="hg-basket hg-basket-'+color+'" data-hg="basket" data-color="'+color+'" aria-label="Coșulețul '+p.name+', '+n+' din 3 obiecte">'+basketSVG(color)+'<strong>'+p.name+'</strong><small>'+n+' din 3</small><span class="hg-ticks">'+Array.from({length:3},(_,i)=>'<i class="'+(i<n?'on':'')+'"></i>').join('')+'</span></button>';
 }).join('');
 const items=sortTokens.map(t=>'<button type="button" class="hg-token '+(sort.selected===t.id?'hg-selected':'')+' '+(sort.placed.includes(t.id)?'hg-placed':'')+'" data-hg="token" data-id="'+t.id+'" '+(sort.placed.includes(t.id)?'disabled':'')+' aria-label="'+names[t.kind]+' '+palette[t.color].name+'">'+icon(t.kind,t.color)+'<small>'+names[t.kind]+'</small></button>').join('');
 const left='<section class="hg-game-surface"><div class="hg-stage-head"><strong>1 · Potrivește culorile</strong><span>'+sort.placed.length+' / '+sortTokens.length+' obiecte</span></div><div class="hg-progress"><span style="width:'+(100*sort.placed.length/sortTokens.length)+'%"></span></div><div class="hg-baskets">'+baskets+'</div><div class="hg-tray-label">Alege obiectele de aici</div><div class="hg-token-grid">'+items+'</div></section>';
 const panel=sidePanel('Alegem un obiect și îl punem în coșulețul cu aceeași culoare.','<div class="hg-feedback" aria-live="polite">'+esc(sort.feedback)+'</div><p class="hg-teacher-note">Poți atinge obiectul și apoi coșul sau îl poți trage cu degetul.</p>','<button class="hg-small-action" data-hg="hear" type="button">🔊 Ascultă indicația</button><button class="hg-small-action" data-hg="restart-sort" type="button">↻ Reia jocul</button>'+(done?'<button class="hg-primary" data-hg="next-phase" type="button">Mai departe <span aria-hidden="true">→</span></button>':''));
 return '<div class="hg-play-layout">'+left+panel+'</div>';
}
function choiceStage(){
 const n=sort.picked.length;
 const items=needs.map(t=>'<button type="button" class="hg-choice '+(sort.picked.includes(t.id)?'hg-picked':'')+'" data-hg="choose" data-id="'+t.id+'" '+(sort.picked.includes(t.id)?'disabled':'')+' aria-label="'+t.label+'">'+icon(t.id,'blue')+'<strong>'+t.label+'</strong>'+(sort.picked.includes(t.id)?'<span class="hg-check" aria-hidden="true">✓</span>':'')+'</button>').join('');
 const left='<section class="hg-game-surface"><div class="hg-stage-head"><strong>2 · Ce îi trebuie Maricicăi?</strong><span>'+n+' din 4</span></div><div class="hg-progress"><span style="width:'+(n*25)+'%"></span></div><p class="hg-stage-tip">Atinge obiectele folosite pentru igienă. Cele de joacă rămân la locul lor.</p><div class="hg-choices">'+items+'</div></section>';
 const collected=sort.picked.map(id=>'<span class="hg-collected">'+icon(id,'blue')+'<small>'+needs.find(t=>t.id===id).label+'</small></span>').join('');
 const panel=sidePanel('Ce obiecte folosim ca să fim curați? Pune-le în coșulețul Maricicăi.','<div class="hg-personal-basket"><span>Coșulețul Maricicăi</span><div class="hg-collected-items">'+(collected||'<span class="hg-placeholder">Aici apar alegerile tale ♡</span>')+'</div></div><div class="hg-feedback" aria-live="polite">'+esc(sort.feedback)+'</div>','<button class="hg-small-action" data-hg="hear" type="button">🔊 Ascultă indicația</button><button class="hg-small-action" data-hg="restart-sort" type="button">↻ Reia jocul</button>'+(n===4?'<button class="hg-primary" data-hg="restart-sort" type="button">Bravo! Joacă din nou ✨</button>':''));
 return '<div class="hg-play-layout">'+left+panel+'</div>';
}
function toothSvg(x,y,i){
 return '<g class="hg-tooth-unit" transform="translate('+x+' '+y+')"><path d="M-51 -54 Q0 -66 51 -54 Q58 -20 47 33 Q42 61 8 65 Q-9 70 -27 60 Q-52 51 -50 23Z" fill="url(#hg-enamel)" stroke="#d5e7f5" stroke-width="5"/><path d="M-33 -37Q-15 -52 12 -48" fill="none" stroke="#fff" stroke-width="10" opacity=".87" stroke-linecap="round"/></g>';
}
function stainSvg(p,i){
 return '<g data-hg-stain="'+i+'" class="hg-stain" transform="translate('+p.x+' '+p.y+')" role="button" tabindex="0" aria-label="Curăță pata de pe dintele '+(i+1)+'"><ellipse cx="0" cy="0" rx="31" ry="23" fill="#d8a880" opacity=".72"/><ellipse cx="0" cy="3" rx="23" ry="15" fill="#ad805f" opacity=".35"/><circle cx="-12" cy="-8" r="6" fill="#c39e7b"/><circle cx="13" cy="9" r="5" fill="#ae8665"/><circle cx="-7" cy="-2" r="3.5" fill="#674632"/><circle cx="7" cy="-2" r="3.5" fill="#674632"/><path d="M-4 9Q0 5 5 9" fill="none" stroke="#674632" stroke-width="2.7" stroke-linecap="round"/></g>';
}
function mouthSvg(){
 const top=[185,305,425,545],bottom=[185,305,425,545];
 const teeth=top.map((x,i)=>toothSvg(x,185,i)).join('')+bottom.map((x,i)=>toothSvg(x,336,i+4)).join('');
 return '<svg class="hg-mouth-svg" viewBox="0 0 740 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Model mare cu opt dinți. Freacă petele cu degetul sau cu mouse-ul." data-hg-mouth="yes"><defs><linearGradient id="hg-enamel" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#f9feff"/><stop offset="1" stop-color="#def1ff"/></linearGradient><linearGradient id="hg-lips" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffb1bc"/><stop offset="1" stop-color="#f27c9b"/></linearGradient></defs><circle cx="101" cy="75" r="11" fill="#fff" opacity=".9"/><circle cx="625" cy="435" r="9" fill="#fff" opacity=".9"/><path d="M82 260Q76 89 370 100Q663 89 657 260Q659 451 370 443Q77 449 82 260Z" fill="#693c5d" stroke="url(#hg-lips)" stroke-width="35"/><path d="M111 166Q370 90 624 166L628 193Q365 148 109 196Z" fill="#fa9ab4"/><path d="M110 358Q375 407 626 352L620 378Q369 455 116 379Z" fill="#fa9ab4"/>'+teeth+spots.map(stainSvg).join('')+'<g id="hg-brush-cursor" class="hg-brush-cursor" transform="translate(670 466) rotate(-36)"><rect x="-14" y="-7" rx="8" width="115" height="24" fill="#76bbf2" stroke="#fff" stroke-width="4"/><rect x="2" y="-4" rx="4" width="34" height="7" fill="#fff" opacity=".6"/><rect x="-38" y="-17" width="39" height="32" rx="10" fill="#fff" stroke="#8ad3f9" stroke-width="3"/><path d="M-32 -17V-35M-24 -17V-38M-16 -17V-35M-8 -17V-37" stroke="#7cd6ee" stroke-width="6" stroke-linecap="round"/></g></svg>';
}
function brushStage(){
 const percent=Math.round(clean.size/spots.length*100),done=clean.size===spots.length;
 const left='<section class="hg-game-surface hg-dental-surface"><div class="hg-stage-head"><strong>Dințișorii veseli</strong><span>'+clean.size+' din '+spots.length+' curățați</span></div><div class="hg-progress"><span style="width:'+percent+'%"></span></div><div class="hg-dental-board '+(done?'hg-all-clean':'')+'">'+mouthSvg()+'<div class="hg-sparkles" aria-hidden="true">✦ ✧ ✦</div></div><p class="hg-bottom-tip">☝️ Atinge petele sau plimbă periuța peste dinți.</p></section>';
 const text=done?'✨ Toți dințișorii sunt curați! Minunat!':'Șterge petele cu periuța. Fiecare dințișor devine strălucitor!';
 const panel=sidePanel('Mișcă degetul pe modelul mare cu dinți. Poți curăța și printr-o simplă atingere.','<div class="hg-dental-badge '+(done?'done':'')+'"><span aria-hidden="true">'+(done?'🌟':'🪥')+'</span><strong>'+percent+'%</strong><small>Dințișori curați</small></div><div class="hg-feedback" aria-live="polite">'+text+'</div><p class="hg-teacher-note">Fără cronometru, fără puncte pierdute. La fiecare atingere copilul primește feedback pozitiv.</p>','<button class="hg-small-action" data-hg="hear" type="button">🔊 Ascultă indicația</button><button class="hg-small-action" data-hg="clean-one" type="button">✨ Curăță un dințișor</button><button class="hg-primary" data-hg="restart-brush" type="button">↻ Reia curățarea</button>');
 return '<div class="hg-play-layout">'+left+panel+'</div>';
}
function draw(){
 if(state.view==='hygiene-sort')shell('🧺 CULORI ȘI IGIENĂ','Coșulețele cu obiecte de igienă','Alegem, sortăm și descoperim ce ne ajută să fim curați.',sort.phase==='colors'?sortStage():choiceStage());
 if(state.view==='hygiene-brush'){
  shell('🪥 ACTIVITATE PRACTICĂ','Dințișorii veseli','Curățăm un model mare de dinți, atingând fiecare pată.',brushStage());
  clean.forEach(i=>host.querySelector('[data-hg-stain="'+i+'"]')?.classList.add('hg-cleaned'));
 }
}
function place(id,color){
 if(sort.phase!=='colors')return;
 const t=sortTokens.find(x=>x.id===id);
 if(!t||sort.placed.includes(id))return;
 if(t.color!==color){sort.feedback='Aproape! Caută coșulețul '+palette[t.color].name.toLowerCase()+'.';if(typeof tonal==='function')tonal(false);}
 else{sort.placed.push(id);sort.selected=null;sort.feedback=sort.placed.length===sortTokens.length?'🌟 Toate obiectele sunt în coșulețele potrivite!':'Bravo! Ai găsit culoarea potrivită.';if(typeof tonal==='function')tonal(true);}
 draw();
 if(sort.placed.length===sortTokens.length&&typeof launchConfetti==='function')launchConfetti(host.querySelector('.hg-game-surface'),28);
}
function choose(id){
 const item=needs.find(t=>t.id===id);
 if(!item||sort.picked.includes(id))return;
 if(item.needed){sort.picked.push(id);sort.feedback=sort.picked.length===4?'🌟 Bravo! Ai ales toți cei patru prieteni ai curățeniei!':'Foarte bine! Acesta ne ajută să fim curați.';if(typeof tonal==='function')tonal(true);}
 else{sort.feedback='Acesta este pentru joacă. Hai să găsim un obiect pentru îngrijire.';if(typeof tonal==='function')tonal(false);}
 draw();
 if(sort.picked.length===4&&typeof launchConfetti==='function')launchConfetti(host.querySelector('.hg-game-surface'),34);
}
function cleanSpot(i){
 if(state.view!=='hygiene-brush'||clean.has(i)||i<0||i>=spots.length)return;
 clean.add(i);
 const stain=host.querySelector('[data-hg-stain="'+i+'"]');if(stain)stain.classList.add('hg-cleaned');
 const percent=Math.round(clean.size/spots.length*100);
 const bar=host.querySelector('.hg-progress>span');if(bar)bar.style.width=percent+'%';
 const stageCount=host.querySelector('.hg-stage-head>span');if(stageCount)stageCount.textContent=clean.size+' din '+spots.length+' curățați';
 const badge=host.querySelector('.hg-dental-badge strong');if(badge)badge.textContent=percent+'%';
 const msg=host.querySelector('.hg-feedback');if(msg)msg.textContent=clean.size===spots.length?'✨ Toți dințișorii sunt curați! Minunat!':'Bravo! Încă un dințișor este curat.';
 if(typeof tonal==='function')tonal(true);
 if(clean.size===spots.length){host.querySelector('.hg-dental-board')?.classList.add('hg-all-clean');host.querySelector('.hg-dental-badge')?.classList.add('done');if(typeof launchConfetti==='function')launchConfetti(host.querySelector('.hg-dental-surface'),42);}
}
function svgPoint(event,svg){
 const r=svg.getBoundingClientRect();
 if(!r.width||!r.height)return null;
 return {x:(event.clientX-r.left)*740/r.width,y:(event.clientY-r.top)*520/r.height};
}
function brushAt(event){
 const svg=host.querySelector('[data-hg-mouth]');if(!svg)return;
 const point=svgPoint(event,svg);if(!point)return;
 const cursor=svg.querySelector('#hg-brush-cursor');
 if(cursor)cursor.setAttribute('transform','translate('+(point.x+18)+' '+(point.y+25)+') rotate(-36)');
 for(let i=0;i<spots.length;i++)if(!clean.has(i)&&Math.hypot(point.x-spots[i].x,point.y-spots[i].y)<52)cleanSpot(i);
}
host.addEventListener('pointerdown',e=>{
 if(state.view==='hygiene-brush'&&e.target.closest('[data-hg-mouth]')){
  if(e.button!==0&&e.pointerType==='mouse')return;
  brushDown=true;
  try{e.target.closest('[data-hg-mouth]').setPointerCapture(e.pointerId);}catch(err){}
  brushAt(e);e.preventDefault();return;
 }
 if(state.view==='hygiene-sort'&&sort.phase==='colors'){
  const t=e.target.closest('[data-hg="token"]');if(!t||t.disabled)return;
  drag={id:t.dataset.id,firstX:e.clientX,firstY:e.clientY,el:t,ghost:null,dragging:false};
  try{t.setPointerCapture(e.pointerId);}catch(err){}
 }
});
host.addEventListener('pointermove',e=>{
 if(state.view==='hygiene-brush'&&brushDown){brushAt(e);e.preventDefault();return;}
 if(!drag||state.view!=='hygiene-sort')return;
 if(!drag.dragging&&Math.hypot(e.clientX-drag.firstX,e.clientY-drag.firstY)>13){
  drag.dragging=true;drag.ghost=drag.el.cloneNode(true);
  drag.ghost.removeAttribute('data-hg');drag.ghost.className='hg-drag-ghost';drag.ghost.removeAttribute('disabled');
  document.body.appendChild(drag.ghost);
 }
 if(drag.dragging&&drag.ghost){drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';e.preventDefault();}
});
function finishPointer(e){
 if(brushDown){brushDown=false;const svg=host.querySelector('[data-hg-mouth]');if(svg&&e.type==='pointerup')brushAt(e);}
 if(drag){const d=drag;drag=null;if(d.ghost)d.ghost.remove();if(d.dragging){suppressClick=Date.now()+420;const basket=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-hg="basket"]');if(basket&&e.type==='pointerup')place(d.id,basket.dataset.color);}}
}
host.addEventListener('pointerup',finishPointer);
host.addEventListener('pointercancel',finishPointer);
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-hg]');
 if(!t)return;
 e.preventDefault();e.stopImmediatePropagation();
 const action=t.dataset.hg;
 if(action==='open-sort'){newGame('sort');return;}
 if(action==='open-brush'){newGame('brush');return;}
 if(state.view!=='hygiene-sort'&&state.view!=='hygiene-brush')return;
 if(action==='home'){drag=null;brushDown=false;navHome();return;}
 if(action==='hear'){
  if(typeof speak==='function')speak(state.view==='hygiene-brush'?'Atinge petele de pe dinți cu periuța. Curăță-i pe toți!':sort.phase==='colors'?'Alege un obiect. Pune-l în coșulețul de aceeași culoare.':'Alege săpunul, prosopul, periuța și pieptenele pentru Maricica.');
  return;
 }
 if(action==='restart-sort'){newGame('sort');return;}
 if(action==='restart-brush'){newGame('brush');return;}
 if(action==='next-phase'){sort.phase='choose';sort.selected=null;sort.feedback='Găsește obiectele pentru curățenie.';draw();return;}
 if(action==='clean-one'){const next=spots.findIndex((_,i)=>!clean.has(i));if(next>=0)cleanSpot(next);return;}
 if(state.view!=='hygiene-sort'||Date.now()<suppressClick)return;
 if(action==='token'){sort.selected=t.dataset.id;sort.feedback='Acum alege coșulețul potrivit.';draw();return;}
 if(action==='basket'){if(sort.selected)place(sort.selected,t.dataset.color);else{sort.feedback='Alege mai întâi un obiect din tavă.';draw();}return;}
 if(action==='choose'){choose(t.dataset.id);return;}
},true);
document.addEventListener('keydown',e=>{
 if(state.view!=='hygiene-brush')return;
 const spot=e.target.closest('[data-hg-stain]');
 if(spot&&(e.key==='Enter'||e.key===' ')){e.preventDefault();cleanSpot(Number(spot.dataset.hgStain));}
});
window.MaricicaHygieneWorkshops={openSort:()=>newGame('sort'),openBrush:()=>newGame('brush'),version:'1.0',games:2};
if(state.view==='home')homeCards();
if(window.location.hash==='#cosulete')newGame('sort');
if(window.location.hash==='#dintisori')newGame('brush');
})();