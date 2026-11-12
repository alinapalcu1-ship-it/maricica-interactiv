/* Maricica — tema originala instrumentala, porneste la prima interactiune permisa de browser.
   Marimba / ukulele pluck, 88 BPM, ducking automat pentru poveste, poezie si indicatii.
   Nu depinde de un MP3 absent sau de conexiune la internet. */
(function(){
'use strict';
const btn=document.getElementById('ambient-music-toggle');
if(!btn)return;
const AudioEngine=window.AudioContext||window.webkitAudioContext;
const tempo=88,beat=60/tempo;
const notes={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,
 C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,
 C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880};
const tune=[
 ['E5','C4'],['G5',null],['A5',null],['G5',null],['E5','G3'],[null,null],['D5',null],['C5',null],
 ['E5','A3'],['G5',null],['A5',null],['C5',null],['D5','F3'],['F5',null],['E5',null],['D5',null],
 ['G5','C4'],['E5',null],['D5',null],['C5',null],['E5','G3'],['F5',null],['G5',null],[null,null],
 ['A5','F3'],['G5',null],['F5',null],['E5',null],['D5','G3'],['E5',null],['D5',null],['C5',null]
];
let ctx=null,master=null,started=false,enabled=false,seq=0,nextAt=0,tickTimer=null,poemVoice=false;
let canAutostart=true,status='off',closing=false;
function activeMedia(a){return !!a&&!a.paused&&!a.ended&&a.readyState>0;}
function speechBusy(){
 return poemVoice||!!window.speechSynthesis?.speaking||
 (typeof audio!=='undefined'&&activeMedia(audio))||
 (typeof guidedAudio!=='undefined'&&activeMedia(guidedAudio))||
 (typeof sfxAudio!=='undefined'&&activeMedia(sfxAudio))||
 (typeof guided!=='undefined'&&!!guided.audioActive);
}
function targetVolume(){
 if(!enabled||state.muted||document.hidden)return 0;
 return speechBusy() ? 0.09 : 0.74;
}
function voice(kind,freq,at,seconds,intensity){
 const osc=ctx.createOscillator(),amp=ctx.createGain(),filter=ctx.createBiquadFilter();
 osc.type=kind==='bell'?'sine':'triangle';
 osc.frequency.setValueAtTime(freq,at);
 if(kind==='bell')osc.frequency.exponentialRampToValueAtTime(freq*.999,at+seconds);
 filter.type='lowpass';filter.frequency.value=kind==='bell'?3400:1300;
 amp.gain.setValueAtTime(.00001,at);
 amp.gain.exponentialRampToValueAtTime(intensity,at+.016);
 amp.gain.exponentialRampToValueAtTime(.00001,at+seconds);
 osc.connect(filter);filter.connect(amp);amp.connect(master);
 osc.start(at);osc.stop(at+seconds+.024);
}
function softHat(at){
 const osc=ctx.createOscillator(),amp=ctx.createGain();
 osc.type='sine';osc.frequency.setValueAtTime(1100,at);osc.frequency.exponentialRampToValueAtTime(670,at+.035);
 amp.gain.setValueAtTime(.00001,at);
 amp.gain.exponentialRampToValueAtTime(.0018,at+.005);
 amp.gain.exponentialRampToValueAtTime(.00001,at+.06);
 osc.connect(amp);amp.connect(master);osc.start(at);osc.stop(at+.075);
}
function schedule(){
 if(!ctx||!enabled||ctx.state!=='running')return;
 if(nextAt<ctx.currentTime-.6)nextAt=ctx.currentTime+.055;
 let count=0;
 while(nextAt<ctx.currentTime+.32&&count++<5){
  const [top,bass]=tune[seq];
  if(top){voice('bell',notes[top],nextAt,.46,.044);
    if(seq%2===1)voice('pluck',notes[top]/2,nextAt+.115,.31,.012);
  }
  if(bass)voice('pluck',notes[bass],nextAt,.65,.027);
  if(seq%4===2)softHat(nextAt);
  seq=(seq+1)%tune.length;nextAt+=beat*.5;
 }
}
function fade(){if(!ctx||!master)return;try{master.gain.setTargetAtTime(targetVolume(),ctx.currentTime,.22)}catch(e){}}
function refreshButton(){
 btn.classList.toggle('is-on',enabled);
 btn.dataset.musicStatus=enabled?'on':'off';
 btn.setAttribute('aria-pressed',String(enabled));
 btn.setAttribute('aria-label',enabled?'Oprește muzica de fundal':'Pornește muzica de fundal');
 btn.setAttribute('title',enabled?'Muzica este pornită · atinge pentru oprire':'Pornește melodia de fundal');
 btn.innerHTML=enabled?'<span aria-hidden="true">♫</span><small>Muzică ON</small>':'<span aria-hidden="true">♪</span><small>Muzică</small>';
 status=enabled?'on':'off';
}
function setup(){
 if(!AudioEngine){status='unavailable';btn.disabled=true;btn.title='Browserul nu poate reda muzica generată';return false;}
 if(ctx)return true;
 try{
  ctx=new AudioEngine();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
  seq=0;nextAt=ctx.currentTime+.09;return true;
 }catch(e){status='unavailable';return false;}
}
function begin(){
 if(closing)return;
 if(!setup())return;
 enabled=true;canAutostart=false;
 try{
  if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  nextAt=ctx.currentTime+.09;
  if(!tickTimer)tickTimer=window.setInterval(()=>{schedule();fade()},100);
  schedule();fade();refreshButton();
 }catch(e){enabled=false;refreshButton();}
}
function stop(){
 enabled=false;canAutostart=false;fade();refreshButton();
 if(tickTimer){clearInterval(tickTimer);tickTimer=null;}
}
btn.addEventListener('click',()=>{
 if(enabled)stop();else begin();
});
/* Autoplay on first intentional app interaction, never on page load.
   Pointerdown is a real gesture on Samsung, iOS Safari, Android and desktop. */
function onFirstGesture(e){
 if(!canAutostart||enabled)return;
 if(e.target.closest?.('#sound-toggle,#ambient-music-toggle,#maricica-refresh,#maricica-refresh-floating'))return;
 if(e.target.closest?.('#app,.mapp-dock'))begin();
}
document.addEventListener('pointerdown',onFirstGesture,true);
document.addEventListener('keydown',e=>{if(canAutostart&&(e.key==='Enter'||e.key===' ')){if(document.activeElement?.closest?.('#app,.mapp-dock'))begin()}},true);
window.addEventListener('maricica:voice',e=>{poemVoice=!!e.detail?.active;fade()});
document.addEventListener('visibilitychange',()=>{
 fade();
 if(!document.hidden&&enabled&&ctx?.state==='suspended')ctx.resume().catch(()=>{});
});
window.addEventListener('pagehide',()=>{closing=true;stop();if(ctx)ctx.suspend().catch(()=>{})});
if(!AudioEngine){btn.disabled=true;btn.setAttribute('aria-label','Muzică indisponibilă')}
refreshButton();
window.MaricicaAmbientMusic={start:begin,stop,get enabled(){return enabled},get status(){return status},get currentGain(){return master?.gain?.value||0},version:'3.0'};
})();