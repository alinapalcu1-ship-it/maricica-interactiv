/* Maricica • Atelierele curățeniei — două activități tactile (sortare și periaj).
   Nu modifică povestea, poezia, Memory sau înregistrările audio. */
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
const spots=[{x:185,y:168},{x:299,y:180},{x:417,y:149},{x:520,y:166},{x:189,y:319},{x:295,y:344},{x:416,y:345},{x:519,y:329}];
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
/* Pictograma fotografică 3D din setul aprobat. Un al doilea strat 3D, curat,
   dezvăluie separat fiecare dinte după 3 cicluri complete sus-jos. */
function stainSvg(p,i){
 return '<g data-hg-stain="'+i+'" class="hg-dental-hit-area" role="button" tabindex="0" aria-label="Periază dintele '+(i+1)+' de trei ori sus-jos">'+
 '<ellipse cx="'+p.x+'" cy="'+p.y+'" rx="47" ry="50" fill="#fff" opacity=".001"/>'+
 '</g>';
}
function mouthSvg(){
 const w=740,h=520,photo='assets/hygiene/teeth-3d-game.webp',cleanPhoto='assets/hygiene/teeth-3d-clean.webp';
 const imageAttrs='x="23" y="0" width="694" height="520" preserveAspectRatio="none"';
 // Contururi ale celor opt coroane, corelate cu fotografia 3D, în coordonate 1152 × 864.
 const toothOutlines=[
 [[236,238],[250,218],[275,200],[310,190],[349,198],[376,228],[387,272],[377,337],[345,349],[277,343],[238,318],[227,277]],
 [[385,225],[402,198],[432,185],[474,181],[517,191],[547,214],[566,262],[560,334],[539,353],[475,357],[417,341],[389,310]],
 [[563,222],[592,192],[639,182],[684,187],[725,211],[739,250],[734,331],[713,353],[648,355],[596,341],[566,301]],
 [[740,220],[762,197],[803,192],[838,201],[868,231],[873,274],[858,330],[827,344],[774,340],[740,298]],
 [[240,478],[267,458],[315,464],[356,487],[383,526],[373,585],[345,612],[294,614],[254,583],[237,536]],
 [[378,503],[411,486],[469,486],[530,492],[555,516],[551,595],[528,638],[493,652],[425,644],[390,610],[376,553]],
 [[546,508],[587,490],[638,488],[697,493],[729,519],[731,590],[707,631],[670,650],[607,641],[564,613]],
 [[726,493],[760,474],[800,460],[830,480],[853,509],[852,562],[827,595],[785,611],[739,580],[723,540]]
 ];
 const clips=toothOutlines.map((poly,i)=>'<clipPath id="hg-clip-'+i+'"><polygon points="'+poly.map(([x,y])=>(23+x*694/1152).toFixed(1)+','+(y*520/864).toFixed(1)).join(' ')+'"/></clipPath>').join('');
 const cleanLayers=spots.map((p,i)=>'<g class="hg-clean-tooth" data-hg-clean="'+i+'" clip-path="url(#hg-clip-'+i+')" aria-hidden="true"><image href="'+cleanPhoto+'" '+imageAttrs+'/></g>').join('');
 const hitAreas=spots.map(stainSvg).join('');
 return '<svg class="hg-mouth-svg hg-photo-mouth" viewBox="0 0 740 520" xmlns="http://www.w3.org/2000/svg" role="img" data-hg-mouth="yes" aria-label="Fotografie 3D cu un zâmbet și opt dinți. Curăță fiecare dinte de trei ori sus și jos.">'+
 '<defs>'+clips+'</defs>'+
 '<image href="'+photo+'" '+imageAttrs+' class="hg-mouth-background"/>'+
 '<image href="'+cleanPhoto+'" '+imageAttrs+' class="hg-mouth-all-clean"/>'+
 cleanLayers+hitAreas+
 '<g id="hg-brush-cursor" class="hg-brush-cursor hg-brush-3d" transform="translate(660 447)" aria-hidden="true">'+
 '<image href="assets/hygiene/brush-blue-3d.webp" x="-68" y="-52" width="136" height="102" preserveAspectRatio="xMidYMid meet"/>'+
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
  clean.forEach(i=>{host.querySelector('[data-hg-stain="'+i+'"]')?.classList.add('hg-cleaned');host.querySelector('[data-hg-clean="'+i+'"]')?.classList.add('hg-cleaned');});
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
 const cleanLayer=host.querySelector('[data-hg-clean="'+i+'"]');
 if(cleanLayer){cleanLayer.classList.remove('hg-level-1','hg-level-2');cleanLayer.classList.add('hg-cleaned');}
 const percent=Math.round(clean.size/spots.length*100);
 const bar=host.querySelector('.hg-progress>span');if(bar)bar.style.width=percent+'%';
 const stageCount=host.querySelector('.hg-stage-head>span');if(stageCount)stageCount.textContent=clean.size+' din '+spots.length+' curățați';
 const badge=host.querySelector('.hg-dental-badge strong');if(badge)badge.textContent=percent+'%';
 const msg=host.querySelector('.hg-feedback');if(msg)msg.textContent=clean.size===spots.length?'✨ Toți dințișorii sunt curați! Minunat!':'Bravo! Un dințișor a devenit curat.';
 if(typeof tonal==='function')tonal(true);
 if(clean.size===spots.length){host.querySelector('.hg-dental-board')?.classList.add('hg-all-clean');host.querySelector('.hg-dental-badge')?.classList.add('done');if(typeof launchConfetti==='function')launchConfetti(host.querySelector('.hg-dental-surface'),14);}
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
  stain.setAttribute('aria-label','Dintele '+(i+1)+', '+cycles+' din 3 mișcări complete');
 }
 const layer=host.querySelector('[data-hg-clean="'+i+'"]');
 if(layer){layer.classList.toggle('hg-level-1',cycles===1);layer.classList.toggle('hg-level-2',cycles===2);}
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
 if(cursor){cursor.setAttribute('transform','translate('+(point.x+12)+' '+(point.y+20)+')');cursor.classList.add('hg-brush-active');}
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
 if(brushDown){brushDown=false;toothTracking=null;host.querySelector('#hg-brush-cursor')?.classList.remove('hg-brush-active');}
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