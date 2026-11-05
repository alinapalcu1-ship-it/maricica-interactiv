/* MARICICA · ediția 5 | revizie scenă-cu-scenă, jocuri tactile și aceeași identitate vizuală.
   Folosește audio local existent; fără dependențe sau servicii externe. */
(()=>{
'use strict';
const ART='assets/cinema5/';
const BASE='assets/cinema/';
const EXIST='assets/cinema4/';
const sceneImages=[`${ART}01-bedroom-clear.webp`,`${ART}02-mirror-clean.webp`,`${ART}03-classroom-clear.webp`,`${ART}02-mirror-clean.webp`,`${ART}05-washing-clear.webp`,`${ART}02-mirror-clean.webp`];
const motionImages=[`${ART}05-washing-clear.webp`,`${ART}05-washing-clear.webp`,`${ART}05-combing-clear.webp`,`${ART}05-brushing-clear.webp`];
const memoryObjects=[['soap','Săpun'],['comb','Pieptene'],['brush','Periuță'],['water','Apă']];
const safe=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const joy=()=>{if(!state.muted)tonal(true)};
const introVoice=(s)=>{if(!state.muted)speak(s)};
const oldRenderHome=renderHome;
renderHome=function(){oldRenderHome();if(state.view!=='home')return;
 app.classList.add('v5-ready');
 const bear=app.querySelector('.v4-home-teddy');if(bear)bear.src=`${ART}teddy-cutout.webp`;
 const puzzle=app.querySelector('[data-v4="puzzle"]');if(puzzle){puzzle.querySelector('small').textContent='4 sau 6 piese';}
 const memory=app.querySelector('[data-v4="memory"]');if(memory){memory.querySelector('small').textContent='4, 6 sau 8 cartonașe';}
};

// The scenery is a single coherent 3D illustration. No second, overlaid mirror or cut-out face.
// The large speech panel below remains as the only narration text; the scene itself is immersive.
stageDecor=function(ci){
 const name=CHAPTERS[ci].title;
 return `<div class="v5-scene v5-scene-${ci+1}" style="--v5-photo:url('${sceneImages[ci]}')" role="img" aria-label="${safe(name)}. Ilustrație de poveste 3D">
 <img class="v5-scene-photo" src="${sceneImages[ci]}" draggable="false" alt="">
 <div class="v5-scene-lights" aria-hidden="true"><i></i><i></i><i></i></div>
 
 </div>`;
};
const oldCaption=updateCaption;
updateCaption=function(){oldCaption();if(state.view!=='story')return;
 const scene=document.querySelector('.v5-scene');if(!scene)return;
 const idx=state.index,ci=sceneOf(idx),pic=scene.querySelector('.v5-scene-photo');
 let path=sceneImages[ci];
 if(ci===4){path=idx>=43?motionImages[3]:idx>=40?motionImages[2]:motionImages[1]}
 if(ci===5){path=idx>=54?`${ART}06-finale-clear.webp`:`${ART}02-mirror-clean.webp`}
 if(pic&&pic.getAttribute('src')!==path){scene.style.setProperty('--v5-photo',`url('${path}')`);pic.src=path;pic.classList.remove('v5-switch');void pic.offsetWidth;pic.classList.add('v5-switch')}
 scene.classList.toggle('v5-speaking',state.playing&&LINES[idx]?.[1]!=='Narator');
 scene.classList.toggle('v5-sad',ci===2&&idx>=19&&idx<=26);
};

// Recorded audio / exercises are unchanged. Every task now shows what the child should do.
const oldGuided=renderGuided;
renderGuided=function(){oldGuided();if(state.view!=='guided')return;
 const stage=app.querySelector('.guided-stage');if(!stage)return;
 stage.classList.add('v5-guided-stage');
 app.querySelector('.guided-view')?.classList.toggle('v5-has-motion',guided.phase==='motion');
 const girl=stage.querySelector('.v4-guided-girl');
 const image=guided.phase==='motion'?motionImages[Math.min(guided.motion,3)]:guided.phase==='question'?
 [`${ART}washing.webp`,`${ART}brushing.webp`,`${ART}combing.webp`][Math.min(guided.round,2)]:`${ART}mirror-dirty.webp`;
 stage.style.setProperty('--v5-stage-image',guided.phase==='motion'?`url("${image}")`:'none');
 if(guided.phase==='motion'){
   if(girl)girl.hidden=true;
   stage.querySelector('.v4-stage-props')?.remove();
   const icon=app.querySelector('.guided-motion-icon');
   if(icon){icon.src=image;icon.classList.add('v5-motion-photo');icon.alt='Ilustrație 3D a mișcării';}
   app.querySelector('.guided-motion')?.classList.add('v5-motion-card');
 }else if(girl){girl.src=`${BASE}maricica-${guided.phase==='intro'?'dirty':'clean'}.webp`;girl.hidden=false}
 const next=app.querySelector('.guided-toolbar [data-action="games"]');if(next){next.textContent='Puzzle și Memory';next.removeAttribute('data-action');next.dataset.v5='puzzle-open';}
};

// All subsequent navigation is in one clean, child-facing area. Older v4 events are blocked
// during v5 games (we keep the older code as a safe fallback if someone removes v5.js).
let game={type:'',size:4,selected:null,placed:new Set(),cards:[],open:[],found:new Set(),locked:false,version:0};
let finishTimer=0;
function shuffled(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b}
function pieceGeom(size,id){const cols=size===4?2:3,rows=2,col=id%cols,row=Math.floor(id/cols);
 return `background-image:url('${ART}puzzle-story.webp');background-size:${cols*100}% ${rows*100}%;background-position:${cols===1?0:col/(cols-1)*100}% ${rows===1?0:row/(rows-1)*100}%`;
}
function stopGameSound(){clearTimeout(finishTimer);stopAll();modalRoot.innerHTML=''}
function startPuzzle(size=4){stopGameSound();game={type:'puzzle',size,selected:null,order:shuffled(Array.from({length:size},(_,i)=>i)),placed:new Set(),version:game.version+1};state.view='v5-puzzle';renderPuzzle5();introVoice('Construiește imaginea! Alege o piesă și pune-o la locul potrivit.');}
function success(){joy();const surface=document.querySelector('.v5-play-panel');if(surface)launchConfetti(surface,42)}
function selectPiece(id){if(game.placed.has(id))return;game.selected=id;document.querySelectorAll('.v5-tray-piece').forEach(el=>el.classList.toggle('v5-picked',Number(el.dataset.id)===id));}
function placePiece(id){if(state.view!=='v5-puzzle'||game.selected===null||game.placed.has(id))return;
 const chosen=game.selected;if(id===chosen){game.placed.add(chosen);game.selected=null;joy();renderPuzzle5();if(game.placed.size===game.size){success();introVoice('Bravo! Ai făcut puzzle-ul!')}}
 else{tonal(false);const slot=document.querySelector(`.v5-puzzle-slot[data-id="${id}"]`);slot?.classList.add('v5-wrong');setTimeout(()=>slot?.classList.remove('v5-wrong'),420)}}
function renderPuzzle5(){if(state.view!=='v5-puzzle')return;
 const size=game.size,cols=size===4?2:3,rows=2,completed=game.placed.size===size;
 app.innerHTML=`<section class="v5-play"><nav class="v5-play-nav"><button data-action="home">⌂ Acasă</button><span>Jocuri • Puzzle</span></nav>
 <div class="v5-play-panel"><div class="v5-play-heading"><div><span>🧩 POTRIVEȘTE PIESELE</span><h1>Construiește imaginea!</h1><p>Trage piesele sau atinge o piesă și apoi locul ei.</p></div>
 <div class="v5-size-options" role="group" aria-label="Numărul pieselor">${[4,6].map(n=>`<button data-v5="puzzle-size" data-size="${n}" class="${n===size?'active':''}" aria-pressed="${n===size}">${n} piese</button>`).join('')}</div></div>
 <div class="v5-puzzle-layout" style="--cols:${cols};--rows:${rows}"><div class="v5-board" role="group" aria-label="Imagine de completat, ${size} piese">
 ${Array.from({length:size},(_,i)=>`<button class="v5-puzzle-slot ${game.placed.has(i)?'filled':''}" data-v5="slot" data-id="${i}" aria-label="Locul ${i+1}" ${game.placed.has(i)?'disabled':''}><span style="${pieceGeom(size,i)}"></span>${game.placed.has(i)?'':'<b>+</b>'}</button>`).join('')}</div>
 <div class="v5-game-aside"><img class="v5-game-friend" src="${BASE}maricica-clean.webp" alt="Maricica îți arată imaginea"><div class="v5-tray-label">Alege o piesă</div>
 <div class="v5-puzzle-tray" style="--cols:${cols}">${game.order.filter(id=>!game.placed.has(id)).map(id=>`<button class="v5-tray-piece ${game.selected===id?'v5-picked':''}" draggable="true" data-v5="piece" data-id="${id}" aria-label="Piesa ${id+1}"><span style="${pieceGeom(size,id)}"></span></button>`).join('')}</div>
 ${completed?'<strong class="v5-win" role="status">🌟 Minunat! Ai potrivit toate piesele!</strong>':'<small class="v5-puzzle-hint">Piesele se lipesc exact. Fără cronometru.</small>'}
 <div class="v5-game-actions"><button data-v5="puzzle-reset">↻ Reia</button><button data-v5="memory-open">Memory →</button></div>
 </div></div></div></section>`;
}
function startMemory(size=4){stopGameSound();const symbols=memoryObjects.slice(0,size/2).map(x=>x[0]);const cards=shuffled([...symbols,...symbols]);game={type:'memory',size,cards,open:[],found:new Set(),locked:false,version:game.version+1};state.view='v5-memory';renderMemory5();introVoice('Memory! Găsește două imagini la fel.');}
function flipMemory(id){if(state.view!=='v5-memory'||game.locked||game.found.has(id)||game.open.includes(id))return;
 game.open.push(id);renderMemory5();if(game.open.length!==2)return;
 const [i,j]=game.open,ver=game.version;
 if(game.cards[i]===game.cards[j]){game.found.add(i);game.found.add(j);game.open=[];joy();renderMemory5();if(game.found.size===game.size){success();introVoice('Minunat! Ai găsit toate perechile!')}}
 else{game.locked=true;tonal(false);finishTimer=setTimeout(()=>{if(game.version!==ver||state.view!=='v5-memory')return;game.open=[];game.locked=false;renderMemory5()},1100)}
}
function renderMemory5(){if(state.view!=='v5-memory')return;
 const done=game.found.size===game.size,cols=game.size===4?2:game.size===6?3:4;
 app.innerHTML=`<section class="v5-play"><nav class="v5-play-nav"><button data-action="home">⌂ Acasă</button><span>Jocuri • Memory</span></nav>
 <div class="v5-play-panel"><div class="v5-play-heading"><div><span>💗 JOC DE MEMORIE</span><h1>Găsește perechile!</h1><p>Întoarce două cartonașe care arată la fel.</p></div><div class="v5-size-options" role="group" aria-label="Numărul cartonașelor">
 ${[4,6,8].map(n=>`<button data-v5="memory-size" data-size="${n}" class="${n===game.size?'active':''}" aria-pressed="${n===game.size}">${n} piese</button>`).join('')}</div></div>
 <div class="v5-memory-layout"><div class="v5-memory-board" style="--cols:${cols}">${game.cards.map((key,id)=>{const open=game.open.includes(id)||game.found.has(id),label=memoryObjects.find(v=>v[0]===key)?.[1];return `<button data-v5="memory-flip" data-id="${id}" class="v5-memory-tile ${open?'is-open':''} ${game.found.has(id)?'is-matched':''}" aria-label="Cartonașul ${id+1}${open?', '+label:''}" ${game.found.has(id)?'disabled':''}>${open?`<img src="${BASE}${key}.webp?v=7" alt=""><b>${label}</b>`:'<span aria-hidden="true">✿</span>'}</button>`}).join('')}</div>
 <div class="v5-memory-companion"><img src="${BASE}maricica-clean.webp" alt="Maricica te încurajează"/><div class="v5-win">${done?'🌟 Bravo! Ai reușit!':'♡ Hai, mai găsește o pereche!'}</div>
 <div class="v5-game-actions"><button data-v5="memory-reset">↻ Reia</button><button data-v5="puzzle-open">Puzzle →</button></div></div></div></div></section>`;
}

// Catch legacy v4 interactions before their old listener, then use the new games.
document.addEventListener('click',e=>{const t=e.target.closest('[data-v4],[data-v5]');if(!t)return;
 const action=t.dataset.v5||t.dataset.v4;
 const legacy=['puzzle','memory','pick','slot','flip','reset-puzzle','reset-memory'];
 if(!t.hasAttribute('data-v5')&&!legacy.includes(action))return;
 e.stopImmediatePropagation();e.preventDefault();
 switch(action){
 case'puzzle':case'puzzle-open':startPuzzle();break;
 case'memory':case'memory-open':startMemory();break;
 case'puzzle-size':startPuzzle(Number(t.dataset.size));break;
 case'memory-size':startMemory(Number(t.dataset.size));break;
 case'puzzle-reset':startPuzzle(game.size);break;
 case'memory-reset':startMemory(game.size);break;
 case'piece':selectPiece(Number(t.dataset.id));break;
 case'slot':placePiece(Number(t.dataset.id));break;
 case'memory-flip':flipMemory(Number(t.dataset.id));break;
 }
},true);

// Redirect old "other games" controls toward the new concrete games.
renderGames=function(){startPuzzle(4)};

// No duplicated or badly cut teddy over the finale photograph.
showFinale=function(){stopAll();state.view='finale';modalRoot.innerHTML='';
 app.innerHTML=`<section class="v5-finale"><div class="v5-finale-art"><img src="${ART}06-finale-clear.webp" alt="Maricica se joacă fericită cu copiii la grădiniță"><div class="v5-finale-sparkle" aria-hidden="true">✦ ✧ ✦</div></div><div class="v5-finale-copy"><span>★ POVESTEA S-A ÎNCHEIAT</span><h1>Bravo, Maricica!</h1><p>Acum Maricica este curată, fericită și se joacă împreună cu prietenii ei de la grădiniță.</p><div class="v5-finale-actions"><button data-action="guided-start">Ne jucăm împreună!</button><button data-v5="puzzle-open">Puzzle</button><button data-v5="memory-open">Memory</button><button data-action="home">⌂ Acasă</button></div></div></section>`;
 joy();launchConfetti(app.querySelector('.v5-finale-art'),36);
};

const oldTeacher=showTeacher;
showTeacher=function(){oldTeacher();const body=modalRoot.querySelector('.teacher-body');if(body){body.insertAdjacentHTML('beforeend','<p><strong>Jocuri de consolidare:</strong> puzzle cu 4 sau 6 piese și Memory cu 4, 6 sau 8 cartonașe. Piesele se pot trage cu mouse-ul sau degetul, dar se pot și selecta prin două atingeri.</p><p><strong>Accesibilitate:</strong> instrucțiunile audio sunt în limba română; când audio este blocat de browser, apăsați butonul de redare. Nu sunt colectate date personale despre copii.</p>')}};

// Drag/drop for mouse & interactive boards, including touch via Pointer Events.
let dragging=null;
document.addEventListener('dragstart',e=>{const el=e.target.closest('.v5-tray-piece');if(!el)return;selectPiece(Number(el.dataset.id));e.dataTransfer?.setData('text/plain',el.dataset.id);if(e.dataTransfer)e.dataTransfer.effectAllowed='move'});
document.addEventListener('dragover',e=>{if(e.target.closest('.v5-puzzle-slot'))e.preventDefault()});
document.addEventListener('drop',e=>{const target=e.target.closest('.v5-puzzle-slot');if(!target)return;e.preventDefault();const pieceId=e.dataTransfer?.getData('text/plain');if(pieceId!==undefined&&pieceId!==null&&pieceId!=='')game.selected=Number(pieceId);placePiece(Number(target.dataset.id));});
document.addEventListener('pointerdown',e=>{const tile=e.target.closest('.v5-tray-piece');if(!tile||e.pointerType==='mouse')return;dragging={id:Number(tile.dataset.id),startX:e.clientX,startY:e.clientY,move:false};tile.setPointerCapture?.(e.pointerId)},true);
document.addEventListener('pointermove',e=>{if(!dragging)return;if(Math.hypot(e.clientX-dragging.startX,e.clientY-dragging.startY)>12)dragging.move=true;const active=document.querySelector(`.v5-tray-piece[data-id="${dragging.id}"]`);if(active)active.classList.toggle('v5-dragging',dragging.move)},true);
document.addEventListener('pointerup',e=>{if(!dragging)return;const g=dragging;dragging=null;if(!g.move)return;const slot=document.elementFromPoint(e.clientX,e.clientY)?.closest('.v5-puzzle-slot');if(slot){game.selected=g.id;placePiece(Number(slot.dataset.id))}},true);

// When leaving a game, there must be no delayed reveal or ghost touches.
const oldHome=navHome;
navHome=function(){dragging=null;clearTimeout(finishTimer);oldHome()};
renderHome();
})();
