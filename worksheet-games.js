/* Maricica · Cinci activitati tactile adaptate din fisele profesionale A4.
   Pentru grupa mica, fara cont, cronometru, colectare de date sau drag fantoma. */
(function(){
'use strict';
const app=document.getElementById('app');if(!app)return;
const catalogue=[
 {id:'trusa',title:'Trusa Maricicăi',short:'Pune în trusă obiectele de curățenie',icon:'🧴',tone:'peach'},
 {id:'potriveste',title:'Unde se folosește?',short:'Potrivește obiectul cu locul potrivit',icon:'👐',tone:'mint'},
 {id:'curata',title:'Curată sau murdărică?',short:'Alege Maricica îngrijită',icon:'✨',tone:'pink'},
 {id:'spuma',title:'Buline de spumă',short:'Decorăm săpunelul cu opt buline',icon:'🫧',tone:'sky'},
 {id:'prosop',title:'Prosopelul Maricicăi',short:'Decorează prosopul cu modele vesele',icon:'🌼',tone:'lilac'}
];
const objects=[
 {id:'soap',name:'Săpun',color:'red',target:'hands'},
 {id:'brush',name:'Periuță',color:'blue',target:'teeth'},
 {id:'comb',name:'Pieptene',color:'yellow',target:'hair'},
 {id:'bear',name:'Ursuleț',color:'none',target:'none'}
];
let mode='hub',selected=null,feedback='',done=new Set(),slots=[],correctChoice='',sticker='🌼',chosenColor='#f89bb6',busy=false,finished=false;
const nativeAudio=()=>{try{if(!state.muted&&typeof tonal==='function')tonal(true)}catch(e){}};
const soundWrong=()=>{try{if(!state.muted&&typeof tonal==='function')tonal(false)}catch(e){}};
const speakHint=text=>{try{if(!state.muted&&typeof speak==='function')speak(text)}catch(e){}};
const objectAsset=id=>{
 if(id==='bear')return '<img class="wg-object-img" src="assets/cinema5/teddy-cutout.webp" alt="" draggable="false" loading="eager">';
 if(id==='comb')return '<img class="wg-object-img" src="assets/cinema/comb.webp" alt="" draggable="false" loading="eager">';
 const item=objects.find(t=>t.id===id);
 return '<img class="wg-object-img" src="assets/hygiene/individual/'+id+'-'+(item?.color||'blue')+'.webp" alt="" draggable="false" loading="eager">';
};
function resetValues(){
 selected=null;feedback='';slots=[];done=new Set();correctChoice='';sticker='🌼';chosenColor='#f89bb6';finished=false;busy=false;
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
 window.scrollTo?.({top:0,behavior:'instant'});
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
 '<span class="wg-hub-number">'+String(i+1).padStart(2,'0')+'</span><span class="wg-hub-illustration" aria-hidden="true">'+it.icon+'</span>'+
 '<strong>'+it.title+'</strong><small>'+it.short+'</small><span class="wg-hub-go" aria-hidden="true">Începem →</span></button>').join('');
 app.innerHTML='<section class="wg-app wg-hub"><div class="wg-hub-lead"><button type="button" data-wg="home" class="wg-nav-btn">← Acasă</button>'+
 '<div class="wg-hub-tag">🌸 CINCI ACTIVITĂȚI DIN FIȘELE MARICICĂI</div><h1>Ne jucăm și învățăm!</h1>'+
 '<p>Activități mari, colorate și ușor de atins, pentru copiii de 3 ani.</p></div><div class="wg-hub-grid">'+cards+'</div>'+
 '<div class="wg-hub-tip">Atinge un cartonaș pentru a începe. Fiecare joc poate fi reluat oricând.</div></section>';
}
function renderKit(){
 const required=['soap','brush','comb'],used=slots.filter(Boolean);
 const cards=objects.map(o=>tile(o,selected===o.id,used.includes(o.id))).join('');
 const holes=required.map((_,i)=>{
  const id=slots[i],obj=objects.find(o=>o.id===id);
  return '<button type="button" class="wg-kit-hole '+(id?'wg-filled':'')+'" data-wg="place" data-slot="'+i+'" aria-label="Locul '+(i+1)+(id?', '+obj?.name:' gol')+'">'+
   (id?objectAsset(id)+'<strong>'+obj.name+'</strong>':'<span class="wg-slot-plus">＋</span><small>Loc liber</small>')+'</button>';
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
 {id:'hands',name:'Mânuțe',symbol:'👐',hint:'Spălăm mânuțele'},
 {id:'hair',name:'Păr',symbol:'👧',hint:'Pieptănăm părul'},
 {id:'teeth',name:'Dințișori',symbol:'😁',hint:'Periem dinții'}
 ];
 const placed=slots.filter(Boolean);
 const targetHtml=targets.map(t=>{
  const object=objects.find(o=>o.target===t.id);
  const marked=slots.includes(t.id);
  return '<button type="button" data-wg="match" data-target="'+t.id+'" class="wg-match-target '+(marked?'wg-correct':'')+'" aria-label="'+t.name+'">'+
  '<span class="wg-target-art" aria-hidden="true">'+t.symbol+'</span><strong>'+t.name+'</strong><small>'+t.hint+'</small>'+
  '<span class="wg-target-pocket">'+(marked?'<span class="wg-mini-placed">'+objectAsset(object.id)+'<b>✓</b></span>':'Atinge aici')+'</span></button>';
 }).join('');
 const options=objects.filter(o=>o.id!=='bear').map(o=>tile(o,selected===o.id,slots.includes(o.target))).join('');
 shell('Unde se folosește?','Potrivim obiectele de igienă cu imaginile potrivite.',
 '<div class="wg-match-layout"><div class="wg-activity-surface">'+ribbon(placed.length,3)+'<div class="wg-match-targets">'+targetHtml+'</div></div>'+
 '<aside class="wg-activity-side"><h2>Alege obiectul</h2><div class="wg-match-objects">'+options+'</div>'+
 '<p class="wg-help">Săpunul pentru mâini, pieptenele pentru păr, periuța pentru dinți.</p></aside></div>',2);
}
function renderClean(){
 const cleanChosen=correctChoice==='clean',bubbleChosen=done.size>0;
 const girls=[
 {id:'dirty',label:'Maricica murdărică',img:'assets/cinema/maricica-dirty.webp'},
 {id:'clean',label:'Maricica curată',img:'assets/cinema/maricica-clean.webp'}
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
 const circles=bubblePositions.map(([x,y],i)=>'<button type="button" class="wg-bubble-spot '+(done.has(i)?'wg-bubbled':'')+'" style="left:'+x+'%;top:'+y+'%" data-wg="bubble" data-id="'+i+'" aria-label="Bulina '+(i+1)+'">'+(done.has(i)?'<span class="wg-real-bubble"></span>':'<span class="wg-bubble-plus">＋</span>')+'</button>').join('');
 shell('Buline de spumă','Atinge cele opt cerculețe și decorează săpunelul.',
 '<div class="wg-bubbles-layout"><div class="wg-activity-surface">'+ribbon(done.size,8)+
 '<div class="wg-bubble-play">'+circles+'<div class="wg-bubble-soap"><img src="assets/hygiene/individual/soap-red.webp" alt="Săpunel roz" draggable="false"></div></div></div>'+
 '<aside class="wg-activity-side wg-bubble-note"><div class="wg-big-symbol">🫧</div><h2>Facem spumă!</h2><p>Fiecare atingere adaugă o bulină strălucitoare. Toate opt vor forma spuma săpunelului.</p></aside></div>',4);
}
const stampChoices=[{symbol:'🌼',name:'Floare',color:'#ffcb65'},{symbol:'✦',name:'Steluță',color:'#ffc95e'},{symbol:'♥',name:'Inimioară',color:'#ef83ac'},{symbol:'●',name:'Bulină',color:'#7fcbdb'}];
const towelSpots=[[24,29],[50,27],[75,29],[35,50],[63,51],[50,74]];
function renderTowel(){
 const stamps=stampChoices.map(st=>'<button type="button" data-wg="sticker" data-id="'+st.symbol+'" class="wg-sticker-choice '+(sticker===st.symbol?'is-selected':'')+'" aria-label="'+st.name+'" aria-pressed="'+(sticker===st.symbol)+'"><span style="color:'+st.color+'">'+st.symbol+'</span><small>'+st.name+'</small></button>').join('');
 const spots=towelSpots.map(([x,y],i)=>{
  const v=slots[i],info=stampChoices.find(o=>o.symbol===v);
  return '<button type="button" data-wg="stamp" data-id="'+i+'" class="wg-towel-spot '+(v?'is-stamped':'')+'" style="left:'+x+'%;top:'+y+'%" aria-label="Decor '+(i+1)+'">'+
  (v?'<span style="color:'+info?.color+'">'+v+'</span>':'<i>＋</i>')+'</button>';
 }).join('');
 const towel='<div class="wg-towel-holder"><span class="wg-towel-rod"></span><div class="wg-towel-shape"><div class="wg-towel-top"></div>'+
 '<div class="wg-towel-canvas">'+spots+'</div><div class="wg-towel-bottom">✿</div></div></div>';
 shell('Prosopelul Maricicăi','Alege modelul preferat și decorează prosopelul.',
 '<div class="wg-towel-layout"><div class="wg-activity-surface">'+ribbon(done.size,6)+towel+'</div>'+
 '<aside class="wg-activity-side"><h2>Alege un model</h2><div class="wg-stamp-palette">'+stamps+'</div>'+
 '<p class="wg-help">Atinge un model, apoi un cerc de pe prosop. Poți combina flori, steluțe, inimioare și buline.</p></aside></div>',5);
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