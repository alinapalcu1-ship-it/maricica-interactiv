/* Maricica · Cinci activitati tactile adaptate din fisele profesionale A4.
   Pentru grupa mica, fara cont, cronometru, colectare de date sau drag fantoma. */
(function(){
'use strict';
const app=document.getElementById('app');if(!app)return;
const catalogue=[
 {id:'trusa',title:'Trusa Maricicăi',short:'Pune la loc obiectele de igienă',photo:'assets/cinema5/05-washing-clear.webp',tone:'peach'},
 {id:'potriveste',title:'Unde se folosește?',short:'Descoperă cum avem grijă de noi',photo:'assets/cinema5/05-combing-clear.webp',tone:'mint'},
 {id:'curata',title:'Curată sau murdărică?',short:'Găsește-o pe Maricica îngrijită',photo:'assets/cinema5/02-mirror-clean.webp',tone:'pink'},
 {id:'spuma',title:'Buline de spumă',short:'Săpunelul are nevoie de spumă',photo:'assets/cinema5/05-washing-clear.webp',tone:'sky'},
 {id:'prosop',title:'Prosopelul Maricicăi',short:'Decorează un prosopel pufos',photo:'assets/cinema5/05-washing-clear.webp',tone:'lilac'}
];
const objects=[
 {id:'soap',name:'Săpun',color:'red',target:'hands'},
 {id:'brush',name:'Periuță',color:'blue',target:'teeth'},
 {id:'comb',name:'Pieptene',color:'yellow',target:'hair'},
 {id:'bear',name:'Ursuleț',color:'none',target:'none'}
];
let mode='hub',selected=null,feedback='',done=new Set(),slots=[],correctChoice='',sticker='flower',chosenColor='#f89bb6',busy=false,finished=false;
const nativeAudio=()=>{try{if(!state.muted&&typeof tonal==='function')tonal(true)}catch(e){}};
const soundWrong=()=>{try{if(!state.muted&&typeof tonal==='function')tonal(false)}catch(e){}};
const speakHint=text=>{try{if(!state.muted&&typeof speak==='function')speak(text)}catch(e){}};
const objectAsset=id=>{
 if(id==='bear')return '<img class="wg-object-img" src="assets/cinema5/teddy-cutout.webp" alt="" draggable="false" loading="eager">';
 if(id==='comb')return '<img class="wg-object-img" src="assets/cinema/comb.webp" alt="" draggable="false" loading="eager">';
 const item=objects.find(t=>t.id===id);
 return '<img class="wg-object-img" src="assets/hygiene/individual/'+id+'-'+(item?.color||'blue')+'.webp" alt="" draggable="false" loading="eager">';
};
const image3D=(url,alt='',extra='')=>'<img '+(extra?'class="'+extra+'" ':'')+'src="'+url+'" alt="'+alt+'" draggable="false" decoding="async" loading="eager">';
const stampSVG=(id)=>{
 const common='<defs><linearGradient id="wg'+id+'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf9"/><stop offset=".46" stop-color="#ffdf7e"/><stop offset="1" stop-color="#ef9a63"/></linearGradient></defs>';
 let body='';
 if(id==='flower'){body='<g fill="url(#wg'+id+'a)" stroke="#fff4f4" stroke-width="2.5">'+[0,60,120,180,240,300].map(a=>'<ellipse cx="40" cy="22" rx="11" ry="18" transform="rotate('+a+' 40 40)"/>').join('')+'</g><circle cx="40" cy="40" r="11" fill="#ffac52" stroke="#fff" stroke-width="3"/><circle cx="36" cy="36" r="3" fill="#fff9" />';}
 else if(id==='star'){body='<path d="M40 8 49 30 72 40 49 49 40 72 31 49 8 40 31 30Z" fill="#ffcc61" stroke="#ffecba" stroke-width="4"/><path d="M40 16V32M18 40H32" stroke="#fff" stroke-width="4" opacity=".7" stroke-linecap="round"/>';}
 else if(id==='heart'){body='<path d="M40 67C15 51 7 36 13 23 21 8 36 12 40 23 49 9 65 12 69 26 75 43 60 56 40 67Z" fill="#f57f9b" stroke="#ffd6e4" stroke-width="4"/><ellipse cx="28" cy="27" rx="9" ry="5" transform="rotate(-22 28 27)" fill="#fff" opacity=".66"/>';}
 else{body='<circle cx="40" cy="40" r="29" fill="#79c8e7" stroke="#dcf8ff" stroke-width="5"/><circle cx="30" cy="25" r="10" fill="#fff" opacity=".65"/>';}
 return '<svg class="wg-stamp-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" aria-hidden="true">'+common+body+'</svg>';
};

function resetValues(){
 selected=null;feedback='';slots=[];done=new Set();correctChoice='';sticker='flower';chosenColor='#f89bb6';finished=false;busy=false;
}
function homeEntry(){
 if(state.view!=='home')return;
 const grid=app.querySelector('.v4-start-grid');
 if(!grid||grid.querySelector('[data-wg="open-hub"]'))return;
 grid.insertAdjacentHTML('beforeend','<button type="button" class="v4-main-action wg-home-card" data-wg="open-hub"><span aria-hidden="true">🌼</span><strong>5 jocuri cu Maricica</strong><small>Trusa, potrivire, buline și decorațiuni</small></button>');
}
const oldRenderHome=renderHome;
renderHome=function(){oldRenderHome();homeEntry()};
function start(next='hub',reset=true){
 if(reset)resetValues();
 try{stopAll()}catch(e){}
 const modal=document.getElementById('modal-root');if(modal)modal.innerHTML='';
 mode=next;state.view='worksheet-'+mode;draw();
 try{window.scrollTo?.(0,0)}catch(e){}
}
function success(message){
 finished=true;feedback=message;
 nativeAudio();
 if(typeof launchConfetti==='function')try{launchConfetti(app.querySelector('.wg-playground')||app,20)}catch(e){}
}
function infoLine(){return feedback||({
 trusa:'Atinge un obiect, apoi un loc liber din trusă.',
 potriveste:'Atinge un obiect, apoi imaginea la care se folosește.',
 curata:'Privește atent. Care Maricica este curată?',
 spuma:'Atinge fiecare cerc și fă o bulină de spumă.',
 prosop:'Alege un model și decorează prosopul atingând locurile libere.'
}[mode]||'Alege un joc și descoperă!');}
function ribbon(progress,total){
 return '<div class="wg-statusline"><span>'+progress+' din '+total+'</span><div class="wg-progress"><i style="width:'+(progress/total*100)+'%"></i></div></div>';
}
function shell(title,subtitle,content,number){
 app.innerHTML='<section class="wg-app" aria-label="'+title+'"><header class="wg-header">'+
 '<button type="button" data-wg="hub" class="wg-nav-btn">← <span>Jocurile mele</span></button>'+
 '<div class="wg-heading"><span class="wg-eyebrow">✿ ATELIERUL MARICICĂI · FIȘE INTERACTIVE</span><h1>'+title+'</h1><p>'+subtitle+'</p></div>'+
 '<button type="button" data-wg="reset" class="wg-nav-btn wg-reset-btn" aria-label="Reia jocul">↻ <span>Reia</span></button></header>'+
 '<div class="wg-playground">'+content+'</div>'+
 '<footer class="wg-footer"><span aria-live="polite" role="status">'+infoLine()+'</span><div><button type="button" data-wg="hear" class="wg-action-small">🔊 Ascultă</button>'+
 (finished?'<button type="button" class="wg-next" data-wg="next">Alt joc →</button>':'')+'</div></footer>'+
 '<div class="wg-index">Activitatea '+number+' din 5 · Fără cronometru · Atinge și alege</div></section>';
}
function tile(item,active,disabled=false){
 return '<button type="button" data-wg="select" data-id="'+item.id+'" class="wg-object-tile '+(active?'is-selected':'')+'" '+(disabled?'disabled':'')+
 ' aria-label="'+item.name+'">'+objectAsset(item.id)+'<strong>'+item.name+'</strong></button>';
}
function renderHub(){
 const cards=catalogue.map((it,i)=>'<button type="button" data-wg="open" data-game="'+it.id+'" class="wg-hub-tile wg-tile-'+it.tone+'">'+
 '<span class="wg-hub-number">'+String(i+1).padStart(2,'0')+'</span><span class="wg-hub-illustration" aria-hidden="true">'+image3D(it.photo,'','wg-hub-photo')+'</span>'+
 '<strong>'+it.title+'</strong><small>'+it.short+'</small><span class="wg-hub-go" aria-hidden="true">Începem →</span></button>').join('');
 app.innerHTML='<section class="wg-app wg-hub"><div class="wg-hub-lead"><button type="button" data-wg="home" class="wg-nav-btn">← Acasă</button>'+
 '<div class="wg-hub-tag">✿ CINCI ACTIVITĂȚI DIN FIȘELE MARICICĂI</div><h1>Ne jucăm și învățăm!</h1>'+
 '<p>Activități mari, colorate și ușor de atins, pentru copiii de 3 ani.</p></div><div class="wg-hub-grid">'+cards+'</div>'+
 '<div class="wg-hub-tip">Atinge un cartonaș pentru a începe. Fiecare joc poate fi reluat oricând.</div></section>';
}
function renderKit(){
 const required=['soap','brush','comb'],used=slots.filter(Boolean);
 const cards=objects.map(o=>tile(o,selected===o.id,used.includes(o.id))).join('');
 const holes=required.map((_,i)=>{
  const id=slots[i],obj=objects.find(o=>o.id===id);
  return '<button type="button" class="wg-kit-hole '+(id?'wg-filled':'')+'" data-wg="place" data-slot="'+i+'" aria-label="Locul '+(i+1)+(id?', '+obj?.name:' gol')+'">'+
   (id?objectAsset(id)+'<strong>'+obj.name+'</strong>':'<span class="wg-slot-open" aria-hidden="true"></span><small>Loc liber</small>')+'</button>';
 }).join('');
 const suitcase='<div class="wg-suitcase"><span class="wg-case-handle"></span><div class="wg-case-body"><div class="wg-case-slots">'+holes+'</div></div><div class="wg-case-flower">✿</div></div>';
 const count=used.length;
 shell('Trusa Maricicăi','Alege cele trei obiecte de igienă. Ursulețul este pentru joacă.',
 '<div class="wg-kit-layout"><div class="wg-activity-surface">'+ribbon(count,3)+suitcase+'</div>'+
 '<aside class="wg-activity-side"><h2>Ce punem în trusă?</h2><div class="wg-kit-objects">'+cards+'</div>'+
 '<p class="wg-help">Selectează un obiect și apoi atinge unul dintre cele trei locuri din trusă.</p></aside></div>',1);
}
function renderMatch(){
 const targets=[
 {id:'hands',name:'Mânuțe',photo:'assets/cinema5/05-washing-clear.webp',hint:'Ne spălăm pe mâini'},
 {id:'hair',name:'Păr',photo:'assets/cinema5/05-combing-clear.webp',hint:'Ne pieptănăm părul'},
 {id:'teeth',name:'Dințișori',photo:'assets/cinema5/05-brushing-clear.webp',hint:'Ne periem dinții'}
 ];
 const targetHtml=targets.map(t=>{
  const object=objects.find(o=>o.target===t.id);
  const marked=slots.includes(t.id);
  return '<button type="button" data-wg="match" data-target="'+t.id+'" class="wg-match-target '+(marked?'wg-correct':'')+'" aria-label="'+t.name+'">'+
  '<span class="wg-target-art">'+image3D(t.photo,'','wg-target-photo')+'</span><strong>'+t.name+'</strong><small>'+t.hint+'</small>'+
  '<span class="wg-target-pocket">'+(marked?'<span class="wg-mini-placed">'+objectAsset(object.id)+'<b>✓</b></span>':'<span class="wg-pocket-ring" aria-hidden="true"></span><span>Așază aici</span>')+'</span></button>';
 }).join('');
 const options=objects.filter(o=>o.id!=='bear').map(o=>tile(o,selected===o.id,slots.includes(o.target))).join('');
 shell('Unde se folosește?','Asociază obiectele cu imaginile Maricicăi.',
 '<div class="wg-match-layout"><div class="wg-activity-surface">'+ribbon(slots.length,3)+'<div class="wg-match-targets">'+targetHtml+'</div></div>'+
 '<aside class="wg-activity-side"><h2>Alege obiectul</h2><div class="wg-match-objects">'+options+'</div>'+
 '<p class="wg-help">Atinge obiectul, apoi imaginea cu activitatea potrivită.</p></aside></div>',2);
}
function renderClean(){
 const cleanChosen=correctChoice==='clean',bubbleChosen=done.size>0;
 const girls=[
 {id:'dirty',label:'Maricica murdărică',img:'assets/cinema5/mirror-dirty.webp'},
 {id:'clean',label:'Maricica curată',img:'assets/cinema5/02-mirror-clean.webp'}
 ];
 const options=girls.map(g=>'<button type="button" data-wg="girl" data-id="'+g.id+'" class="wg-girl '+(cleanChosen&&g.id==='clean'?'wg-correct':'')+'">'+
 '<img src="'+g.img+'" alt="'+g.label+'" draggable="false">'+
 '<strong>'+g.label+'</strong>'+(cleanChosen&&g.id==='clean'?'<span class="wg-ok">✓</span>':'')+'</button>').join('');
 const colors=['#f69cb8','#ffe27b','#a6e8d4','#96d7fa'];
 const dots=colors.map(c=>'<button type="button" data-wg="dot" data-color="'+c+'" class="wg-dot '+(done.has(c)?'wg-dot-done':'')+'" style="--dot:'+c+'" aria-label="Bulină colorată" '+(!cleanChosen?'disabled':'')+'></button>').join('');
 shell('Curată sau murdărică?','Alege Maricica îngrijită și pune-i o bulină colorată.',
 '<div class="wg-activity-surface wg-clean-sheet">'+ribbon((cleanChosen?1:0)+(bubbleChosen?1:0),2)+
 '<div class="wg-girls">'+options+'</div><p class="wg-step-label">'+(cleanChosen?'Foarte bine! Alege acum o bulină.':'Atinge imaginea cu Maricica cea curată.')+'</p>'+
 '<div class="wg-dots">'+dots+'</div>'+(bubbleChosen?'<span class="wg-selected-dot" style="background:'+Array.from(done)[0]+'">✓</span>':'')+'</div>',3);
}
const bubblePositions=[
 [18,16],[49,8],[80,16],
 [30,39],[70,39],
 [17,70],[49,78],[82,70]
];
function renderBubbles(){
 const circles=bubblePositions.map(([x,y],i)=>'<button type="button" class="wg-bubble-spot '+(done.has(i)?'wg-bubbled':'')+'" style="left:'+x+'%;top:'+y+'%" data-wg="bubble" data-id="'+i+'" aria-label="Bulina '+(i+1)+'">'+
 (done.has(i)?'<span class="wg-real-bubble"></span>':'<span class="wg-empty-bubble" aria-hidden="true"></span>')+'</button>').join('');
 shell('Buline de spumă','Atinge cele opt cercuri și umple-le cu spumă.',
 '<div class="wg-bubbles-layout"><div class="wg-activity-surface wg-bubble-surface">'+ribbon(done.size,8)+
 '<div class="wg-bubble-play"><div class="wg-bubble-glow"></div><div class="wg-bubble-soap">'+image3D('assets/hygiene/individual/soap-red.webp','Săpunel roz','wg-soap-photo')+'</div>'+circles+'</div></div>'+
 '<aside class="wg-activity-side wg-bubble-note"><div class="wg-bubble-story">'+image3D('assets/cinema5/05-washing-clear.webp','Maricica se spală cu apă și săpun')+'</div>'+
 '<h2>Facem spumă!</h2><p>Un cerc, o bulină! Atinge toate cele opt cercuri și ajută săpunelul să facă spumă.</p></aside></div>',4);
}
const stampChoices=[
 {symbol:'flower',name:'Floare'},
 {symbol:'star',name:'Steluță'},
 {symbol:'heart',name:'Inimioară'},
 {symbol:'dot',name:'Bulină'}
];
const towelSpots=[[27,25],[53,25],[74,28],[34,49],[65,51],[49,71]];
function renderTowel(){
 const stamps=stampChoices.map(st=>'<button type="button" data-wg="sticker" data-id="'+st.symbol+'" class="wg-sticker-choice '+(sticker===st.symbol?'is-selected':'')+'" aria-label="'+st.name+'" aria-pressed="'+(sticker===st.symbol)+'">'+stampSVG(st.symbol)+'<small>'+st.name+'</small></button>').join('');
 const spots=towelSpots.map(([x,y],i)=>{
  const v=slots[i];
  return '<button type="button" data-wg="stamp" data-id="'+i+'" class="wg-towel-spot '+(v?'is-stamped':'')+'" style="left:'+x+'%;top:'+y+'%" aria-label="Decorațiune '+(i+1)+'">'+
  (v?stampSVG(v):'<span class="wg-towel-target" aria-hidden="true"></span>')+'</button>';
 }).join('');
 const towel='<div class="wg-towel-display"><div class="wg-towel-light"></div>'+
 image3D('assets/hygiene/individual/towel-blue.webp','Prosop albastru pufos','wg-towel-photo')+
 '<div class="wg-towel-canvas">'+spots+'</div></div>';
 shell('Prosopelul Maricicăi','Alege un model și așază-l pe prosopelul pufos.',
 '<div class="wg-towel-layout"><div class="wg-activity-surface">'+ribbon(done.size,6)+towel+'</div>'+
 '<aside class="wg-activity-side"><h2>Modele de ales</h2><div class="wg-stamp-palette">'+stamps+'</div>'+
 '<div class="wg-towel-scene">'+image3D('assets/cinema5/05-washing-clear.webp','Maricica și prosopul ei')+'</div>'+
 '<p class="wg-help">Atinge un model, apoi unul dintre cele șase locuri de pe prosop.</p></aside></div>',5);
}
function draw(){
 if(mode==='hub'){renderHub();return;}
 const render={trusa:renderKit,potriveste:renderMatch,curata:renderClean,spuma:renderBubbles,prosop:renderTowel}[mode];
 render?.();
}
function select(id){
 selected=id;
 feedback='Acum atinge locul potrivit.';
 draw();
}
function chooseSlot(i){
 const item=objects.find(o=>o.id===selected);
 if(!item){feedback='Alege întâi un obiect.';draw();return;}
 if(item.id==='bear'){feedback='Ursulețul este pentru joacă. În trusă punem doar obiecte de igienă.';soundWrong();draw();return;}
 if(slots.includes(item.id)){feedback='Ai pus deja acest obiect în trusă.';draw();return;}
 if(slots[i]){feedback='Locul este ocupat. Alege un loc liber.';draw();return;}
 slots[i]=item.id;done.add(item.id);selected=null;
 if(done.size===3)success('🌟 Bravo! Trusa Maricicăi este pregătită!');
 else{feedback='Foarte bine! Hai să găsim și celelalte obiecte.';nativeAudio();}
 draw();
}
function match(target){
 const item=objects.find(o=>o.id===selected);
 if(!item){feedback='Alege întâi un obiect.';draw();return;}
 if(item.target!==target){feedback='Mai încearcă. Gândește-te unde folosim '+item.name.toLowerCase()+'.';soundWrong();draw();return;}
 if(slots.includes(target)){feedback='Ai găsit deja această potrivire.';draw();return;}
 slots.push(target);done.add(item.id);selected=null;
 if(done.size===3)success('🌟 Toate obiectele sunt la locul potrivit!');
 else{feedback='Bravo! Ai potrivit corect.';nativeAudio();}
 draw();
}
function clickGirl(id){
 if(id==='clean'){correctChoice='clean';feedback='Bravo! Maricica este curată. Alege bulina.';nativeAudio();}
 else{feedback='Privește mai atent mânuțele și fața Maricicăi.';soundWrong();}
 draw();
}
function clickDot(color){
 if(correctChoice!=='clean')return;
 done.clear();done.add(color);success('🌟 Minunat! Ai găsit Maricica cea curată!');
 draw();
}
function clickBubble(i){
 if(done.has(i))return;
 done.add(i);
 if(done.size===8)success('🫧 Săpunelul are acum toate cele opt buline!');
 else{feedback='Bravo! Încă o bulină de spumă!';nativeAudio();}
 draw();
}
function clickStamp(i){
 if(slots[i]){feedback='Aici ai pus deja un model. Alege un alt loc.';draw();return;}
 slots[i]=sticker;done.add(i);
 if(done.size===6)success('🌼 Prosopelul Maricicăi este decorat! Bravo!');
 else{feedback='Frumos! Mai alege un loc pe prosop.';nativeAudio();}
 draw();
}
function advance(){
 const currentIndex=catalogue.findIndex(c=>c.id===mode);
 start(catalogue[(currentIndex+1)%catalogue.length].id);
}
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-wg]');
 if(!t)return;
 e.preventDefault();e.stopImmediatePropagation();
 const action=t.dataset.wg;
 if(action==='open-hub'||action==='hub'){start('hub');return;}
 if(action==='home'){try{navHome()}catch(e){state.view='home';renderHome()}return;}
 if(action==='open'){start(t.dataset.game);return;}
 if(!state.view.startsWith('worksheet-'))return;
 if(action==='reset'){start(mode);return;}
 if(action==='next'){advance();return;}
 if(action==='hear'){speakHint(infoLine());return;}
 if(action==='select'){select(t.dataset.id);return;}
 if(action==='place'){chooseSlot(Number(t.dataset.slot));return;}
 if(action==='match'){match(t.dataset.target);return;}
 if(action==='girl'){clickGirl(t.dataset.id);return;}
 if(action==='dot'){clickDot(t.dataset.color);return;}
 if(action==='bubble'){clickBubble(Number(t.dataset.id));return;}
 if(action==='sticker'){sticker=t.dataset.id;feedback='Acum atinge un loc liber de pe prosop.';draw();return;}
 if(action==='stamp'){clickStamp(Number(t.dataset.id));return;}
},true);
window.MaricicaWorksheets={open:()=>start('hub'),start,reset:()=>start(mode),get mode(){return mode},get progress(){return done.size},get finished(){return finished},games:catalogue.map(c=>c.id),version:'1.0'};
if(state.view==='home')homeEntry();
if(window.location.hash==='#fise')start('hub');
})();