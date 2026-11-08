/* knobe.org: the four-station illustration. Five scenes, two acts each.
   knobeStage(root, { start: 'home' })
   Each scene carries its own loss matrix (keeps): what a competent current
   system would realistically preserve at each station, act one. Act two
   (With KNOBE) keeps everything and seals each station. */
var KNOBE_SCENES=[
  { key:'home', label:'A house', stations:['Inspection report','Listing summary','Buyer’s AI brief','Loan file'],
    systems:['report software','listing platform','AI assistant','loan file system'],
    files:['.pdf','web copy','chat paste','.pdf scan'],
    chips:['Inspector: R. Ortiz','Inspected in June','Attic not entered','Roof not assessed'],
    keeps:[[1,1,1,1],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
    caption:'A home inspector writes up a house, with two limits on the record: the attic was not entered, the roof was not assessed. The listing summary keeps the inspector and the date. The buyer’s AI brief keeps only the date. The loan file keeps nothing. Every step was reasonable. By the fourth, nobody knows the roof was never looked at.',
    verdicts:{ without:'“Roof in good condition.”', withk:'“Roof not assessed. Attic not entered.”' },
    impact:{ without:'A buyer closes on a roof nobody ever looked at. When it fails, the record that would have settled who knew what no longer exists anywhere downstream.', withk:'The loan file still names the inspector and both limits, so the lender prices the unknown instead of inheriting it, and the next reader can verify nothing changed since June.' } },
  { key:'work', label:'A job', stations:['Manager’s notes','HR summary','AI-drafted reference','Hiring decision'],
    systems:['notes app','HR system','AI writing tool','hiring committee'],
    files:['.docx','HR form','chat draft','email'],
    chips:['Written by Priya','One quarter only','Disputed by Sam','Draft, not final'],
    keeps:[[1,1,1,1],[1,1,0,1],[1,0,0,0],[0,0,0,0]],
    caption:'A manager writes notes on one quarter of someone’s work. The notes are a draft, and the employee disputes a line. The HR summary is competent and loses exactly one thing: the dispute. The AI-drafted reference keeps only the author’s name. A hiring decision rests on the reference. By the fourth, a disputed draft about one quarter reads as a settled judgment about a person.',
    verdicts:{ without:'“Consistently underperforms.”', withk:'“Draft. One quarter. Disputed.”' },
    impact:{ without:'A person’s next job is decided by a document three steps removed from a draft they disputed. No one in the chain did anything wrong enough to notice.', withk:'The committee sees draft, one quarter, disputed, and weighs the reference accordingly. Sam’s dispute travels with the file, which means it can finally be answered.' } },
  { key:'product', label:'A product', stations:['Lab test memo','Spec sheet','Retailer page','Support chatbot'],
    systems:['lab system','product database','retail CMS','support bot'],
    files:['.pdf','.xlsx','CMS text','RAG chunks'],
    chips:['Engineer: M. Lin','Batch 7 only','Tested at 20°C','Not for outdoor use'],
    keeps:[[1,1,1,1],[0,1,1,1],[0,0,0,0],[0,0,0,0]],
    caption:'An engineer tests a device and writes a memo: batch 7 only, tested at 20°C, not for outdoor use. The spec sheet keeps every limit and drops only the engineer. The retailer page keeps none of it. The support chatbot, answering from the retailer page, tells a customer it is fine outdoors. The chatbot was not wrong about the page it read; the page had already lost the knowing.',
    verdicts:{ without:'“Yes, fine for outdoor use.”', withk:'“Not rated for outdoor use.”' },
    impact:{ without:'A customer mounts it outdoors on the chatbot’s word. The recall, when it comes, traces back through three systems to a memo that said so all along.', withk:'The chatbot reads the sealed limits before answering and says so. Even the retailer page can be tighter, because the file it compresses from still carries what may be claimed.' } },
  { key:'research', label:'A study', stations:['Pilot dataset','Working paper','AI literature summary','Policy brief'],
    systems:['data repository','preprint server','AI research tool','policy office'],
    files:['.csv','.pdf','web summary','.docx'],
    chips:['Lead: Dr. A. Okafor','Pilot, n = 42','Not yet peer reviewed','Correlation, not cause'],
    keeps:[[1,1,1,1],[1,1,1,1],[1,1,0,0],[1,0,0,0]],
    caption:'A research team runs a pilot: 42 participants, correlational, not yet peer reviewed. The working paper, as good papers do, carries all four. The AI literature summary keeps the citation and the sample size; both caveats are gone. The policy brief keeps only the citation. The name survives the whole chain. The epistemics do not, and a 42-person correlation reads as settled evidence that the treatment works.',
    verdicts:{ without:'“The treatment works.”', withk:'“Pilot, n = 42. Correlation only.”' },
    impact:{ without:'Policy gets made on a finding the researcher never claimed. The name travels with the certainty, and the correction, if it ever comes, will travel with none of its reach.', withk:'The brief is a new sealed object that names its parent, caveats inherited with the citation, so a later tool can check what a 42-person correlation may support. The pilot is citable for exactly what it is.' } },
  { key:'agent', label:'An agent', stations:['Pricing memo','Agent A digest','Agent B proposal','Automated reply'],
    systems:['shared drive','knowledge base','agent context','email automation'],
    files:['.docx','vector chunks','draft text','email text'],
    chips:['From: finance team','Draft, not approved','Internal only','Expires Dec 31'],
    keeps:[[1,1,1,1],[1,0,1,0],[1,0,0,0],[0,0,0,0]],
    caption:'A finance team drafts a pricing memo: a draft, internal only, expiring December 31. Ingestion keeps the metadata it can see, the sender and the audience, and loses the two flags that lived in the prose: draft and expiry. The second agent keeps the source line. The reply keeps nothing. After the memo, no person touches the chain, and the quote that reaches the customer is confident, current, and wrong in three ways the memo itself declared.',
    verdicts:{ without:'“$14 per seat, locked in.”', withk:'“Draft. Internal. Expires Dec 31.”' },
    impact:{ without:'A customer holds a quote no human approved, at a price that expired. The company’s first notice is the complaint, and the audit finds no step where anyone decided anything.', withk:'Agent B reads the sealed terms before proposing: draft, internal, expiring. The automated reply asks a human instead of quoting, which is what terms that travel are for.' } },
  { key:'access', label:'An adaptation', stations:['Accessible module','Team template','AI refresh','Published course'],
    systems:['authoring tool','document platform','AI assistant','learning platform'],
    files:['tagged .docx','template copy','regen images','SCORM package'],
    chips:['Adapted by: T. Abara','Access work: 14 hours','Screen-reader tested','Charts described'],
    keeps:[[1,1,1,1],[1,0,0,1],[1,0,0,0],[1,0,0,0]],
    caption:'A low-vision designer builds a training module that actually works with a screen reader: fourteen hours of access work, every chart described in text. The team template keeps her name and her descriptions. The AI refresh keeps only the name, replacing described charts with new images and automatic alt text. The published course keeps the credit and asserts a checkbox. She is cited on a course she can no longer read.',
    verdicts:{ without:'“Meets accessibility standards.”', withk:'“Tested. Described. By T. Abara.”' },
    impact:{ without:'The next cohort’s screen-reader users hit unreadable charts, and the work is redone from scratch because nobody can see it was ever done. Fourteen hours of method, lost as styling.', withk:'The refresh inherits the descriptions and the testing record, and each version is resealed with her adaptation in its lineage. The access work is citable work by a named adapter, not invisible labor.' } }
];
function knobeStage(root, opts){
  var HOP=1800, SLIDE=600, scenes=(opts&&opts.scenes)||KNOBE_SCENES;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var act='without', timers=[], atEnd=false, scene=null;
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function keep(i,k){ return act==='with' ? true : scene.keeps[i][k]===1; }
  function later(fn,ms){ timers.push(setTimeout(fn,ms)); }
  function clear(){ timers.forEach(clearTimeout); timers=[]; }
  var h='<div class="stage-controls"><div class="seg scenes" role="group" aria-label="Choose a scene">';
  scenes.forEach(function(s){ h+='<button type="button" data-scene="'+esc(s.key)+'" aria-pressed="false">'+esc(s.label)+'</button>'; });
  h+='</div><div class="seg acts" role="group" aria-label="Choose an act"><button type="button" class="act-without" aria-pressed="true">Without KNOBE</button><button type="button" class="act-with" aria-pressed="false">With KNOBE</button></div>'+
     '<button type="button" class="replay">Replay</button></div><div class="stage-slot"></div><div class="caption"><p class="scene-caption"></p></div>';
  root.innerHTML=h;
  var slot=root.querySelector('.stage-slot'), cap=root.querySelector('.scene-caption');
  var bWithout=root.querySelector('.act-without'), bWith=root.querySelector('.act-with'), replay=root.querySelector('.replay');
  var sceneBtns=[].slice.call(root.querySelectorAll('[data-scene]'));
  var stage, stations, traveler;
  function counts(){ return scene.keeps.map(function(row){ return row.reduce(function(a,b){return a+b;},0); }); }
  function build(){
    var cs=counts();
    var aria='Four stations, each a different human and machine system: '+scene.stations.map(function(n,i){return n+' ('+scene.systems[i]+', '+scene.files[i]+' without KNOBE, a sealed or resealed .knobe.md with it)';}).join(', ')+'. Without KNOBE, of the four conditions attached at the start ('+scene.chips.join(', ')+'), the counts surviving at each station are '+cs.join(', ')+', and the run ends with the last station asserting '+scene.verdicts.without+' With KNOBE all four arrive at every station, the file carries a seal, and the run ends '+scene.verdicts.withk;
    var s='<div class="stage" role="img" aria-label="'+esc(aria)+'"><div class="traveler" aria-hidden="true"></div>';
    scene.stations.forEach(function(name,i){
      s+='<div class="station" data-i="'+i+'"><div class="seal" aria-hidden="true"></div><div class="name">'+esc(name)+'</div><div class="sys">'+esc(scene.systems[i])+' \u00b7 <span class="file-without">'+esc(scene.files[i])+'</span><span class="file-with">'+(i===0?'sealed .knobe.md':'resealed .knobe.md')+'</span></div><div class="chips">';
      scene.chips.forEach(function(c,k){ s+='<div class="chip" data-k="'+k+'" style="--r:'+[-7,5,-4,8][k]+'deg">'+esc(c)+'</div>'; });
      s+='</div><div class="count">'+(i===0?'4 of 4':'&nbsp;')+'</div>'+(i===3?'<div class="stamp" aria-hidden="true"></div>':'')+'</div>';
    });
    s+='</div><div class="impact" role="status"></div>';
    slot.innerHTML=s; cap.textContent=scene.caption;
    stage=slot.querySelector('.stage'); stations=[].slice.call(stage.querySelectorAll('.station')); traveler=stage.querySelector('.traveler');
    sceneBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-scene')===scene.key); });
  }
  function setCount(st,n){ var c=st.querySelector('.count'); c.textContent=n+' of 4'; c.className='count'+(n===4?' full':(n===0?' zero':'')); }
  function stamp(show){ var el=stage.querySelector('.stamp'), im=slot.querySelector('.impact');
    if(!show||!scene.verdicts){ if(el){el.className='stamp'; el.textContent='';} if(im){im.className='impact'; im.innerHTML='';} return; }
    if(el){ el.textContent=(act==='with'?scene.verdicts.withk:scene.verdicts.without);
      el.className='stamp show '+(act==='with'?'good':'bad'); }
    if(im && scene.impact){ im.innerHTML='<span class="k">'+(act==='with'?'What happens next':'The cost')+'</span>'+esc(act==='with'?scene.impact.withk:scene.impact.without);
      im.className='impact show '+(act==='with'?'good':'bad'); } }
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
  function setActButtons(){ bWithout.setAttribute('aria-pressed',act==='without'); bWith.setAttribute('aria-pressed',act==='with'); root.setAttribute('data-act',act); }
  function chooseAct(a){ act=a; setActButtons(); play(); }
  function chooseScene(key){ scene=scenes.filter(function(s){ return s.key===key; })[0]||scenes[0]; act='without'; setActButtons(); build(); play(); }
  bWithout.addEventListener('click',function(){ chooseAct('without'); });
  bWith.addEventListener('click',function(){ chooseAct('with'); });
  replay.addEventListener('click',play);
  sceneBtns.forEach(function(b){ b.addEventListener('click',function(){ chooseScene(b.getAttribute('data-scene')); }); });
  window.addEventListener('resize',function(){ if(stage && !timers.length) moveTo(atEnd?3:0); });
  /* Nothing moves until the reader asks: start on the final frame (WCAG 2.2.2). */
  scene=scenes.filter(function(s){ return s.key===(opts&&opts.start); })[0]||scenes[0]; build(); setActButtons();
  resetStage(); traveler.style.transition='none'; finalFrame(); void traveler.offsetWidth; traveler.style.transition='';
}
