/* knobe.org: the four-station illustration. Three scenes, two acts each.
   knobeStage(root, { scenes: KNOBE_SCENES, start: 'home' })
   Without KNOBE: station 0 keeps all four conditions, station 1 keeps the first two, stations 2 and 3 keep none.
   With KNOBE: all four at every station, with a seal. */
var KNOBE_SCENES=[
  { key:'home', label:'A house', stations:['Inspection report','Listing summary','Buyer\u2019s AI brief','Loan file'],
    chips:['Inspector: R. Ortiz','Inspected in June','Attic not entered','Roof not assessed'],
    caption:'A home inspector writes up a house. The report names the inspector, the June date, and two limits: the attic was not entered and the roof was not assessed. The listing agent summarizes it. The buyer asks an AI assistant for a brief. The brief goes into the loan file. Every step was reasonable. By the fourth, the file says the roof is in good condition, and nobody downstream knows the roof was never looked at.',
    verdicts:{ without:'\u201cRoof in good condition.\u201d', withk:'\u201cRoof not assessed. Attic not entered.\u201d' } },
  { key:'work', label:'A job', stations:['Manager\u2019s notes','HR summary','AI-drafted reference','Hiring decision'],
    chips:['Written by Priya','One quarter only','Disputed by Sam','Draft, not final'],
    caption:'A manager writes notes on one quarter of someone\u2019s work. The notes are a draft, and the employee disputes a line. HR summarizes them. An AI drafts a reference from the summary. A hiring decision rests on the reference. Every step was reasonable. By the fourth, a disputed draft about one quarter reads as a settled judgment about a person.',
    verdicts:{ without:'\u201cConsistently underperforms.\u201d', withk:'\u201cDraft. One quarter. Disputed.\u201d' } },
  { key:'product', label:'A product', stations:['Lab test memo','Spec sheet','Retailer page','Support chatbot'],
    chips:['Engineer: M. Lin','Batch 7 only','Tested at 20\u00b0C','Not for outdoor use'],
    caption:'An engineer tests a device and writes a memo: batch 7 only, tested at 20\u00b0C, not for outdoor use. The spec sheet keeps the engineer\u2019s name and the batch. The retailer page keeps neither limit. The support chatbot, answering from the retailer page, tells a customer it is fine outdoors. Every step was reasonable. The chatbot was not wrong about the page it read; the page had already lost the knowing.',
    verdicts:{ without:'\u201cYes, fine for outdoor use.\u201d', withk:'\u201cNot rated for outdoor use.\u201d' } },
  { key:'research', label:'A study', stations:['Pilot dataset','Working paper','AI literature summary','Policy brief'],
    chips:['Lead: Dr. A. Okafor','Pilot, n = 42','Not yet peer reviewed','Correlation, not cause'],
    caption:'A research team runs a pilot: 42 participants, correlational, not yet peer reviewed. The working paper keeps the lead author and the sample size. An AI literature summary keeps neither caveat. A policy brief cites the summary. Every step was reasonable. By the fourth, a 42-person correlation reads as settled evidence that the treatment works.',
    verdicts:{ without:'\u201cThe treatment works.\u201d', withk:'\u201cPilot, n = 42. Correlation only.\u201d' } },
  { key:'agent', label:'An agent', stations:['Pricing memo','Agent A digest','Agent B proposal','Automated reply'],
    chips:['From: finance team','Draft, not approved','Internal only','Expires Dec 31'],
    caption:'A finance team drafts a pricing memo: a draft, internal only, expiring December 31. One agent digests it into the knowledge base. A second agent drafts a proposal from the digest. An automated reply sends a customer the number. After the memo, no person touches the chain. The quote is confident, current, and wrong in three ways the memo itself declared.',
    verdicts:{ without:'\u201c$14 per seat, locked in.\u201d', withk:'\u201cDraft. Internal. Expires Dec 31.\u201d' } }
];
function knobeStage(root, opts){
  var HOP=1800, SLIDE=600, scenes=opts.scenes||KNOBE_SCENES;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var act='without', timers=[], atEnd=false, played=false, scene=null;
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function keep(i,k){ return act==='with' ? true : (i===0 ? true : (i===1 ? k<2 : false)); }
  function later(fn,ms){ timers.push(setTimeout(fn,ms)); }
  function clear(){ timers.forEach(clearTimeout); timers=[]; }
  // shell: scene tabs, act toggle, stage, caption
  var h='<div class="stage-controls"><div class="seg scenes" role="group" aria-label="Choose a scene">';
  scenes.forEach(function(s){ h+='<button type="button" data-scene="'+esc(s.key)+'" aria-pressed="false">'+esc(s.label)+'</button>'; });
  h+='</div><div class="seg acts" role="group" aria-label="Choose an act"><button type="button" class="act-without" aria-pressed="true">Without KNOBE</button><button type="button" class="act-with" aria-pressed="false">With KNOBE</button></div>'+
     '<button type="button" class="replay">Replay</button></div><div class="stage-slot"></div><div class="caption"><p class="scene-caption"></p></div>';
  root.innerHTML=h;
  var slot=root.querySelector('.stage-slot'), cap=root.querySelector('.scene-caption');
  var bWithout=root.querySelector('.act-without'), bWith=root.querySelector('.act-with'), replay=root.querySelector('.replay');
  var sceneBtns=[].slice.call(root.querySelectorAll('[data-scene]'));
  var stage, stations, traveler;
  function build(){
    var aria='Four stations: '+scene.stations.join(', ')+'. Without KNOBE, the four conditions attached at the first station ('+scene.chips.join(', ')+') fall away by the third. With KNOBE all four arrive at every station.';
    var s='<div class="stage" role="img" aria-label="'+esc(aria)+'"><div class="traveler" aria-hidden="true"></div>';
    scene.stations.forEach(function(name,i){
      s+='<div class="station" data-i="'+i+'"><div class="seal" aria-hidden="true"></div><div class="name">'+esc(name)+'</div><div class="chips">';
      scene.chips.forEach(function(c,k){ s+='<div class="chip" data-k="'+k+'" style="--r:'+[-7,5,-4,8][k]+'deg">'+esc(c)+'</div>'; });
      s+='</div><div class="count">'+(i===0?'4 of 4':'&nbsp;')+'</div>'+(i===3?'<div class="stamp" aria-hidden="true"></div>':'')+'</div>';
    });
    s+='</div><p class="vh">'+esc('Without KNOBE: four of four at '+scene.stations[0]+', two of four at '+scene.stations[1]+', none at '+scene.stations[2]+' or '+scene.stations[3]+'. With KNOBE: four of four at every station, and the file carries a seal.')+'</p>';
    slot.innerHTML=s; cap.textContent=scene.caption;
    stage=slot.querySelector('.stage'); stations=[].slice.call(stage.querySelectorAll('.station')); traveler=stage.querySelector('.traveler');
    sceneBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-scene')===scene.key); });
  }
  function setCount(st,n){ var c=st.querySelector('.count'); c.textContent=n+' of 4'; c.className='count'+(n===4?' full':(n===0?' zero':'')); }
  function stamp(show){ var el=stage.querySelector('.stamp'); if(!el) return;
    if(!show||!scene.verdicts){ el.className='stamp'; el.textContent=''; return; }
    el.textContent=(act==='with'?scene.verdicts.withk:scene.verdicts.without);
    el.className='stamp show '+(act==='with'?'good':'bad'); }
  function moveTo(i){ var r=stations[i].getBoundingClientRect(), s=stage.getBoundingClientRect(); traveler.style.left=(r.left-s.left+r.width/2-15)+'px'; traveler.style.top=(r.top-s.top-19)+'px'; }
  function resetStage(){
    clear(); atEnd=false; stage.className='stage'+(act==='with'?' with':'');
    stations.forEach(function(st,i){ st.classList.remove('sealed');
      [].slice.call(st.querySelectorAll('.chip')).forEach(function(ch){ ch.className='chip'+(i===0?' on':' empty'); });
      var c=st.querySelector('.count'); if(i===0){setCount(st,4);} else {c.innerHTML='&nbsp;'; c.className='count';} });
    stamp(false);
    if(act==='with') stations[0].classList.add('sealed');
    traveler.style.transition='none'; moveTo(0); void traveler.offsetWidth; traveler.style.transition='';
  }
  function finalFrame(){
    stage.className='stage'+(act==='with'?' with':'');
    stations.forEach(function(st,i){ var n=0;
      [].slice.call(st.querySelectorAll('.chip')).forEach(function(ch,k){ var on=keep(i,k); if(on)n++; ch.className='chip'+(on?' on':' lost'); });
      setCount(st,n); if(act==='with') st.classList.add('sealed'); });
    moveTo(3); stamp(true); atEnd=true;
  }
  function arrive(i){
    var st=stations[i], chips=[].slice.call(st.querySelectorAll('.chip')), n=0;
    chips.forEach(function(ch,k){ ch.className='chip on';
      if(!keep(i,k)){ later(function(){ ch.classList.add('falling'); },120+k*80); later(function(){ ch.className='chip lost'; },120+k*80+SLIDE); } else { n++; } });
    later(function(){ setCount(st,n); if(act==='with') st.classList.add('sealed'); },120+SLIDE);
  }
  function play(){
    resetStage();
    if(reduce){ finalFrame(); return; }
    for(var i=1;i<4;i++){ (function(i){ later(function(){ moveTo(i); later(function(){ arrive(i); if(i===3) later(function(){ stamp(true); atEnd=true; },SLIDE+700); },SLIDE); }, i*HOP); })(i); }
  }
  function chooseAct(a){ act=a; bWithout.setAttribute('aria-pressed',a==='without'); bWith.setAttribute('aria-pressed',a==='with'); play(); }
  function chooseScene(key){ scene=scenes.filter(function(s){ return s.key===key; })[0]||scenes[0]; build(); play(); }
  bWithout.addEventListener('click',function(){ chooseAct('without'); });
  bWith.addEventListener('click',function(){ chooseAct('with'); });
  replay.addEventListener('click',play);
  sceneBtns.forEach(function(b){ b.addEventListener('click',function(){ chooseScene(b.getAttribute('data-scene')); }); });
  window.addEventListener('resize',function(){ if(stage && !timers.length) moveTo(atEnd?3:0); });
  scene=scenes.filter(function(s){ return s.key===opts.start; })[0]||scenes[0]; build();
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting && !played){ played=true; play(); io.disconnect(); } }); },{threshold:.4});
    resetStage(); io.observe(stage);
  } else { play(); }
}
