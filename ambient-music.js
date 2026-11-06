/* Maricica — fundal audio discret cu ducking automat (poveste, poezie, jocuri). */
(function(){
'use strict';
const btn=document.getElementById('ambient-music-toggle');
if(!btn)return;
const TRACK='assets/audio/the_mountain-children-522447.mp3';
const AC=window.AudioContext||window.webkitAudioContext;
const tune=new Audio(TRACK);
tune.loop=true;
tune.preload='none';
tune.volume=0.075;
let enabled=false,mode='file',failed=false,ctx=null,timer=null,step=0,next=0,level=0,poemVoice=false;
const tempo=84,beat=60/tempo,scale={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880};
const melody=['E5',null,'G5','E5','D5',null,'C5',null,'E5','G5','A5',null,'G5','E5','D5',null,'F5',null,'A5','G5','E5',null,'F5',null,'G5','E5','D5',null,'C5',null,'C5',null];
const bass=['C4','C4','A4','A4','F4','F4','G4','G4'];
function playing(a){return !!a&&!a.paused&&!a.ended&&a.readyState>0;}
function voiceActive(){
 return poemVoice||!!window.speechSynthesis?.speaking||
 (typeof audio!=='undefined'&&playing(audio))||
 (typeof guidedAudio!=='undefined'&&playing(guidedAudio))||
 (typeof sfxAudio!=='undefined'&&playing(sfxAudio))||
 state.view==='guided'&&typeof guided!=='undefined'&&!!guided.audioActive;
}
function gainTarget(){
 if(!enabled||state.muted||document.hidden)return 0;
 return voiceActive()?0.009:0.075;
}
function tone(freq,at,duration,gain,type){
 if(!ctx||!freq)return;
 const o=ctx.createOscillator(),g=ctx.createGain(),filter=ctx.createBiquadFilter();
 o.type=type;o.frequency.setValueAtTime(freq,at);
 filter.type='lowpass';filter.frequency.value=type==='sine'?3200:1500;
 g.gain.setValueAtTime(.00001,at);
 g.gain.exponentialRampToValueAtTime(Math.max(.00005,gain),at+.016);
 g.gain.exponentialRampToValueAtTime(.00001,at+duration);
 o.connect(filter);filter.connect(g);g.connect(ctx.destination);
 o.start(at);o.stop(at+duration+.02);
}
function synthTick(){
 if(!ctx||mode!=='synth'||!enabled||level<.0003)return;
 const now=ctx.currentTime;
 if(next<now-.4)next=now+.06;
 let count=0;
 while(next<now+.23&&count++<3){
  const n=melody[step%melody.length],volume=level/.075;
  if(n)tone(scale[n],next,.37,.009*volume,'sine');
  if(step%4===0)tone(scale[bass[Math.floor(step/4)%bass.length]],next,.59,.003*volume,'triangle');
  step=(step+1)%melody.length;next+=beat;
 }
}
function tick(){
 const target=gainTarget();
 level+= (target-level)*.23;
 if(Math.abs(level-target)<.0005)level=target;
 if(mode==='file')tune.volume=Math.max(0,Math.min(.1,level));
 else synthTick();
}
function update(){
 btn.textContent=enabled?'♫':'♪';
 btn.classList.toggle('is-on',enabled);
 btn.setAttribute('aria-pressed',String(enabled));
 btn.setAttribute('aria-label',enabled?'Oprește muzica de fundal':'Pornește muzica de fundal');
 btn.title=enabled?'Oprește muzica de fundal':'Pornește muzica de fundal (volum redus)';
}
async function startSynth(){
 mode='synth';tune.pause();
 if(!AC)return;
 try{
  ctx=ctx||new AC();
  if(ctx.state==='suspended')await ctx.resume();
  next=ctx.currentTime+.08;step=0;
 }catch(e){}
}
tune.addEventListener('error',()=>{failed=true;if(enabled)startSynth();});
async function switchOn(){
 enabled=true;level=0;
 if(!timer)timer=setInterval(tick,140);
 if(!failed){
  try{
   await tune.play();
   mode='file';
  }catch(e){failed=true;await startSynth();}
 }else await startSynth();
 update();
}
btn.addEventListener('click',()=>{
 if(enabled){enabled=false;tune.pause();level=0;tick();if(timer){clearInterval(timer);timer=null;}update();}
 else switchOn();
});
window.addEventListener('maricica:voice',e=>{poemVoice=!!e.detail?.active;tick();});
window.addEventListener('pagehide',()=>{enabled=false;tune.pause();if(timer){clearInterval(timer);timer=null;}update();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)tune.pause();else if(enabled&&mode==='file')tune.play().catch(()=>{});});
update();
window.MaricicaAmbientMusic={get enabled(){return enabled},get mode(){return mode},get currentVolume(){return level},version:'2.0'};
})();