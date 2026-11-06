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
 const bottom=i>=4;
 const rotate=bottom?' rotate(180)':'';
 const width=i%4===0||i%4===3?0.91:1;
 return '<g class="hg-tooth-unit" transform="translate('+x+' '+y+')'+rotate+' scale('+width+' 1)"><path d="M-43 -50 C-24 -58 22 -58 43 -50 C51 -24 53 11 43 33 C35 48 20 55 0 53 C-24 55 -36 48 -44 33 C-53 9 -51 -24 -43 -50Z" fill="url(#hg-enamel-real)" stroke="#e8ecf4" stroke-width="2.3"/><path d="M-39 -44 C-16 -52 19 -51 38 -44 C40 -38 41 -26 41 -12 C31 -26 -31 -27 -40 -9 C-42 -22 -41 -35 -39 -44Z" fill="url(#hg-neck-real)" opacity=".85"/><path d="M-28 -37 C-33 -10 -32 8 -26 21" stroke="#fff" stroke-opacity=".8" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M16 -30 Q31 -24 30 -5" stroke="#c9d4e5" stroke-opacity=".35" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M-31 38 Q0 50 32 38" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/></g>';
}
function stainSvg(p,i){
 const top=i<4;
 const pos=top?'-8':'10';
 return '<g data-hg-stain="'+i+'" class="hg-stain hg-dental-plaque" transform="translate('+p.x+' '+p.y+')" role="button" tabindex="0" aria-label="Dintele '+(i+1)+', necesită 3 mișcări sus-jos">' +
 '<path d="M-24 -20 Q-36 -9 -26 4 Q-18 14 -13 12 Q-6 22 5 12 Q18 18 20 6 Q34 -5 21 -20 Q5 -12 -7 -20Z" fill="url(#hg-plaque-real)" opacity=".85"/>' +
 '<circle cx="-21" cy="-5" r="4" fill="#caa174" opacity=".65"/><circle cx="17" cy="-1" r="3" fill="#b98b61" opacity=".55"/><circle cx="-5" cy="8" r="3.5" fill="#b88f64" opacity=".67"/><path d="M-19 -15Q-8 -9 1 -13" fill="none" stroke="#e4c9a9" stroke-width="4" opacity=".7" stroke-linecap="round"/>' +
 '<g class="hg-stroke-dots" transform="translate(-20 33)"><circle cx="0" cy="0" r="5.5"/><circle cx="19" cy="0" r="5.5"/><circle cx="38" cy="0" r="5.5"/></g></g>';
}
function mouthSvg(){
 const xs=[185,305,425,545];
 const teeth=xs.map((x,i)=>toothSvg(x,180,i)).join('')+xs.map((x,i)=>toothSvg(x,338,i+4)).join('');
 return '<svg class="hg-mouth-svg hg-realistic-mouth" viewBox="0 0 740 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gură cu opt dinți. Periază fiecare dinte sus și jos de trei ori." data-hg-mouth="yes">' +
 '<defs><linearGradient id="hg-enamel-real" x1=".04" x2=".96" y1=".05" y2="1"><stop stop-color="#fff"/><stop offset=".32" stop-color="#fffefa"/><stop offset=".72" stop-color="#eff4fa"/><stop offset="1" stop-color="#d2ddec"/></linearGradient><linearGradient id="hg-neck-real" x1="0" x2=".9" y1="0" y2="1"><stop stop-color="#efe1e1"/><stop offset=".8" stop-color="#fff" stop-opacity=".1"/></linearGradient><radialGradient id="hg-plaque-real"><stop stop-color="#be8754"/><stop offset=".7" stop-color="#d9b186"/><stop offset="1" stop-color="#e4c49e" stop-opacity=".5"/></radialGradient><linearGradient id="hg-lips-real" x1=".1" x2=".92" y1=".12" y2=".9"><stop stop-color="#ffd5d5"/><stop offset=".36" stop-color="#ff9bb1"/><stop offset=".7" stop-color="#f17c99"/><stop offset="1" stop-color="#d95477"/></linearGradient><radialGradient id="hg-mouth-dark"><stop stop-color="#985068"/><stop offset=".65" stop-color="#70324e"/><stop offset="1" stop-color="#57263f"/></radialGradient><linearGradient id="hg-gum-real" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#de6784"/><stop offset=".5" stop-color="#f49eb1"/><stop offset="1" stop-color="#e16e8c"/></linearGradient></defs>' +
 '<ellipse cx="370" cy="470" rx="292" ry="18" fill="#c4779d" opacity=".11"/>' +
 '<path d="M49 259 C45 178 111 123 177 105 C239 89 287 96 370 103 C459 92 533 94 600 124 C666 160 698 207 691 280 C684 383 635 426 559 445 C479 464 422 453 370 455 C294 458 226 462 150 434 C89 413 48 352 49 259Z" fill="url(#hg-lips-real)" stroke="#fff2f0" stroke-width="6"/>' +
 '<path d="M87 259 C87 181 152 151 227 147 C275 145 325 145 370 149 C434 143 499 143 558 154 C620 166 650 214 647 265 C640 345 600 392 533 401 C461 413 423 408 370 408 C305 412 253 413 186 399 C120 382 91 344 87 259Z" fill="url(#hg-mouth-dark)" stroke="#b55775" stroke-width="8"/>' +
 '<path d="M118 160 Q370 98 624 159 Q629 187 617 207 Q496 173 370 175 Q234 173 126 211 Q110 192 118 160Z" fill="url(#hg-gum-real)" />' +
 '<path d="M117 371 Q371 431 625 370 Q615 346 602 333 Q466 360 370 350 Q253 362 133 333 Q123 351 117 371Z" fill="url(#hg-gum-real)" />' +
 '<path d="M206 394 Q370 337 528 398 Q491 418 370 414 Q260 419 206 394Z" fill="#e88da5" opacity=".7"/>' +
 teeth+spots.map(stainSvg).join('')+
 '<path d="M147 132 Q371 105 590 140" stroke="#ffe7eb" stroke-width="11" stroke-linecap="round" fill="none" opacity=".65"/><path d="M147 420 Q367 454 584 419" stroke="#ffb5c4" stroke-width="8" stroke-linecap="round" fill="none" opacity=".38"/>' +
 '<g id="hg-brush-cursor" class="hg-brush-cursor" transform="translate(670 465) rotate(-32)">' +
 '<path d="M-12 -9 Q40 -6 100 -5 Q108 0 100 12 L-12 15 Q-22 11 -22 4Z" fill="#82bfee" stroke="#f9feff" stroke-width="3"/>' +
 '<path d="M12 -2 H80" stroke="#d2f7ff" stroke-width="7" stroke-linecap="round"/>' +
 '<rect x="-40" y="-20" width="42" height="37" rx="14" fill="#6eafe6" stroke="#fff" stroke-width="4"/>' +
 '<path d="M-34 -20V-39M-26 -20V-42M-18 -20V-43M-10 -20V-41M-2 -20V-38" stroke="#e9feff" stroke-width="7" stroke-linecap="round"/>' +
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