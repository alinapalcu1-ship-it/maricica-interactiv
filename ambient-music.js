/* Maricica — tema muzicala originala discreta, 84 BPM, opt-in. */
(function(){
'use strict';
const btn=document.getElementById('ambient-music-toggle');
const AC=window.AudioContext||window.webkitAudioContext;
if(!btn)return;
if(!AC){btn.disabled=true;btn.title='Muzica nu este disponibila in acest browser';return;}
let ctx=null,on=false,timer=null,step=0,next=0;
const beat=60/84,frequency={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880};
const notes=['E5',null,'G5','E5','D5',null,'C5',null,'E5','G5','A5',null,'G5','E5','D5',null,'F5',null,'A5','G5','E5',null,'F5',null,'G5','E5','D5',null,'C5',null,'C5',null];
const base=['C4','C4','A4','A4','F4','F4','G4','G4'];
function isQuiet(){
 return on&&!state.muted&&!document.hidden&&['home','v5-puzzle','v5-memory','hygiene-sort','hygiene-brush','games'].includes(state.view)&&
 (typeof audio==='undefined'||audio.paused)&&!window.speechSynthesis?.speaking;
}
function pluck(freq,at,decay,gain,type){
 if(!ctx||!freq)return;
 const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();
 o.type=type;o.frequency.setValueAtTime(freq,at);
 f.type='lowpass';f.frequency.value=type==='sine'?3000:1500;
 g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(gain,at+.016);g.gain.exponentialRampToValueAtTime(.0001,at+decay);
 o.connect(f);f.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+decay+.015);
}
function tick(){
 if(!on||!ctx)return;
 const now=ctx.currentTime;
 if(!isQuiet()){next=now+.2;return;}
 if(next<now-.4)next=now+.09;
 let guard=0;
 while(next<now+.22&&guard++<4){
  const n=notes[step%notes.length];
  if(n)pluck(frequency[n],next,.39,.010,'sine');
  if(step%4===0)pluck(frequency[base[Math.floor(step/4)%base.length]],next,.62,.004,'triangle');
  if(step%2===1&&n)pluck(frequency[n]/2,next+.10,.25,.0025,'triangle');
  next+=beat;step=(step+1)%notes.length;
 }
}
function update(){
 btn.classList.toggle('is-on',on);btn.setAttribute('aria-pressed',String(on));
 btn.setAttribute('aria-label',on?'Oprește muzica de fundal':'Pornește muzica de fundal');
 btn.title=on?'Oprește muzica':'Muzică originală discretă (84 BPM)';
 btn.textContent=on?'♫':'♪';
}
btn.addEventListener('click',async()=>{
 on=!on;
 try{
  if(on){
   ctx=ctx||new AC();if(ctx.state==='suspended')await ctx.resume();
   step=0;next=ctx.currentTime+.08;
   if(!timer)timer=setInterval(tick,150);
  }else if(timer){clearInterval(timer);timer=null;}
 }catch(e){on=false;if(timer){clearInterval(timer);timer=null;}}
 update();
});
window.addEventListener('pagehide',()=>{on=false;if(timer)clearInterval(timer);timer=null;update()});
update();
window.MaricicaAmbientMusic={get enabled(){return on},version:'1.0'};
})();