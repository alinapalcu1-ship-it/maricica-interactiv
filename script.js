/* MARICICA • Poveste educațională interactivă / fără dependențe externe */
'use strict';

const LINES = [
  ['Maricica învață să fie curată','Narator'],
  ['Era dimineață.','Narator'],
  ['Maricica s-a trezit veselă. Și-a pus rochița roșie, pantofiorii și fundițele în păr.','Narator'],
  ['S-a privit în oglindă și a zâmbit.','Narator'],
  ['— Ce frumoasă sunt! Merg la grădiniță! a spus Maricica.','Maricica'],
  ['Dar Maricica uitase ceva important: nu se spălase și nu se pieptănase.','Narator'],
  ['Când a vrut să plece, a auzit o voce.','Narator'],
  ['— Maricica, stai puțin! Vino să-ți aranjez părul! a spus pieptenele.','Pieptenele'],
  ['— Și eu te aștept! Hai să ne spălăm! a spus săpunul.','Săpunul'],
  ['— Și dințișorii? Nu-i spălăm? a întrebat periuța de dinți.','Periuța de dinți'],
  ['Maricica s-a încruntat.','Narator'],
  ['— Nu vreau! Apa e rece, săpunul îmi intră în ochi, iar pieptenele mă trage de păr!','Maricica'],
  ['— Dar noi vrem să te ajutăm! au spus obiectele.','Obiectele'],
  ['— Nu acum! a răspuns Maricica.','Maricica'],
  ['Și a plecat grăbită la grădiniță.','Narator'],
  ['La grădiniță, copiii se jucau veseli.','Narator'],
  ['— Vreau și eu să mă joc! a spus Maricica.','Maricica'],
  ['O fetiță s-a apropiat de ea.','Narator'],
  ['— Maricica, ai puțină murdărie pe față!','Fetița'],
  ['Maricica s-a uitat la mâinile ei. Erau și ele murdare.','Narator'],
  ['— Vai! Nici nu am observat! a șoptit fetița.','Maricica'],
  ['Maricica s-a așezat pe un scăunel, lângă ursulețul ei.','Narator'],
  ['— Ursulețule, sunt tristă! a spus ea.','Maricica'],
  ['Parcă ursulețul i-a șoptit:','Narator'],
  ['— Maricica, hai să avem grijă de noi!','Ursulețul'],
  ['Maricica s-a gândit puțin.','Narator'],
  ['— Cred că am uitat să mă spăl!','Maricica'],
  ['Când a ajuns acasă, Maricica s-a dus direct la baie.','Narator'],
  ['— Apă, săpunule, unde sunteți? a strigat ea.','Maricica'],
  ['— Aici suntem! au răspuns obiectele.','Obiectele'],
  ['— Mă ajutați să mă spăl? a întrebat Maricica.','Maricica'],
  ['— Cu mare drag! a spus săpunul.','Săpunul'],
  ['— Eu te ajut să-ți speli mânuțele și obrăjorii! a spus apa.','Apa'],
  ['— Iar eu îți aranjez părul! a adăugat pieptenele.','Pieptenele'],
  ['Maricica a zâmbit.','Narator'],
  ['— Bine! Hai să începem!','Maricica'],
  ['Mai întâi, Maricica s-a spălat pe mâini.','Narator'],
  ['— Frecăm, frecăm! a spus săpunul.','Săpunul'],
  ['— Și clătim! a susurat apa.','Apa'],
  ['Apoi și-a spălat fața și s-a șters cu prosopul moale.','Narator'],
  ['— Acum e rândul meu! a spus pieptenele.','Pieptenele'],
  ['— Ușor, ușor! a râs Maricica.','Maricica'],
  ['Pieptenele i-a aranjat frumos părul.','Narator'],
  ['— Dar dințișorii? a întrebat periuța.','Periuța de dinți'],
  ['— Nu i-am uitat! a răspuns Maricica.','Maricica'],
  ['Și și-a periat dințișorii.','Narator'],
  ['— Gata! Sunt curată! a spus ea bucuroasă.','Maricica'],
  ['Maricica s-a privit din nou în oglindă.','Narator'],
  ['Avea mâinile curate, fața spălată și părul pieptănat.','Narator'],
  ['— Ce bine mă simt! a spus ea.','Maricica'],
  ['— Bravo, Maricica! au spus apa, săpunul, pieptenele și periuța.','Obiectele'],
  ['— De acum, am grijă de mine în fiecare zi! a promis fetița.','Maricica'],
  ['Maricica a zâmbit și și-a îmbrățișat ursulețul.','Narator'],
  ['Iar apa, săpunul, pieptenele și periuța de dinți au devenit prietenii ei de fiecare zi!','Narator'],
  ['Sfârșit.','Narator']
];
const CHAPTERS = [
  {title:'Bună dimineața!',desc:'Maricica se pregătește',start:0,end:5,bg:'01-bedroom.svg',tag:'O zi nouă, o aventură nouă',prop:'mirror',prop2:null},
  {title:'Prietenii din baie',desc:'Obiectele vorbesc',start:6,end:14,bg:'02-bathroom.svg',tag:'Cine o poate ajuta?',prop:'soap',prop2:'comb'},
  {title:'La grădiniță',desc:'Maricica și ursulețul',start:15,end:26,bg:'03-classroom.svg',tag:'Cum se simte Maricica?',prop:'bear',prop2:null},
  {title:'O alegere bună',desc:'Maricica se întoarce acasă',start:27,end:35,bg:'04-return.svg',tag:'O ajutăm pe Maricica?',prop:'water',prop2:'soap'},
  {title:'Mânuțe curate',desc:'Învățăm să ne îngrijim',start:36,end:46,bg:'05-care.svg',tag:'Apă, săpun și zâmbete',prop:'brush',prop2:'soap'},
  {title:'Ce bine mă simt!',desc:'Finalul poveștii',start:47,end:54,bg:'06-finale.svg',tag:'Bravo, Maricica!',prop:'mirror',prop2:null}
];
const CHALLENGES = [
  {question:'O ajutăm pe Maricica să se spele. Ce alegem?',choices:[['soap','Săpunul'],['bear','Ursulețul']],right:0},
  {question:'Cu ce își aranjează Maricica părul?',choices:[['brush','Periuța'],['comb','Pieptenele']],right:1},
  {question:'Cum se simte Maricica lângă ursuleț?',choices:[['happy','Veselă'],['sad','Tristă']],right:1},
  {question:'Ce folosim ca să ne spălăm mânuțele?',choices:[['comb','Pieptenele'],['soap','Săpunul']],right:1},
  {question:'Cu ce curățăm dințișorii?',choices:[['brush','Periuța'],['towel','Prosopul']],right:0}
];
// Jocul audio de după poveste: 19 înregistrări ElevenLabs, separate pe paragrafe.
// Păstrăm o pauză după FIECARE instrucțiune fizică, calculată după finalul MP3-ului.
const GUIDED_ROUNDS = [
 {clip:4,answer:5,question:'Cu ce ne spălăm pe mâini?',choices:[{ids:['water','soap'],label:'Apă și săpun'},{ids:['comb'],label:'Pieptene'}],right:0},
 {clip:6,answer:7,question:'Cu ce ne spălăm dințișorii?',choices:[{ids:['brush'],label:'Periuță de dinți'},{ids:['towel'],label:'Prosop'}],right:0},
 {clip:8,answer:9,question:'Cine ne ajută să avem părul aranjat?',choices:[{ids:['soap'],label:'Săpunul'},{ids:['comb'],label:'Pieptenele'}],right:1}
];
const GUIDED_MOTIONS = [
 {clip:11,label:'Arătăm mânuțele!',hint:'Ridicăm și arătăm ambele mânuțe.',image:'water',seconds:6},
 {clip:12,label:'Ne spălăm pe mânuțe!',hint:'Frecăm, frecăm, frecăm!',image:'soap',seconds:8},
 {clip:13,label:'Ne pieptănăm!',hint:'Mișcăm ușor mâna, ca și cum am ține un pieptene.',image:'comb',seconds:7},
 {clip:14,label:'Spălăm dințișorii!',hint:'Mimăm mișcarea periuței: sus, jos, sus, jos.',image:'brush',seconds:8}
];
const GUIDED_INTRO = [1,2,3], GUIDED_END = [15,16,17,18];
const guidedAudio=new Audio(); guidedAudio.preload='auto';
let guided={phase:'intro',intro:0,round:0,motion:0,outro:0,choice:-1,wrong:false,feedbackDone:false,audioActive:false,waiting:false,paused:false,remaining:0};
let guidedTimer=null, guidedToken=0;
const guidedClip=n=>`audio/interactive/${String(n).padStart(2,'0')}.mp3`;
function cancelGuided(){
 guidedToken++; if(guidedTimer){clearInterval(guidedTimer);guidedTimer=null}
 guidedAudio.pause();guidedAudio.onended=null;guidedAudio.onerror=null;guidedAudio.removeAttribute('src');guidedAudio.load();
}
function guidedPlay(n,onEnd){
 const token=++guidedToken;
 guidedAudio.pause();guidedAudio.onended=null;guidedAudio.onerror=null;
 guidedAudio.src=guidedClip(n);guidedAudio.muted=state.muted;
 guided.audioActive=true;guided.paused=false;
 guidedAudio.onended=()=>{if(guidedToken!==token||state.view!=='guided')return;guided.audioActive=false;onEnd?.()};
 guidedAudio.onerror=()=>{if(guidedToken!==token||state.view!=='guided')return;guided.audioActive=false;toast('Verifică înregistrarea audio '+n+'.');onEnd?.()};
 const p=guidedAudio.play();
 if(p&&typeof p.catch==='function')p.catch(()=>{
   if(guidedToken!==token||state.view!=='guided')return;
   guided.paused=true;renderGuided();toast('Apasă ▶ pentru a porni înregistrarea.');
 });
}
function startGuided(){stopAll();modalRoot.innerHTML='';state.view='guided';guided={phase:'intro',intro:0,round:0,motion:0,outro:0,choice:-1,wrong:false,feedbackDone:false,audioActive:false,waiting:false,paused:false,remaining:0};guidedIntro(0)}
function guidedIntro(i){
 if(state.view!=='guided')return;
 if(i>=GUIDED_INTRO.length){guidedQuestion(0);return}
 guided.phase='intro';guided.intro=i;renderGuided();guidedPlay(GUIDED_INTRO[i],()=>guidedIntro(i+1));
}
function guidedQuestion(i){
 if(state.view!=='guided')return;
 guided.phase='question';guided.round=i;guided.choice=-1;guided.wrong=false;guided.feedbackDone=false;renderGuided();
 guidedPlay(GUIDED_ROUNDS[i].clip,()=>{guided.audioActive=false;renderGuided()});
}
function guidedAnswer(i){
 if(guided.phase!=='question'||guided.audioActive||guided.choice!==-1||guided.wrong)return;
 const data=GUIDED_ROUNDS[guided.round];
 if(Number(i)===data.right){
  guided.choice=Number(i);guided.feedbackDone=false;renderGuided();tonal(true);
  guidedPlay(data.answer,()=>{guided.feedbackDone=true;renderGuided();launchConfetti(app.querySelector('.guided-card'),16)});
 }else{
  guided.wrong=true;renderGuided();tonal(false);
  // Ultimul MP3 din arhiva ElevenLabs: o singură încurajare, reutilizată la orice eroare.
  guidedPlay(19,()=>{guided.wrong=false;renderGuided()});
 }
}
function guidedNextQuestion(){
 if(guided.phase!=='question'||guided.choice===-1||!guided.feedbackDone)return;
 if(guided.round<GUIDED_ROUNDS.length-1)guidedQuestion(guided.round+1);else guidedMotionIntro();
}
function guidedMotionIntro(){guided.phase='motion-intro';renderGuided();guidedPlay(10,()=>guidedStartMotion(0))}
function guidedStartMotion(i){
 if(state.view!=='guided')return;
 if(guidedTimer){clearInterval(guidedTimer);guidedTimer=null}
 if(i>=GUIDED_MOTIONS.length){guidedOutro(0);return}
 guided.phase='motion';guided.motion=i;guided.remaining=GUIDED_MOTIONS[i].seconds;guided.duration=guided.remaining;
 guided.waiting=false;guided.paused=false;renderGuided();
 guidedPlay(GUIDED_MOTIONS[i].clip,()=>{
  // Copiii au întreaga pauză pentru exersare, DUPĂ ce vocea a terminat instrucțiunea.
  guided.waiting=true;renderGuided();
  if(guidedTimer)clearInterval(guidedTimer);
  guidedTimer=setInterval(()=>{
    if(state.view!=='guided'||guided.phase!=='motion'){clearInterval(guidedTimer);guidedTimer=null;return}
    if(guided.paused)return;
    guided.remaining=Math.max(0,guided.remaining-1);
    const el=document.getElementById('guided-timer');if(el)el.textContent=`${guided.remaining} secunde`;
    const bar=document.getElementById('guided-time-fill');if(bar)bar.style.width=`${Math.round(100*guided.remaining/guided.duration)}%`;
    if(guided.remaining===0){clearInterval(guidedTimer);guidedTimer=null;guidedStartMotion(guided.motion+1)}
  },1000);
 });
}
function guidedExtend(){if(guided.phase!=='motion'||!guided.waiting)return;guided.remaining+=5;guided.duration+=5;renderGuided()}
function guidedFinishMotion(){if(guided.phase!=='motion')return;guidedAudio.pause();guidedStartMotion(guided.motion+1)}
function guidedOutro(i){
 if(state.view!=='guided')return;
 if(i>=GUIDED_END.length){guided.phase='done';guided.audioActive=false;renderGuided();launchConfetti(app.querySelector('.guided-card'),48);tonal(true);return}
 guided.phase='outro';guided.outro=i;renderGuided();guidedPlay(GUIDED_END[i],()=>guidedOutro(i+1));
}
function guidedPauseToggle(){
 if(state.view!=='guided')return;
 guided.paused=!guided.paused;
 if(guided.audioActive){if(guided.paused)guidedAudio.pause();else guidedAudio.play().catch(()=>toast('Apasă din nou pentru audio.'))}
 renderGuided();
}
function guidedReplay(){if(state.view!=='guided')return;
 if(guided.phase==='question'){guidedPlay(GUIDED_ROUNDS[guided.round].clip,()=>{guided.audioActive=false;renderGuided()})}
 else if(guided.phase==='motion'){if(guidedTimer){clearInterval(guidedTimer);guidedTimer=null}guidedStartMotion(guided.motion)}
 else if(guided.phase==='intro')guidedIntro(guided.intro);
 else if(guided.phase==='outro')guidedOutro(guided.outro);
 else if(guided.phase==='motion-intro')guidedMotionIntro();
}
function guidedChoiceHTML(choice,i,right){
 return `<button class="guided-choice ${guided.choice===i?'is-right':''} ${guided.wrong?'guided-disabled':''}" data-action="guided-answer" data-choice="${i}" ${guided.choice!==-1||guided.wrong||guided.audioActive?'disabled':''} aria-label="${escapeHtml(choice.label)}">
 <span class="guided-objects">${choice.ids.map(id=>`<img src="${imgPath(id)}" alt="">`).join('')}</span><span>${escapeHtml(choice.label)}</span>${guided.choice===i?'<span class="guided-check">✓</span>':''}</button>`;
}
function renderGuided(){if(state.view!=='guided')return;
 const phase=guided.phase,q=GUIDED_ROUNDS[guided.round],m=GUIDED_MOTIONS[guided.motion];
 let copy='',status='',inner='';
 if(phase==='intro'){
  status='Ne pregătim de joacă';copy=['Maricica te invită la joacă!','Ascultăm împreună.','Să începem!'][guided.intro];
  inner=`<div class="guided-intro-visual"><span>✦</span><h2>${copy}</h2><p>Ascultă vocile din poveste.</p></div>`;
 }else if(phase==='question'){
  status=`Întrebarea ${guided.round+1} din 3`;copy=q.question;
  inner=`<div class="guided-question"><h2>${escapeHtml(copy)}</h2><p>Atinge imaginea potrivită. Nu ne grăbim!</p><div class="guided-choice-grid">${q.choices.map((c,i)=>guidedChoiceHTML(c,i,q.right)).join('')}</div>
  <div class="guided-remark" aria-live="polite">${guided.wrong?'Mai încercăm o dată. Maricica te încurajează!':guided.choice!==-1?'✨ Bravo! Ai ales foarte bine!':guided.audioActive?'Ascultăm întrebarea…':'Acum poți alege.'}</div>
  ${guided.choice!==-1&&guided.feedbackDone?`<button class="pill-button guided-next" data-action="guided-next">${guided.round===2?'Acum ne mișcăm! →':'Următoarea întrebare →'}</button>`:''}</div>`;
 }else if(phase==='motion-intro'){
  status='Acum ne mișcăm';copy='Hai să facem împreună!';inner=`<div class="guided-intro-visual"><span>♫</span><h2>${copy}</h2><p>Ascultăm și apoi imităm mișcările.</p></div>`;
 }else if(phase==='motion'){
  status=`Mișcarea ${guided.motion+1} din 4`;copy=m.label;
  inner=`<div class="guided-motion"><img class="guided-motion-icon" src="${imgPath(m.image)}" alt=""><h2>${escapeHtml(m.label)}</h2><p>${escapeHtml(m.hint)}</p>
   <div class="guided-rest" aria-live="polite">${guided.waiting?`<strong>Acum e timpul vostru!</strong><span id="guided-timer">${guided.remaining} secunde</span><div class="guided-time-bar"><div id="guided-time-fill" style="width:${Math.round(100*guided.remaining/guided.duration)}%"></div></div>`:'<strong>Ascultăm indicația…</strong><span>Urmează o pauză pentru mișcare.</span>'}</div>
   <div class="game-actions"><button class="pill-button outline" data-action="guided-extend" ${!guided.waiting?'disabled':''}>+ 5 secunde</button><button class="pill-button" data-action="guided-finish" ${!guided.waiting?'disabled':''}>Gata, mai departe →</button></div>
   </div>`;
 }else if(phase==='outro'){
  status='Felicitări!';copy=['Minunat! Ce bine vă descurcați!','Maricica vă mulțumește!','Ce bine este să avem grijă de noi!','La revedere, copii!'][guided.outro];
  inner=`<div class="guided-intro-visual"><span>✿</span><h2>${escapeHtml(copy)}</h2><p>Ascultăm încheierea poveștii interactive.</p></div>`;
 }else{
  status='Am terminat!';copy='Bravo, mici prieteni!';inner=`<div class="guided-intro-visual"><span>★</span><h2>Bravo, mici prieteni!</h2><p>Ați ales, ați învățat și v-ați mișcat împreună cu Maricica!</p><div class="game-actions"><button class="pill-button" data-action="guided-start">Mai jucăm o dată ↻</button><button class="pill-button mint" data-action="home">Acasă ⌂</button></div></div>`;
 }
 app.innerHTML=`<section class="guided-view" aria-label="Jocul audio al Maricicăi"><div class="story-head"><div class="story-crumb"><button data-action="home">⌂ Acasă</button><span>›</span><strong>Ne jucăm cu Maricica!</strong></div><span class="chapter-count">${escapeHtml(status)}</span></div>
 <div class="guided-stage"><div class="guided-room" aria-hidden="true"></div><img src="assets/maricica.webp" alt="Maricica, fetița cu fundițe roșii" class="guided-maricica"><div class="guided-bubble">${escapeHtml(copy)}</div></div>
 <div class="guided-card">${inner}</div>
 <div class="guided-toolbar"><button class="pill-button outline" data-action="guided-replay" ${phase==='done'?'disabled':''}>↻ Repetă indicația</button><button class="pill-button mint" data-action="guided-pause" ${phase==='done'?'disabled':''}>${guided.paused?'▶ Continuă':'Ⅱ Pauză'}</button><button class="pill-button outline" data-action="games">Alte jocuri</button></div></section>`;
}
const OBJECTS = [
  {id:'soap',label:'Săpunul',line:'Săpunul ne ajută să curățăm mânuțele.',audio:8},
  {id:'water',label:'Apa',line:'Cu apă clătim mânuțele.',audio:38},
  {id:'comb',label:'Pieptenele',line:'Cu pieptenele ne aranjăm părul.',audio:7},
  {id:'brush',label:'Periuța',line:'Cu periuța ne spălăm dințișorii.',audio:9}
];
const app=document.getElementById('app');
const modalRoot=document.getElementById('modal-root');
const audio=new Audio(); audio.preload='auto';
const sfxAudio=new Audio(); sfxAudio.preload='none';
let state={view:'home',mode:'listen',index:0,muted:false,playing:false,waiting:false,passed:new Set(),gameTab:0,gameStep:0,answered:-1,order:[],discovered:null};
let toastTimeout=0;
let context;
const clipPath=i=>`audio/${String(i+1).padStart(2,'0')}.mp3`;
const imgPath=id=>['soap','water','comb','brush'].includes(id)?`assets/cinema/${id}.webp?v=7`:`assets/objects/${id}.svg`;
const sceneOf=i=>CHAPTERS.findIndex(c=>i>=c.start&&i<=c.end);
const escapeHtml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function toast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove('visible'),3500)}
function tonal(success=true){if(state.muted)return;try{context=context||new(window.AudioContext||window.webkitAudioContext)();const t=context.currentTime;const pitches=success?[523,659,784]:[392,370];pitches.forEach((f,n)=>{const o=context.createOscillator(),g=context.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(context.destination);g.gain.setValueAtTime(0,t+n*.115);g.gain.linearRampToValueAtTime(.065,t+n*.115+.018);g.gain.exponentialRampToValueAtTime(.001,t+n*.115+.26);o.start(t+n*.115);o.stop(t+n*.115+.29)})}catch(e){/* optional sound */}}
function speak(text){if(state.muted||!('speechSynthesis'in window))return;const voices=speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.toLowerCase().startsWith('ro'));if(!voice)return;window.speechSynthesis.cancel();const phrase=new SpeechSynthesisUtterance(text);phrase.voice=voice;phrase.lang='ro-RO';phrase.rate=.86;phrase.pitch=1.06;speechSynthesis.speak(phrase)}
function stopAll(){cancelGuided();audio.pause();audio.removeAttribute('src');audio.load();sfxAudio.pause();window.speechSynthesis?.cancel();state.playing=false;state.waiting=false}
function navHome(){stopAll();modalRoot.innerHTML='';state.view='home';renderHome()}
function setMuted(){state.muted=!state.muted;if(state.muted)window.speechSynthesis?.cancel();audio.muted=state.muted;sfxAudio.muted=state.muted;guidedAudio.muted=state.muted;const b=document.getElementById('sound-toggle');b.textContent=state.muted?'♩':'♫';b.setAttribute('aria-label',state.muted?'Pornește sunetele':'Oprește sunetele');toast(state.muted?'Sunetele sunt oprite':'Sunetele sunt pornite')}
function launchStory(mode='listen'){stopAll();modalRoot.innerHTML='';state.view='story';state.mode=mode;state.passed=new Set();state.index=0;renderStory();playSegment(0)}
function sceneIndex(){return sceneOf(state.index)}
function updateCaption(){
 if(state.view!=='story')return;
 const [line,speaker]=LINES[state.index];
 const card=document.querySelector('.speech-panel');if(!card)return;
 card.classList.toggle('is-narrator',speaker==='Narator');
 card.querySelector('.speaker').textContent='';
 card.querySelector('.subtitle').textContent=line;
 card.querySelector('.speaker-icon').textContent='';
 const chapter=CHAPTERS[sceneIndex()];
 const progress=(state.index-chapter.start+1)/(chapter.end-chapter.start+1)*100;
 document.querySelector('.progress-fill').style.width=`${progress}%`;
 document.querySelector('.progress-nums').textContent=`${state.index-chapter.start+1} / ${chapter.end-chapter.start+1}`;
 const stage=document.querySelector('.story-stage');stage.classList.toggle('is-sad',sceneIndex()===2 && state.index>=21);
 const playButton=document.querySelector('[data-action="play-pause"]');if(playButton){playButton.textContent=state.playing?'Ⅱ':'▶';playButton.setAttribute('aria-label',state.playing?'Pauză':'Redă')}
}
function playSegment(i){
 if(state.view!=='story')return;
 if(i<0){i=0}if(i>=LINES.length){showFinale();return}
 const old=sceneIndex();state.index=i;const next=sceneIndex();
 if(old!==next||!document.querySelector('.speech-panel'))renderStory();
 state.waiting=false;audio.pause();audio.src=clipPath(i);audio.muted=state.muted;
 state.playing=true;updateCaption();
 const started=audio.play();if(started&&typeof started.catch==='function')started.catch(()=>{state.playing=false;updateCaption();toast('Apasă ▶ pentru a porni povestea audio')});
}
function autoNext(){
 if(state.view!=='story'||state.waiting)return;
 const ci=sceneIndex();const chapter=CHAPTERS[ci];
 if(state.index===chapter.end){
   if(state.mode==='play'&&ci<CHALLENGES.length&&!state.passed.has(ci)){showCheckpoint(ci);return}
   if(ci===CHAPTERS.length-1){showFinale();return}
 }
 playSegment(state.index+1)
}
audio.addEventListener('ended',autoNext);
audio.addEventListener('error',()=>{if(state.view==='story')toast('Acest fragment audio nu a putut fi încărcat. Verifică fișierele MP3.')});
function stageDecor(ci){const c=CHAPTERS[ci];let html=`<div class="scene-art" style="background-image:url('assets/scenes/${c.bg}')"></div><div class="scene-tint"></div>`;
 html+=`<div class="stage-cloud"><strong>${escapeHtml(c.tag)}</strong><small>${escapeHtml(c.desc)}</small></div>`;
 html+=`<img class="stage-prop" src="${imgPath(c.prop)}" alt="" draggable="false">`;
 if(c.prop2)html+=`<img class="stage-prop prop-double" src="${imgPath(c.prop2)}" alt="" draggable="false">`;
 html+=`<img class="stage-character" src="assets/maricica.webp" alt="Maricica, fetiță cu două codițe, fundițe și rochiță roșie" draggable="false">`;
 if(ci===0||ci===5)html+='<span class="spark s1">✦</span><span class="spark s2">✳</span><span class="spark s3">✦</span>';
 return html;
}
function renderStory(){const ci=sceneIndex(),c=CHAPTERS[ci];state.view='story';
 app.innerHTML=`<section class="story-view" aria-label="Povestea Maricica">
   <div class="story-head"><div class="story-crumb"><button data-action="home" aria-label="Acasă">⌂ Acasă</button></div></div>
   <div class="chapter-nav" role="group" aria-label="Alege momentul poveștii">${CHAPTERS.map((part,n)=>`<button class="chapter-dot ${n<ci?'completed':''} ${n===ci?'current':''}" data-action="jump" data-scene="${n}" aria-label="Momentul ${n+1}: ${escapeHtml(part.title)}" ${n===ci?'aria-current="step"':''}></button>`).join('')}</div>
   <div class="story-stage ${ci===2&&state.index>=21?'is-sad':''}">${stageDecor(ci)}</div>
   <div class="speech-panel is-narrator" aria-live="polite"><div class="speaker-icon">✦</div><div class="speaker-text"><div class="speaker">Narator</div><div class="subtitle"></div></div></div>
   <div class="story-controls"><div class="transport"><button class="transport-btn" data-action="previous" aria-label="Replica anterioară" title="Replica anterioară">↶</button><button class="transport-btn primary" data-action="play-pause" aria-label="Pauză" title="Pauză">Ⅱ</button><button class="transport-btn" data-action="replay" aria-label="Repetă replica" title="Repetă replica">↻</button><button class="transport-btn" data-action="next" aria-label="Replica următoare" title="Replica următoare">↷</button></div>
   <div class="progress-wrap"><span class="progress-nums">1 / 6</span><div class="progress-track" role="progressbar" aria-label="Progresul momentului"><div class="progress-fill" style="width:10%"></div></div></div><button class="transport-btn btn-words" data-action="next-scene">Momentul următor <span>→</span></button></div>
 </section>`;updateCaption();
}
function renderHome(){
 app.innerHTML=`<section class="home-layout">
 <div class="intro-side"><div class="eyebrow">O poveste pentru copii curioși</div><h1>Hai în lumea <em>Maricicăi!</em></h1><p class="lead">O poveste fermecătoare despre mânuțe curate, zâmbete și grija față de noi. Ascultăm, descoperim și învățăm împreună!</p>
 <div class="start-actions">
 <button class="hero-btn hero-btn-primary" data-action="listen"><span class="btn-symbol">♫</span><span><strong>Ascultă povestea</strong><small>Cu toate vocile originale • 3 min 40 sec</small></span><span class="btn-arrow">→</span></button>
 <button class="hero-btn hero-btn-secondary" data-action="play-story"><span class="btn-symbol">✦</span><span><strong>Povestește și joacă-te</strong><small>Povestea se oprește pentru întrebări</small></span><span class="btn-arrow">→</span></button>
 <button class="hero-btn hero-btn-plain" data-action="guided-start"><span class="btn-symbol">✿</span><span><strong>Ne jucăm cu Maricica!</strong><small>Voci reale, alegeri și mișcări cu pauze</small></span><span class="btn-arrow">→</span></button>
 <button class="hero-btn hero-btn-secondary" data-action="games"><span class="btn-symbol">♧</span><span><strong>Alte jocuri</strong><small>Aleg, descopăr și pun în ordine</small></span><span class="btn-arrow">→</span></button>
 </div><div class="mini-benefits"><span>✓ Fără reclame</span><span>✓ Fără cont</span><span>✓ Creat pentru 3 ani</span></div></div>
 <div class="home-art" aria-label="Maricica într-o cameră colorată"><div class="room-art"></div><div class="home-speech">Bună, prieteni! ♡</div><img class="home-character" src="assets/maricica.webp" alt="Maricica, o fetiță cu codițe șatene și fundițe roșii" draggable="false"><span class="home-flower a">✴</span><span class="home-flower b">✿</span><span class="art-ribbon"><i></i> O aventură cu grijă și prietenie</span></div>
 </section>`;
}
function showCheckpoint(ci){
 state.waiting=true;audio.pause();state.playing=false;
 const ch=CHALLENGES[ci];
 modalRoot.innerHTML=`<div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Întrebare interactivă"><div class="modal-card" id="challenge-card"><div class="modal-badge">✦ Hai să o ajutăm!</div><h2>${escapeHtml(ch.question)}</h2><p class="modal-description">Atinge imaginea potrivită. Nu ne grăbim!</p><div class="option-grid">${ch.choices.map(([id,label],n)=>`<button class="option" data-action="answer-checkpoint" data-choice="${n}" aria-label="${escapeHtml(label)}"><img src="${imgPath(id)}" alt=""><span>${escapeHtml(label)}</span></button>`).join('')}</div><div class="game-feedback" id="challenge-feedback" aria-live="polite"></div><div class="game-actions"><button class="pill-button outline" data-action="skip-checkpoint">Continuă povestea →</button></div></div></div>`;
 speak(ch.question);
}
function answerCheckpoint(choice){const ci=sceneIndex(),ch=CHALLENGES[ci],button=modalRoot.querySelector(`[data-choice="${choice}"]`);if(!ch)return;
 if(Number(choice)===ch.right){state.passed.add(ci);tonal(true);button?.classList.add('correct');
  modalRoot.querySelector('#challenge-feedback').textContent='✨ Bravo! Ai ales foarte bine!';
  modalRoot.querySelector('.game-actions').innerHTML='<button class="pill-button" data-action="finish-checkpoint">Mai departe →</button>';
  modalRoot.querySelectorAll('[data-action="answer-checkpoint"]').forEach(b=>b.disabled=true);
  speak('Bravo! Ai ales foarte bine!');launchConfetti(modalRoot.querySelector('#challenge-card'),16)
 }else{tonal(false);button?.classList.add('wrong');modalRoot.querySelector('#challenge-feedback').textContent='Mai încearcă. Sunt aici să te ajut!';speak('Mai încearcă!');setTimeout(()=>button?.classList.remove('wrong'),450)}
}
function exitCheckpoint(){const ci=sceneIndex();state.passed.add(ci);modalRoot.innerHTML='';if(ci===5)showFinale();else playSegment(CHAPTERS[ci+1].start)}
function launchConfetti(root,count=45){if(!root)return;const colors=['#ff9c88','#a0dfc4','#ffe09c','#b8b8f4','#ffbfca'];for(let i=0;i<count;i++){let p=document.createElement('span');p.className='confetti-piece';p.style.left=`${Math.random()*98}%`;p.style.background=colors[i%colors.length];p.style.setProperty('--dur',`${2+Math.random()*2.3}s`);p.style.setProperty('--move',`${Math.round((Math.random()-.5)*310)}px`);p.style.animationDelay=`${Math.random()*.7}s`;root.appendChild(p);p.addEventListener('animationend',()=>p.remove(),{once:true})}}
function showFinale(){stopAll();modalRoot.innerHTML=`<div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Finalul poveștii"><div class="modal-card final-card"><div class="modal-badge">★ Felicitări, prieteni!</div><img class="final-hero" src="assets/maricica.webp" alt="Maricica zâmbește"><h2>Bravo, mici prieteni!</h2><p>Maricica a învățat să aibă grijă de ea. Acum vă invită la joacă!</p><div class="final-actions"><button class="pill-button" data-action="guided-start">Joacă-te cu Maricica ✦</button><button class="pill-button outline" data-action="games">Alte jocuri</button><button class="pill-button outline" data-action="listen">Ascultă din nou ♫</button><button class="pill-button mint" data-action="home">Acasă</button></div></div></div>`;tonal(true);launchConfetti(modalRoot.querySelector('.final-card'),46)}
function startGames(tab=0){stopAll();modalRoot.innerHTML='';state.view='games';state.gameTab=tab;state.gameStep=0;state.answered=-1;state.order=[];state.discovered=null;renderGames()}
function gameArea(){
 const question=CHALLENGES[state.gameStep%CHALLENGES.length];
 if(state.gameTab===0){return `<h2 class="game-title">${escapeHtml(question.question)}</h2><p class="game-hint">Privește imaginile și alege. Poți încerca de câte ori vrei!</p><div class="option-grid">${question.choices.map(([id,label],i)=>`<button class="option ${state.answered===i?'correct':''}" data-action="answer-game" data-choice="${i}"><img src="${imgPath(id)}" alt=""><span>${escapeHtml(label)}</span></button>`).join('')}</div><div class="game-feedback" aria-live="polite">${state.answered!==-1?'✨ Bravo! Ai găsit!':''}</div><div class="game-actions"><button class="pill-button" data-action="next-game" ${state.answered===-1?'disabled':''}>${state.gameStep===CHALLENGES.length-1?'Din nou ↻':'Mai departe →'}</button></div>`}
 if(state.gameTab===1){const order=[['brush','Dințișorii'],['soap','Mânuțele'],['comb','Părul']];return `<h2 class="game-title">Ce facem mai întâi?</h2><p class="game-hint">Atinge imaginile în ordine: spălăm mâinile, pieptănăm părul, curățăm dinții.</p><div class="order-grid">${order.map(([id,label],i)=>{const sel=state.order.includes(id);return `<button class="order-card ${sel?'selected':''}" data-action="select-order" data-id="${id}" ${sel?'disabled':''}><img src="${imgPath(id)}" alt=""><span>${label}</span>${sel?`<span class="order-num">${state.order.indexOf(id)+1}</span>`:''}</button>`}).join('')}</div><div class="game-feedback" aria-live="polite">${state.order.length===3?'🌟 Minunat! Ai pus totul în ordine.':`Pasul ${state.order.length+1} din 3`}</div><div class="game-actions"><button class="pill-button outline" data-action="reset-order">Reia jocul ↻</button>${state.order.length===3?'<button class="pill-button" data-action="end-game">Bravo, copii! ✦</button>':''}</div>`}
 return `<h2 class="game-title">Cine sunt prietenii Maricicăi?</h2><p class="game-hint">Atinge un obiect. El își va spune replica din poveste!</p><div class="discovery-grid">${OBJECTS.map(o=>`<button class="discover-tile ${state.discovered===o.id?'selected':''}" data-action="discover" data-id="${o.id}"><img src="${imgPath(o.id)}" alt=""><span>${o.label}</span></button>`).join('')}</div><div class="discovery-line" aria-live="polite">${state.discovered?OBJECTS.find(o=>o.id===state.discovered)?.line:'Alege un prieten și descoperă-l! ♡'}</div>`;
}
function renderGames(){
 app.innerHTML=`<section class="game-view"><div class="story-head"><div class="story-crumb"><button data-action="home">⌂ Acasă</button><span>›</span><strong>Jocurile Maricicăi</strong></div><span class="chapter-count">Mă joc și învăț</span></div>
 <div class="games-header"><div class="eyebrow" style="justify-content:center">Învățăm prin joacă</div><h1>Hai să ne jucăm! ✿</h1><p>Alegem, descoperim și ne bucurăm de fiecare reușită.</p></div>
 <div class="game-tabs"><button class="game-tab ${state.gameTab===0?'active':''}" data-action="game-tab" data-tab="0">✦ Aleg obiectul</button><button class="game-tab ${state.gameTab===1?'active':''}" data-action="game-tab" data-tab="1">↗ Pun în ordine</button><button class="game-tab ${state.gameTab===2?'active':''}" data-action="game-tab" data-tab="2">♫ Descopăr vocile</button></div>
 <div class="game-card">${gameArea()}</div></section>`;
 if(state.gameTab===0 && state.gameStep===0 && state.answered===-1)speak(CHALLENGES[0].question);
}
function answerGame(i){let ch=CHALLENGES[state.gameStep%CHALLENGES.length];if(state.answered!==-1)return;
 if(Number(i)===ch.right){state.answered=Number(i);tonal(true);renderGames();launchConfetti(app.querySelector('.game-card'),13);speak('Bravo! Ai reușit!')}else{tonal(false);const o=app.querySelector(`[data-action="answer-game"][data-choice="${i}"]`);o?.classList.add('wrong');toast('Mai încearcă!');setTimeout(()=>o?.classList.remove('wrong'),400)}}
function nextGame(){if(state.answered===-1)return;state.gameStep=(state.gameStep+1)%CHALLENGES.length;state.answered=-1;renderGames();speak(CHALLENGES[state.gameStep].question)}
function selectOrder(id){if(state.order.includes(id))return;const desired=['soap','comb','brush'];if(id!==desired[state.order.length]){tonal(false);toast('Mai încearcă. Care este primul pas?');return}state.order.push(id);tonal(true);renderGames();if(state.order.length===3){speak('Bravo! Ai pus toate imaginile în ordine!');launchConfetti(app.querySelector('.game-card'),30)}else{speak(state.order.length===1?'Acum pieptănăm părul.':'Acum curățăm dințișorii.')}}
function discover(id){const obj=OBJECTS.find(o=>o.id===id);if(!obj)return;state.discovered=id;renderGames();sfxAudio.pause();sfxAudio.src=clipPath(obj.audio);sfxAudio.muted=state.muted;sfxAudio.play().catch(()=>toast('Apasă încă o dată pentru a asculta vocea'))}
function showTeacher(){audio.pause();state.playing=false;sfxAudio.pause();window.speechSynthesis?.cancel();modalRoot.innerHTML=`<div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Informații pentru educatoare"><div class="modal-card"><button class="modal-close" data-action="close-info" aria-label="Închide">×</button><span class="modal-badge">Ghid pentru educatoare</span><h2>O poveste, multe descoperiri</h2><div class="teacher-body"><p><strong>Public:</strong> grupa mică, 3 ani. <strong>Durata audio:</strong> aproximativ 3 minute și 40 de secunde, plus timp de interacțiune.</p><p><strong>Obiective pedagogice:</strong></p><ul><li>Identificarea obiectelor utilizate pentru igiena personală;</li><li>Asocierea obiectelor cu acțiunile corespunzătoare;</li><li>Identificarea unei emoții simple și exprimarea verbală a trăirilor;</li><li>Ordonarea unor acțiuni din rutina zilnică;</li><li>Repovestirea cu ajutorul ilustrațiilor și al întrebărilor.</li></ul><p><strong>Utilizare:</strong> „Ascultă povestea” pentru povestirea educatoarei; „Povestește și joacă-te” pentru întrebări după fiecare moment; „Ne jucăm cu Maricica!” pentru 3 întrebări audio și 4 mișcări cu pauze de 6–8 secunde (extensibile). „Alte jocuri” pentru consolidare.</p><p>Întrebările interactive pot fi citite de educatoare. Dacă dispozitivul are o voce românească instalată, aplicația o poate folosi pentru instrucțiuni; în caz contrar, povestea înregistrată rămâne integral disponibilă.</p><p><strong>Accesibilitate:</strong> butoane mari, feedback pozitiv, fără cronometru, fără autentificare sau colectare de date. Animațiile se reduc automat dacă dispozitivul solicită mișcare redusă.</p><p><strong>Credite:</strong> adaptare educațională după „Maricica” de Luiza Vlădescu; narațiune furnizată de utilizatoare, generată în ElevenLabs; personajul 3D ales de utilizatoare.</p></div><div class="game-actions"><button class="pill-button" data-action="close-info">Am înțeles ♡</button></div></div></div>`}
function closeInfo(){modalRoot.innerHTML='';if(state.view==='story'){state.playing=false;updateCaption()}}

// Evenimentele sunt delegate pentru a funcționa după fiecare tranziție de scenă.
function activate(e){const target=e.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
 switch(action){
 case 'home':navHome();break;
 case 'listen':launchStory('listen');break;
 case 'play-story':launchStory('play');break;
 case 'games':startGames();break;
 case 'guided-start':startGuided();break;
 case 'guided-answer':guidedAnswer(target.dataset.choice);break;
 case 'guided-next':guidedNextQuestion();break;
 case 'guided-finish':guidedFinishMotion();break;
 case 'guided-extend':guidedExtend();break;
 case 'guided-pause':guidedPauseToggle();break;
 case 'guided-replay':guidedReplay();break;
 case 'jump':{const c=CHAPTERS[Number(target.dataset.scene)];if(c)playSegment(c.start);break}
 case 'next-scene':{const next=CHAPTERS[sceneIndex()+1];if(next)playSegment(next.start);else showFinale();break}
 case 'previous':playSegment(Math.max(0,state.index-1));break;
 case 'next':{if(state.index>=LINES.length-1)showFinale();else playSegment(state.index+1);break}
 case 'replay':playSegment(state.index);break;
 case 'play-pause':if(audio.paused){state.playing=true;audio.play().catch(()=>toast('Nu s-a putut porni sunetul.'));}else{audio.pause();state.playing=false}updateCaption();break;
 case 'answer-checkpoint':answerCheckpoint(target.dataset.choice);break;
 case 'skip-checkpoint':case 'finish-checkpoint':exitCheckpoint();break;
 case 'game-tab':state.gameTab=Number(target.dataset.tab);state.answered=-1;state.gameStep=0;state.order=[];state.discovered=null;sfxAudio.pause();renderGames();break;
 case 'answer-game':answerGame(target.dataset.choice);break;
 case 'next-game':nextGame();break;
 case 'select-order':selectOrder(target.dataset.id);break;
 case 'reset-order':state.order=[];renderGames();break;
 case 'end-game':showFinale();break;
 case 'discover':discover(target.dataset.id);break;
 case 'close-info':closeInfo();break;
 }
}
document.addEventListener('click',activate);
document.getElementById('brand-home').addEventListener('click',e=>{e.preventDefault();navHome()});
document.getElementById('sound-toggle').addEventListener('click',setMuted);
document.getElementById('about-btn').addEventListener('click',showTeacher);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalRoot.innerHTML){if(state.waiting)exitCheckpoint();else closeInfo()}if(state.view==='story'&&!modalRoot.innerHTML&&(e.key===' '||e.code==='Space')){if(!['INPUT','BUTTON'].includes(document.activeElement.tagName)){e.preventDefault();if(audio.paused){audio.play().then(()=>{state.playing=true;updateCaption()})}else{audio.pause();state.playing=false;updateCaption()}}}});
renderHome();
