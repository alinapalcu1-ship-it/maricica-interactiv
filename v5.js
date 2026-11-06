/* MARICICA · ediția 5 | revizie scenă-cu-scenă, jocuri tactile și aceeași identitate vizuală.
   Folosește audio local existent; fără dependențe sau servicii externe. */
(()=>{
'use strict';
const ART='assets/cinema5/';
const BASE='assets/cinema/';
const EXIST='assets/cinema4/';
const sceneImages=[`${ART}01-bedroom-clear.webp`,`${ART}02-mirror-clean.webp`,`${ART}03-classroom-clear.webp`,`${ART}02-mirror-clean.webp`,`${ART}05-washing-clear.webp`,`${ART}02-mirror-clean.webp`];
const motionImages=[`${ART}05-washing-clear.webp`,`${ART}05-washing-clear.webp`,`${ART}05-combing-clear.webp`,`${ART}05-brushing-clear.webp`];
const memoryObjects=[['soap','Săpun'],['comb','Pieptene'],['brush','Periuță'],['water','Apă'],['maricica-clean','Maricica'],['teddy-cutout','Ursuleț'],['towel','Prosop'],['mirror','Oglindă']];
const memoryImg=key=>key==='teddy-cutout'?`${ART}teddy-cutout.webp?v=8`:`${BASE}${key}.webp?v=8`;
const safe=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const joy=()=>{if(!state.muted)tonal(true)};
const introVoice=(s)=>{if(!state.muted)speak(s)};
const oldRenderHome=renderHome;
renderHome=function(){oldRenderHome();if(state.view!=='home')return;
 app.classList.add('v5-ready');
 const bear=app.querySelector('.v4-home-teddy');if(bear)bear.src=`${ART}teddy-cutout.webp`;
 app.querySelector('[data-v4="puzzle"]')?.remove();
 const memory=app.querySelector('[data-v4="memory"]');if(memory){memory.querySelector('small').textContent='2, 3 sau 4 perechi';}
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
 if(!scene.classList.contains('v8-scene')&&pic&&pic.getAttribute('src')!==path){scene.style.setProperty('--v5-photo',`url('${path}')`);pic.src=path;pic.classList.remove('v5-switch');void pic.offsetWidth;pic.classList.add('v5-switch')}
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
 const next=app.querySelector('.guided-toolbar [data-action="games"]');if(next){next.textContent='Memory';next.removeAttribute('data-action');next.dataset.v5='memory-open';}
};

// All subsequent navigation is in one clean, child-facing area. Older v4 events are blocked
// during v5 games (we keep the older code as a safe fallback if someone removes v5.js).
let game={type:'',size:4,selected:null,placed:new Set(),cards:[],open:[],found:new Set(),locked:false,version:0};
let finishTimer=0;
function shuffled(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b}
function stopGameSound(){clearTimeout(finishTimer);stopAll();modalRoot.innerHTML=''}
function success(){joy();const surface=document.querySelector('.v5-play-panel');if(surface)launchConfetti(surface,27)}
function startMemory(size=4){size=[4,6,8].includes(size)?size:4;stopGameSound();const symbols=memoryObjects.slice(0,size/2).map(x=>x[0]);const cards=shuffled([...symbols,...symbols]);game={type:'memory',size,cards,open:[],found:new Set(),locked:false,version:game.version+1};state.view='v5-memory';renderMemory5();introVoice('Memory! Găsește două imagini la fel.');}
function flipMemory(id){if(state.view!=='v5-memory'||game.locked||game.found.has(id)||game.open.includes(id))return;
 game.open.push(id);renderMemory5();if(game.open.length!==2)return;
 const [i,j]=game.open,ver=game.version;
 if(game.cards[i]===game.cards[j]){game.found.add(i);game.found.add(j);game.open=[];joy();renderMemory5();if(game.found.size===game.size){success();introVoice('Minunat! Ai găsit toate perechile!')}}
 else{game.locked=true;tonal(false);finishTimer=setTimeout(()=>{if(game.version!==ver||state.view!=='v5-memory')return;game.open=[];game.locked=false;renderMemory5()},1100)}
}
function renderMemory5(){if(state.view!=='v5-memory')return;
 const done=game.found.size===game.size,cols=game.size===4?2:game.size===6?3:4;
 app.innerHTML=`<section class="v5-play"><nav class="v5-play-nav"><button data-action="home">⌂ Acasă</button><span>Jocuri • Memory</span></nav>
 <div class="v5-play-panel"><div class="v5-play-heading"><div><span>💗 JOC DE MEMORIE</span><h1>Găsește perechile!</h1><p>Întoarce două cartonașe care arată la fel.</p></div><div class="v5-size-options" role="group" aria-label="Numărul perechilor">
 ${[2,3,4].map(n=>`<button data-v5="memory-size" data-size="${n*2}" class="${n*2===game.size?'active':''}" aria-pressed="${n*2===game.size}">${n} perechi</button>`).join('')}</div></div>
 <div class="v5-memory-layout"><div class="v5-memory-board v5-memory-board-${game.size}" style="--cols:${cols}">${game.cards.map((key,id)=>{const open=game.open.includes(id)||game.found.has(id),label=memoryObjects.find(v=>v[0]===key)?.[1];return `<button data-v5="memory-flip" data-id="${id}" class="v5-memory-tile ${open?'is-open':''} ${game.found.has(id)?'is-matched':''}" aria-label="Cartonașul ${id+1}${open?', '+label:''}" ${game.found.has(id)?'disabled':''}>${open?`<img src="${memoryImg(key)}" alt=""><b>${label}</b>`:'<span aria-hidden="true">✿</span>'}</button>`}).join('')}</div>
 <div class="v5-memory-companion"><img src="${BASE}maricica-clean.webp" alt="Maricica te încurajează"/><div class="v5-win">${done?'🌟 Bravo! Ai reușit!':'♡ Hai, mai găsește o pereche!'}</div>
 <div class="v5-game-actions"><button data-v5="memory-reset">↻ Reia jocul</button></div></div></div></div></section>`;
}

// Catch legacy v4 interactions before their old listener, then use the new games.
document.addEventListener('click',e=>{const t=e.target.closest('[data-v4],[data-v5]');if(!t)return;
 const action=t.dataset.v5||t.dataset.v4;
 const legacy=['puzzle','memory','pick','slot','flip','reset-puzzle','reset-memory'];
 if(!t.hasAttribute('data-v5')&&!legacy.includes(action))return;
 
 e.stopImmediatePropagation();e.preventDefault();
 switch(action){
 case'puzzle':case'puzzle-open':case'puzzle-size':case'puzzle-reset':startMemory(4);break;
 case'memory':case'memory-open':startMemory(4);break;
 case'memory-size':startMemory(Number(t.dataset.size));break;
 case'memory-reset':startMemory(game.size);break;
 case'memory-flip':flipMemory(Number(t.dataset.id));break;
 }
},true);

// Redirect old "other games" controls toward the new concrete games.
renderGames=function(){startMemory(4)};

// No duplicated or badly cut teddy over the finale photograph.
showFinale=function(){stopAll();state.view='finale';modalRoot.innerHTML='';
 app.innerHTML=`<section class="v5-finale"><div class="v5-finale-art"><img src="${ART}06-finale-clear.webp" alt="Maricica se joacă fericită cu copiii la grădiniță"><div class="v5-finale-sparkle" aria-hidden="true">✦ ✧ ✦</div></div><div class="v5-finale-copy"><span>★ POVESTEA S-A ÎNCHEIAT</span><h1>Bravo, Maricica!</h1><p>Acum Maricica este curată, fericită și se joacă împreună cu prietenii ei de la grădiniță.</p><div class="v5-finale-actions"><button data-action="guided-start">Ne jucăm împreună!</button><button data-v5="memory-open">Memory</button><button data-action="home">⌂ Acasă</button></div></div></section>`;
 joy();launchConfetti(app.querySelector('.v5-finale-art'),36);
};

const oldTeacher=showTeacher;
showTeacher=function(){oldTeacher();const body=modalRoot.querySelector('.teacher-body');if(body){body.insertAdjacentHTML('beforeend','<p><strong>Jocuri de consolidare:</strong> Memory cu 2, 3 sau 4 perechi, cu cartonașe mari, fără cronometru și fără puncte pierdute.</p><p><strong>Accesibilitate:</strong> instrucțiunile audio sunt în limba română; când audio este blocat de browser, apăsați butonul de redare. Nu sunt colectate date personale despre copii.</p>')}};

// When leaving a game, there must be no delayed reveal or ghost touches.
const oldHome=navHome;
navHome=function(){clearTimeout(finishTimer);oldHome()};
renderHome();
})();
