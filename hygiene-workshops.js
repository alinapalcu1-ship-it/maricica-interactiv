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
const needs=[{id:'soap',label:'Săpun'},{id:'towel',label:'Prosop'},{id:'brush',label:'Periuță'},{id:'comb',label:'Pieptene'}];
const tasks=[{id:'soap',text:'Cu ce spălăm mânuțele?'},{id:'towel',text:'Cu ce ștergem mânuțele?'},{id:'brush',text:'Cu ce curățăm dințișorii?'},{id:'comb',text:'Cu ce aranjăm părul?'}];
const names={soap:'Săpun',brush:'Periuță',towel:'Prosop',comb:'Pieptene',ball:'Minge',car:'Mașinuță'};
const spots=[{x:185,y:187},{x:305,y:178},{x:425,y:181},{x:545,y:190},{x:185,y:333},{x:305,y:340},{x:425,y:336},{x:545,y:330}];
let sort={phase:'colors',selected:null,placed:[],picked:[],feedback:'Atinge un obiect, apoi coșulețul de aceeași culoare.'};
let clean=new Set(),brushDown=false,drag=null,suppressClick=0;
let strokes=new Map(),toothTracking=null,brushAudioCtx=null,brushAudioTime=0;
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','&quot;':'&quot;'}[c]||'&#39;'));}
function icon(kind,color){return '<span class="hg-icon hg-icon-premium">'+window.MaricicaHygieneArt.object(kind,color)+'</span>';}
function basketSVG(color){return window.MaricicaHygieneArt.basket(color);}
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
 else{clean=new Set();strokes=new Map();brushDown=false;toothTracking=null;}
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
function choicePhoto(t){
 return '<span class="hg-choice-photo hg-illustrated-object">'+window.MaricicaHygieneArt.object(t.id,t.id==='comb'?'purple':t.id==='towel'?'blue':t.id==='brush'?'blue':'red')+'</span>';
}
function choiceStage(){
 const n=sort.picked.length;
 const task=tasks[Math.min(n,tasks.length-1)];
 const finished=n===tasks.length;
 const items=needs.map(t=>'<button type="button" class="hg-choice hg-choice-premium '+(sort.picked.includes(t.id)?'hg-picked':'')+'" data-hg="choose" data-id="'+t.id+'" '+(sort.picked.includes(t.id)?'disabled':'')+' aria-label="'+t.label+'">'+choicePhoto(t)+'<strong>'+t.label+'</strong>'+(sort.picked.includes(t.id)?'<span class="hg-check" aria-hidden="true">✓</span>':'')+'</button>').join('');
 const prompt=finished?'🌟 Bravo! Ai ales toate obiectele potrivite!':task.text;
 const left='<section class="hg-game-surface hg-choice-stage"><div class="hg-stage-head"><strong>2 · Ce îi trebuie Maricicăi?</strong><span>'+n+' din 4</span></div><div class="hg-progress"><span style="width:'+(n*25)+'%"></span></div><p class="hg-stage-tip hg-task-prompt" aria-live="polite">'+prompt+'</p><div class="hg-choices">'+items+'</div></section>';
 const collected=sort.picked.map(id=>'<span class="hg-collected">'+choicePhoto(needs.find(t=>t.id===id))+'<small>'+needs.find(t=>t.id===id).label+'</small></span>').join('');
 const panel=sidePanel('Alegem obiectul potrivit pentru fiecare activitate de îngrijire.','<div class="hg-personal-basket"><span>Coșulețul Maricicăi</span><div class="hg-collected-items">'+(collected||'<span class="hg-placeholder">Obiectele alese apar aici ♡</span>')+'</div></div><div class="hg-feedback" aria-live="polite">'+esc(sort.feedback)+'</div>','<button class="hg-small-action" data-hg="hear" type="button">🔊 Ascultă întrebarea</button><button class="hg-small-action" data-hg="restart-sort" type="button">↻ Reia jocul</button>'+(finished?'<button class="hg-primary" data-hg="restart-sort" type="button">Joacă din nou ✨</button>':''));
 return '<div class="hg-play-layout">'+left+panel+'</div>';
}
function toothSvg(x,y,i){
 const lower=i>=4, outer=(i%4===0||i%4===3);
 const angle=outer?(i%4===0?-4:4):0;
 const wide=outer?.88:1.04;
 return '<g class="hg-tooth-unit" transform="translate('+x+' '+y+') rotate('+angle+')'+(lower?' rotate(180)':'')+' scale('+wide+' 1)">'+
 '<path d="M-43 -55 C-31 -64 29 -63 43 -53 C53 -39 52 -11 47 15 C44 39 34 52 14 56 Q0 59 -15 56 C-35 52 -44 40 -47 15 C-51 -13 -54 -41 -43 -55Z" fill="url(#hg-enamel-depth)" stroke="#faf8fb" stroke-width="3.4" filter="url(#hg-tooth-shadow)"/>'+
 '<path d="M-38 -51 C-20 -59 24 -57 38 -48 Q43 -26 41 -13 C23 -20 -24 -22 -42 -9 Q-43 -32 -38 -51Z" fill="url(#hg-enamel-top)" opacity=".78"/>'+
 '<path d="M-36 -47 Q-25 -52 -17 -50" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".87"/>'+
 '<path d="M-33 -23 Q-38 3 -28 24 Q-22 36 -8 43" stroke="url(#hg-tooth-gloss)" stroke-width="10" fill="none" stroke-linecap="round"/>'+
 '<path d="M28 -34 Q36 2 28 29" stroke="#b0c0d1" stroke-width="3.6" stroke-linecap="round" fill="none" opacity=".42"/>'+
 '<path d="M-25 42 Q0 54 25 42" stroke="#fefeff" stroke-width="3.2" fill="none" opacity=".79"/>'+
 '</g>';
}
function stainSvg(p,i){
 const offset=i%2===0?-8:8;
 return '<g data-hg-stain="'+i+'" class="hg-stain hg-dental-plaque" transform="translate('+p.x+' '+p.y+')" role="button" tabindex="0" aria-label="Dintele '+(i+1)+' — trei mișcări sus-jos">'+
 '<path d="M-22 '+(-9+offset/3)+' Q-16 -21 -8 -16 Q2 -23 10 -12 Q22 -16 25 -3 Q18 5 12 4 Q5 15 -5 9 Q-17 14 -23 5 Q-31 -4 -22 '+(-9+offset/3)+'Z" fill="url(#hg-plaque-glow)" stroke="#b48a65" stroke-opacity=".16" stroke-width="2"/>'+
 '<path d="M-17 -7 Q-11 -12 -5 -8 M9 -3 Q14 -5 18 -2" fill="none" stroke="#e8cba8" opacity=".7" stroke-linecap="round" stroke-width="5"/>'+
 '<circle cx="-23" cy="3" r="3" fill="#c8a581" opacity=".45"/><circle cx="18" cy="9" r="2.4" fill="#ae8669" opacity=".36"/>'+
 '</g>';
}
function mouthSvg(){
 const xs=[185,305,425,545];
 const teeth=xs.map((x,i)=>toothSvg(x,182,i)).join('')+xs.map((x,i)=>toothSvg(x,337,i+4)).join('');
 return '<svg class="hg-mouth-svg hg-realistic-mouth" viewBox="0 0 740 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un zâmbet 3D cu opt dinți. Periază fiecare dinte sus și jos de trei ori." data-hg-mouth="yes">'+
 '<defs>'+
 '<radialGradient id="hg-lip-volume" cx=".25" cy=".15" r=".92"><stop stop-color="#fff1ec"/><stop offset=".22" stop-color="#ffb9bf"/><stop offset=".49" stop-color="#ff8fa4"/><stop offset=".77" stop-color="#ee6889"/><stop offset="1" stop-color="#bf446b"/></radialGradient>'+
 '<linearGradient id="hg-lip-shine" x1=".1" y1="0" x2=".62" y2="1"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".52" stop-color="#ffe2e5" stop-opacity=".38"/><stop offset="1" stop-color="#ffe2e5" stop-opacity="0"/></linearGradient>'+
 '<radialGradient id="hg-inner-mouth" cx=".55" cy=".8" r=".92"><stop stop-color="#bd6683"/><stop offset=".31" stop-color="#8c4567"/><stop offset=".71" stop-color="#692b4f"/><stop offset="1" stop-color="#411e3c"/></radialGradient>'+
 '<linearGradient id="hg-gums" x1="0" y1="0" x2=".09" y2="1"><stop stop-color="#cf5578"/><stop offset=".44" stop-color="#ed9aaf"/><stop offset=".8" stop-color="#ffbdc7"/><stop offset="1" stop-color="#f1a2ae"/></linearGradient>'+
 '<linearGradient id="hg-enamel-depth" x1=".05" y1=".06" x2=".94" y2=".97"><stop stop-color="#fffefc"/><stop offset=".18" stop-color="#fff"/><stop offset=".4" stop-color="#fbfbff"/><stop offset=".75" stop-color="#eef3fc"/><stop offset=".93" stop-color="#d8e3f0"/><stop offset="1" stop-color="#bccddd"/></linearGradient>'+
 '<linearGradient id="hg-enamel-top" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5eef4"/><stop offset=".65" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="hg-tooth-gloss"><stop stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>'+
 '<radialGradient id="hg-plaque-glow"><stop stop-color="#b28a60" stop-opacity=".83"/><stop offset=".65" stop-color="#d5ae80" stop-opacity=".64"/><stop offset="1" stop-color="#ead5b5" stop-opacity=".19"/></radialGradient>'+
 '<linearGradient id="hg-brush-3d" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#effaff"/><stop offset=".24" stop-color="#a7e5ff"/><stop offset=".63" stop-color="#53aff1"/><stop offset=".92" stop-color="#3282c8"/><stop offset="1" stop-color="#2469ac"/></linearGradient>'+
 '<filter id="hg-tooth-shadow" x="-30%" y="-30%" width="160%" height="165%"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="#37152f" flood-opacity=".35"/></filter>'+
 '<filter id="hg-lip-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="13" stdDeviation="12" flood-color="#924365" flood-opacity=".23"/></filter>'+
 '</defs>'+
 '<ellipse cx="370" cy="479" rx="290" ry="17" fill="#816187" opacity=".15"/>'+
 '<path d="M45 254 C45 166 103 111 183 97 C259 78 297 97 368 98 C440 97 497 78 571 98 C651 118 694 176 695 260 C693 368 626 429 542 445 C470 463 418 456 367 459 C307 457 258 465 184 444 C94 419 46 360 45 254Z" fill="url(#hg-lip-volume)" stroke="#ffedf2" stroke-width="4" filter="url(#hg-lip-shadow)"/>'+
 '<path d="M94 251 C92 192 136 149 201 140 C259 132 314 145 371 143 C430 145 492 131 549 143 C613 157 649 202 649 263 C648 341 598 385 534 400 C475 413 428 405 369 409 C307 409 252 413 194 401 C129 383 93 341 94 251Z" fill="url(#hg-inner-mouth)" stroke="#7a304f" stroke-width="8"/>'+
 '<path d="M122 162 Q182 140 243 146 Q304 128 370 144 Q439 129 500 145 Q569 143 624 170 L612 212 Q497 172 371 176 Q248 168 127 217Z" fill="url(#hg-gums)"/>'+
 '<path d="M126 361 Q253 399 369 371 Q488 391 615 360 L604 394 Q497 427 370 410 Q232 428 138 393Z" fill="url(#hg-gums)"/>'+
 '<path d="M212 398 Q372 334 526 398 Q500 419 370 413 Q254 418 212 398Z" fill="#d97694" opacity=".65"/>'+
 teeth+spots.map(stainSvg).join('')+
 '<path d="M126 138 Q211 100 320 116" stroke="url(#hg-lip-shine)" stroke-width="13" stroke-linecap="round" fill="none"/>'+
 '<path d="M388 113 Q483 105 577 138" stroke="#fff5f5" stroke-width="8" opacity=".56" stroke-linecap="round" fill="none"/>'+
 '<path d="M144 427 Q367 459 585 419" stroke="#ffc1c9" stroke-width="8" opacity=".44" stroke-linecap="round" fill="none"/>'+
 '<g id="hg-brush-cursor" class="hg-brush-cursor" transform="translate(676 465) rotate(-36)" filter="url(#hg-tooth-shadow)">'+
 '<rect x="-16" y="-9" width="132" height="27" rx="13.5" fill="url(#hg-brush-3d)" stroke="#e7f8ff" stroke-width="2.8"/>'+
 '<path d="M8 -4 H90" stroke="#fff" stroke-width="5" opacity=".6" stroke-linecap="round"/>'+
 '<rect x="-41" y="-19" width="49" height="39" rx="12" fill="url(#hg-brush-3d)" stroke="#e7f8ff" stroke-width="3.2"/>'+
 '<g stroke="#e5f9ff" stroke-width="6.5" stroke-linecap="round"><path d="M-35 -17V-40"/><path d="M-26 -17V-43"/><path d="M-17 -17V-43"/><path d="M-8 -17V-43"/><path d="M1 -17V-39"/></g>'+
 '<path d="M-37 -14H6" stroke="#fff" stroke-width="4" opacity=".7" fill="none"/>'+
 '</g></svg>';
}
function brushStage(){
 const percent=Math.round(clean.size/spots.length*100),done=clean.size===spots.length;
 const left='<section class="hg-game-surface hg-dental-surface"><div class="hg-stage-head"><strong>Dințișorii veseli</strong><span>'+clean.size+' din '+spots.length+' curățați</span></div><div class="hg-progress"><span style="width:'+percent+'%"></span></div><div class="hg-dental-board '+(done?'hg-all-clean':'')+'">'+mouthSvg()+'<div class="hg-sparkles" aria-hidden="true">✦ ✧ ✦</div></div><p class="hg-bottom-tip">↕️ Freacă fiecare dinte de 3 ori în sus și în jos.</p></section>';
 const text=done?'✨ Toți dințișorii sunt curați! Minunat!':'Periază de trei ori sus-jos pe fiecare dinte.';
 const panel=sidePanel('Ține degetul pe un dinte și mișcă-l în sus și în jos de trei ori.','<div class="hg-dental-badge '+(done?'done':'')+'"><span aria-hidden="true">'+(done?'🌟':'🪥')+'</span><strong>'+percent+'%</strong><small>Dințișori curați</small></div><div class="hg-feedback" aria-live="polite">'+text+'</div><p class="hg-teacher-note">Petele se estompează după fiecare mișcare completă și dispar numai la a treia.</p>','<button class="hg-small-action" data-hg="hear" type="button">🔊 Ascultă indicația</button><button class="hg-primary" data-hg="restart-brush" type="button">↻ Reia curățarea</button>');
 return '<div class="hg-play-layout">'+left+panel+'</div>';
}
function draw(){
 if(state.view==='hygiene-sort')shell('🧺 CULORI ȘI IGIENĂ','Coșulețele cu obiecte de igienă','Alegem, sortăm și descoperim ce ne ajută să fim curați.',sort.phase==='colors'?sortStage():choiceStage());
 if(state.view==='hygiene-brush'){
  shell('🪥 ACTIVITATE PRACTICĂ','Dințișorii veseli','Periem fiecare dinte de trei ori, cu sunet de periaj.',brushStage());
  clean.forEach(i=>host.querySelector('[data-hg-stain="'+i+'"]')?.classList.add('hg-cleaned'));
  strokes.forEach((_,i)=>{if(!clean.has(i))progressStroke(i);});
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
 const expected=tasks[sort.picked.length];
 if(!expected||sort.picked.includes(id))return;
 if(id===expected.id){
  sort.picked.push(id);
  sort.feedback=sort.picked.length===4?'🌟 Bravo! Toate obiectele potrivite sunt în coșuleț!':'Foarte bine! '+needs.find(t=>t.id===id).label+' este alegerea potrivită.';
  if(typeof tonal==='function')tonal(true);
 }else{
  sort.feedback='Mai încearcă. '+expected.text;
  if(typeof tonal==='function')tonal(false);
 }
 draw();
 if(sort.picked.length===4&&typeof launchConfetti==='function')launchConfetti(host.querySelector('.hg-game-surface'),34);
}
function cleanSpot(i){
 if(state.view!=='hygiene-brush'||clean.has(i)||i<0||i>=spots.length)return;
 const st=strokes.get(i);
 if(!st||st.halves<6)return; // Neaparat trei cicluri complete sus-jos.
 clean.add(i);
 const stain=host.querySelector('[data-hg-stain="'+i+'"]');
 if(stain){stain.classList.remove('hg-level-1','hg-level-2');stain.classList.add('hg-cleaned');}
 const percent=Math.round(clean.size/spots.length*100);
 const bar=host.querySelector('.hg-progress>span');if(bar)bar.style.width=percent+'%';
 const stageCount=host.querySelector('.hg-stage-head>span');if(stageCount)stageCount.textContent=clean.size+' din '+spots.length+' curățați';
 const badge=host.querySelector('.hg-dental-badge strong');if(badge)badge.textContent=percent+'%';
 const msg=host.querySelector('.hg-feedback');if(msg)msg.textContent=clean.size===spots.length?'✨ Toți dințișorii sunt curați! Minunat!':'Bravo! Un dințișor a devenit curat.';
 if(typeof tonal==='function')tonal(true);
 if(clean.size===spots.length){host.querySelector('.hg-dental-board')?.classList.add('hg-all-clean');host.querySelector('.hg-dental-badge')?.classList.add('done');if(typeof launchConfetti==='function')launchConfetti(host.querySelector('.hg-dental-surface'),42);}
}
function svgPoint(event,svg){
 const r=svg.getBoundingClientRect();
 if(!r.width||!r.height)return null;
 return {x:(event.clientX-r.left)*740/r.width,y:(event.clientY-r.top)*520/r.height};
}
function nearestTooth(point){
 let best=-1,dist=Infinity;
 for(let i=0;i<spots.length;i++){
  if(clean.has(i))continue;
  const d=Math.hypot(point.x-spots[i].x,point.y-spots[i].y);
  if(d<dist){best=i;dist=d;}
 }
 return dist<72?best:-1;
}
function progressStroke(i){
 const t=strokes.get(i);
 if(!t)return;
 const cycles=Math.min(3,Math.floor(t.halves/2));
 const stain=host.querySelector('[data-hg-stain="'+i+'"]');
 if(stain){
  stain.classList.toggle('hg-level-1',cycles===1);
  stain.classList.toggle('hg-level-2',cycles===2);
  stain.querySelectorAll('.hg-stroke-dots circle').forEach((dot,j)=>dot.classList.toggle('on',j<cycles));
  stain.setAttribute('aria-label','Dintele '+(i+1)+', '+cycles+' din 3 mișcări complete');
 }
 const msg=host.querySelector('.hg-feedback');
 if(msg&&cycles<3)msg.textContent=cycles===0?'Mișcă periuța în sus și în jos pe același dinte.':'Foarte bine! '+cycles+' din 3 mișcări pe dintele acesta.';
 if(t.halves>=6)cleanSpot(i);
}
let noiseBuffer=null;
function brushSound(){
 if(state.muted)return;
 const now=Date.now();
 if(now-brushAudioTime<90)return;
 brushAudioTime=now;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  brushAudioCtx=brushAudioCtx||new Audio();
  if(brushAudioCtx.state==='suspended')brushAudioCtx.resume().catch(()=>{});
  const ctx=brushAudioCtx;
  if(!noiseBuffer){
   noiseBuffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.08),ctx.sampleRate);
   const data=noiseBuffer.getChannelData(0);
   for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.65;
  }
  const src=ctx.createBufferSource();src.buffer=noiseBuffer;
  const band=ctx.createBiquadFilter();band.type='bandpass';band.frequency.value=1550;band.Q.value=.7;
  const gain=ctx.createGain();const when=ctx.currentTime;
  gain.gain.setValueAtTime(.0001,when);
  gain.gain.linearRampToValueAtTime(.042,when+.008);
  gain.gain.exponentialRampToValueAtTime(.0001,when+.075);
  src.connect(band);band.connect(gain);gain.connect(ctx.destination);
  src.start(when);src.stop(when+.08);
 }catch(e){/* sunetul nu trebuie sa intrerupa jocul */}
}
function brushAt(event,first=false){
 const svg=host.querySelector('[data-hg-mouth]');if(!svg)return;
 const point=svgPoint(event,svg);if(!point)return;
 const cursor=svg.querySelector('#hg-brush-cursor');
 if(cursor)cursor.setAttribute('transform','translate('+(point.x+16)+' '+(point.y+20)+') rotate(-36)');
 if(first){
  const i=nearestTooth(point);
  if(i<0){toothTracking=null;return;}
  const old=strokes.get(i)||{halves:0};
  toothTracking={index:i,lastY:point.y,dir:0,travel:0,credited:false};
  strokes.set(i,old);
  return;
 }
 if(!toothTracking||clean.has(toothTracking.index))return;
 const i=toothTracking.index,p=spots[i];
 if(Math.hypot(point.x-p.x,point.y-p.y)>77){toothTracking.lastY=point.y;toothTracking.dir=0;toothTracking.travel=0;toothTracking.credited=false;return;}
 const dy=point.y-toothTracking.lastY;toothTracking.lastY=point.y;
 if(Math.abs(dy)<2.4)return;
 const direction=dy>0?1:-1;
 if(direction!==toothTracking.dir){
  toothTracking.dir=direction;
  toothTracking.travel=0;
  toothTracking.credited=false;
 }
 if(!toothTracking.credited){
  toothTracking.travel+=Math.abs(dy);
  if(toothTracking.travel>=20){
   toothTracking.credited=true;
   const entry=strokes.get(i)||{halves:0};
   entry.halves=Math.min(6,entry.halves+1);
   strokes.set(i,entry);
   progressStroke(i);
  }
 }
 brushSound();
}
host.addEventListener('pointerdown',e=>{
 if(state.view==='hygiene-brush'&&e.target.closest('[data-hg-mouth]')){
  if(e.button!==0&&e.pointerType==='mouse')return;
  brushDown=true;
  try{e.target.closest('[data-hg-mouth]').setPointerCapture(e.pointerId);}catch(err){}
  brushAt(e,true);e.preventDefault();return;
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
 if(brushDown){brushDown=false;toothTracking=null;}
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
  if(typeof speak==='function')speak(state.view==='hygiene-brush'?'Mișcă periuța în sus și în jos de trei ori pe fiecare dințișor.':sort.phase==='colors'?'Alege un obiect. Pune-l în coșulețul de aceeași culoare.':tasks[Math.min(sort.picked.length,3)].text);
  return;
 }
 if(action==='restart-sort'){newGame('sort');return;}
 if(action==='restart-brush'){newGame('brush');return;}
 if(action==='next-phase'){sort.phase='choose';sort.selected=null;sort.feedback='Găsește obiectele pentru curățenie.';draw();return;}
 
 if(state.view!=='hygiene-sort'||Date.now()<suppressClick)return;
 if(action==='token'){sort.selected=t.dataset.id;sort.feedback='Acum alege coșulețul potrivit.';draw();return;}
 if(action==='basket'){if(sort.selected)place(sort.selected,t.dataset.color);else{sort.feedback='Alege mai întâi un obiect din tavă.';draw();}return;}
 if(action==='choose'){choose(t.dataset.id);return;}
},true);
document.addEventListener('keydown',e=>{
 if(state.view!=='hygiene-brush')return;
 const spot=e.target.closest('[data-hg-stain]');
 if(!spot)return;
 if(e.key==='ArrowUp'||e.key==='ArrowDown'){
  e.preventDefault();
  const i=Number(spot.dataset.hgStain);
  if(clean.has(i))return;
  const dir=e.key==='ArrowUp'?-1:1;
  const st=strokes.get(i)||{halves:0,keyDir:0};
  if(st.keyDir===dir)return;
  st.keyDir=dir;st.halves=Math.min(6,st.halves+1);strokes.set(i,st);
  brushSound();progressStroke(i);
 }else if(e.key==='Enter'||e.key===' '){
  e.preventDefault();
  if(typeof speak==='function')speak('Folosește săgețile în sus și în jos de trei ori.');
 }
});
window.MaricicaHygieneWorkshops={openSort:()=>newGame('sort'),openBrush:()=>newGame('brush'),version:'2.0',games:2};
if(state.view==='home')homeCards();
if(window.location.hash==='#cosulete')newGame('sort');
if(window.location.hash==='#dintisori')newGame('brush');
})();