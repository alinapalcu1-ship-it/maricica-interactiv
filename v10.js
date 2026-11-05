/* Poveste animata V10 - strat progresiv, fara schimbari in fisierele MP3.
   Foloseste numai imagini si obiecte deja prezente in proiect. */
(()=>{
  'use strict';
  const moods = [
    {from:0,to:4,mood:'morning',focus:'center'},
    {from:5,to:14,mood:'hesitant',focus:'left'},
    {from:15,to:20,mood:'classroom',focus:'center'},
    {from:21,to:26,mood:'sad',focus:'left'},
    {from:27,to:35,mood:'hope',focus:'center'},
    {from:36,to:39,mood:'washing',focus:'center'},
    {from:40,to:42,mood:'combing',focus:'center'},
    {from:43,to:46,mood:'brushing',focus:'center'},
    {from:47,to:54,mood:'celebrate',focus:'center'}
  ];
  const motionFor = i => moods.find(x=>i>=x.from&&i<=x.to)||moods[0];
  let lastLine=-1;
  let currentStage=null;
  const motionReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncMotion(){
    if(state.view!=='story')return;
    const scene=document.querySelector('.v8-scene');
    if(!scene)return;
    const changed=state.index!==lastLine||scene!==currentStage;
    const cue=motionFor(state.index);
    const isPlaying=!!(state.playing&&!audio.paused&&!audio.ended&&!state.waiting);
    scene.dataset.v10Mood=cue.mood;
    scene.dataset.v10Focus=cue.focus;
    scene.dataset.v10Motion=isPlaying&&!motionReduced.matches?'playing':'paused';
    scene.dataset.v10Speaker=LINES[state.index]?.[1]||'Narator';
    if(changed){
      scene.classList.remove('v10-cue-enter');
      void scene.offsetWidth;
      scene.classList.add('v10-cue-enter');
      lastLine=state.index;currentStage=scene;
    }
    const stage=document.querySelector('.story-stage');
    if(stage)stage.setAttribute('aria-label',CHAPTERS[sceneIndex()].title+' — '+LINES[state.index][0]);
    // Facem butoanele de pauza si reluare explicite pentru copii si educatoare.
    const pause=document.querySelector('[data-action="play-pause"]');
    if(pause)pause.title=isPlaying?'Pauză poveste':'Continuă povestea';
  }
  const previousCaption=updateCaption;
  updateCaption=function(){previousCaption();syncMotion()};
  const previousStory=renderStory;
  renderStory=function(){previousStory();syncMotion()};
  ['play','pause','ended','seeking'].forEach(ev=>audio.addEventListener(ev,()=>requestAnimationFrame(syncMotion)));
  // La revenirea in fila/browser sincronizam animatia cu starea audio.
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)return;
    requestAnimationFrame(syncMotion);
  });
  window.MaricicaStoryMotionV10={sync:syncMotion,version:'10'};
})();
