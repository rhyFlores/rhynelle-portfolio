gsap.registerPlugin(ScrollTrigger);

/* ── CURSOR ─────────────────────────────────── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
document.querySelectorAll('a,button,.pill,.achievement-card,.proj-panel,.contact-link-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-expand'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-expand'));
});

/* ── NAV SCROLL ─────────────────────────────── */
const mainNav=document.getElementById('main-nav');
window.addEventListener('scroll',()=>{mainNav.classList.toggle('scrolled',window.scrollY>60)},{passive:true});

/* ── HAMBURGER MENU ─────────────────────────── */
(function initHamburger(){
  const btn      = document.getElementById('hamburger');
  const drawer   = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  if(!btn||!drawer) return;

  function openDrawer(){
    drawer.classList.add('open');
    backdrop.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeDrawer(){
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    drawer.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  btn.addEventListener('click', ()=> btn.classList.contains('open') ? closeDrawer() : openDrawer());
  backdrop.addEventListener('click', closeDrawer);
  if(closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // close when any drawer link is tapped
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // close on Escape
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeDrawer(); });
})();

/* ── PROJECT VIDEO MODAL ───────────────────── */
(function initProjectVideo(){
  const viewBtn = document.getElementById('view-video-btn');
  const overlay = document.getElementById('video-overlay');
  const closeBtn = document.getElementById('close-video-btn');
  const video = document.getElementById('project-video');
  if(!viewBtn || !overlay || !closeBtn || !video) return;

  function openVideo(event){
    event.preventDefault();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    video.currentTime = 0;
    video.play().catch(()=>{});
  }

  function closeVideo(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    video.pause();
    video.currentTime = 0;
  }

  viewBtn.addEventListener('click', openVideo);
  closeBtn.addEventListener('click', closeVideo);
  overlay.addEventListener('click', event => { if(event.target === overlay) closeVideo(); });
  document.addEventListener('keydown', event => { if(event.key === 'Escape' && overlay.classList.contains('open')) closeVideo(); });
})();

/* ── DARK / LIGHT THEME TOGGLE ──────────────── */
(function initTheme(){
  const html=document.documentElement;
  const themeToggle=document.getElementById('theme-toggle');
  const themeThumb=document.getElementById('theme-thumb');
  const themeLabel=document.getElementById('theme-label');
  let isDark=true;

  themeToggle.addEventListener('click',()=>{
    isDark=!isDark;
    html.setAttribute('data-theme',isDark?'dark':'light');
    themeThumb.textContent=isDark?'🌙':'☀️';
    themeLabel.textContent=isDark?'Dark':'Light';
  });
})();

/* ── HERO ENTRANCE ──────────────────────────── */
gsap.to('.hero-tag',{opacity:1,duration:0.8,delay:0.3,ease:'power3.out'});
gsap.to('.hero-name .word',{y:0,duration:1,ease:'expo.out',stagger:0.12,delay:0.5});
gsap.to('.hero-role',{opacity:1,duration:0.8,delay:1.1,ease:'power3.out'});
gsap.to('.hero-btns',{opacity:1,duration:0.8,delay:1.3,ease:'power3.out'});
gsap.to('#avail-badge',{opacity:1,duration:0.8,delay:1.5,ease:'power3.out'});
gsap.to('#scroll-hint',{opacity:1,duration:0.8,delay:1.8,ease:'power3.out'});

/* ── HERO CANVAS TOGGLE (Studio Dunbar style) ── */
(function initHeroCanvas(){
  const overlay=document.getElementById('hero-canvas-overlay');
  const toggleBtn=document.getElementById('hero-canvas-toggle');
  // These elements only exist in the canvas variant — bail gracefully
  if(!overlay||!toggleBtn) return;
  const togLabel=toggleBtn.querySelector('.tog-label');
  let canvasOn=false;
  let fc=null;
  let history=[];
  let activeColor='#b8f0a0';
  let isTextMode=false;
  let isEraseMode=false;

  function buildCanvas(){
    const wrap=document.querySelector('.hco-canvas-wrap');
    const rawC=document.getElementById('hero-fabric-canvas');
    const W=wrap.clientWidth||window.innerWidth;
    const H=wrap.clientHeight||(window.innerHeight-120);
    rawC.width=W; rawC.height=H;
    fc=new fabric.Canvas('hero-fabric-canvas',{backgroundColor:'#0d0d0d',isDrawingMode:true,width:W,height:H});
    fc.freeDrawingBrush.color=activeColor;
    fc.freeDrawingBrush.width=3;
    fc.freeDrawingBrush.strokeLineCap='round';
    const empty=document.getElementById('hco-empty');
    fc.on('path:created',()=>{
      empty.style.opacity='0';
      history.push(JSON.stringify(fc.toJSON()));
      document.getElementById('hco-status').textContent='// '+fc.getObjects().length+' object(s) drawn';
    });
    fc.on('mouse:down',()=>{
      if(!isTextMode)return;
      const ptr=fc.getPointer(event);
      const t=new fabric.IText('Type here...',{left:ptr.x,top:ptr.y,fontSize:18,fill:activeColor,fontFamily:'DM Mono,monospace',selectable:true});
      fc.add(t); fc.setActiveObject(t); t.enterEditing(); t.selectAll();
      history.push(JSON.stringify(fc.toJSON()));
    });
  }

  function setHcoMode(mode){
    isTextMode=false; isEraseMode=false;
    document.querySelectorAll('.hco-btn').forEach(b=>b.classList.remove('active'));
    if(mode==='draw'){
      fc.isDrawingMode=true;
      fc.freeDrawingBrush=new fabric.PencilBrush(fc);
      fc.freeDrawingBrush.color=activeColor;
      fc.freeDrawingBrush.width=parseInt(document.getElementById('hco-size').value);
      fc.freeDrawingBrush.strokeLineCap='round';
      document.getElementById('hco-draw').classList.add('active');
      document.getElementById('hco-status').textContent='// draw mode';
    } else if(mode==='text'){
      fc.isDrawingMode=false; isTextMode=true;
      document.getElementById('hco-text').classList.add('active');
      document.getElementById('hco-status').textContent='// text mode — click to place';
    } else if(mode==='erase'){
      fc.isDrawingMode=true; isEraseMode=true;
      fc.freeDrawingBrush=new fabric.PencilBrush(fc);
      fc.freeDrawingBrush.color='#0d0d0d';
      fc.freeDrawingBrush.width=parseInt(document.getElementById('hco-size').value)*4;
      document.getElementById('hco-erase').classList.add('active');
      document.getElementById('hco-status').textContent='// eraser mode';
    }
  }

  toggleBtn.addEventListener('click',()=>{
    canvasOn=!canvasOn;
    if(canvasOn){
      overlay.classList.add('visible');
      toggleBtn.classList.add('on');
      togLabel.textContent='Exit Canvas';
      document.body.style.overflow='hidden';
      if(!fc) buildCanvas();
      else fc.renderAll();
    } else {
      overlay.classList.remove('visible');
      toggleBtn.classList.remove('on');
      togLabel.textContent='Canvas';
      document.body.style.overflow='';
    }
  });

  document.getElementById('hco-draw').addEventListener('click',()=>fc&&setHcoMode('draw'));
  document.getElementById('hco-text').addEventListener('click',()=>fc&&setHcoMode('text'));
  document.getElementById('hco-erase').addEventListener('click',()=>fc&&setHcoMode('erase'));

  document.querySelectorAll('.hco-swatch').forEach(sw=>{
    sw.addEventListener('click',()=>{
      activeColor=sw.getAttribute('data-c');
      document.querySelectorAll('.hco-swatch').forEach(s=>s.classList.remove('active'));
      sw.classList.add('active');
      if(fc&&!isEraseMode) fc.freeDrawingBrush.color=activeColor;
    });
  });
  document.getElementById('hco-size').addEventListener('input',function(){
    if(!fc)return;
    const sz=parseInt(this.value);
    fc.freeDrawingBrush.width=isEraseMode?sz*4:sz;
  });
  document.getElementById('hco-undo').addEventListener('click',()=>{
    if(!fc||!history.length)return;
    history.pop();
    if(history.length){fc.loadFromJSON(history[history.length-1],()=>fc.renderAll())}
    else{fc.clear();fc.backgroundColor='#0d0d0d';fc.renderAll();document.getElementById('hco-empty').style.opacity='1';}
    document.getElementById('hco-status').textContent='// undo — '+fc.getObjects().length+' remain';
  });
  document.getElementById('hco-clear').addEventListener('click',()=>{
    if(!fc)return;
    fc.clear();fc.backgroundColor='#0d0d0d';fc.renderAll();
    history=[];document.getElementById('hco-empty').style.opacity='1';
    document.getElementById('hco-status').textContent='// canvas cleared';
  });
  document.getElementById('hco-save').addEventListener('click',()=>{
    if(!fc)return;
    const url=fc.toDataURL({format:'png',multiplier:1});
    const a=document.createElement('a');a.href=url;a.download='rhynelle-canvas.png';a.click();
    document.getElementById('hco-status').textContent='// saved ✓';
  });
})();

/* ── SKILLS ANIMATED PATTERN (canvas hexagons) ── */
(function initSkillsPattern(){
  const canvas=document.getElementById('skills-pattern-canvas');
  const section=document.getElementById('skills');
  function resize(){canvas.width=section.offsetWidth;canvas.height=section.offsetHeight}
  resize();
  window.addEventListener('resize',()=>{resize();buildHexes()});
  const ctx=canvas.getContext('2d');
  const R=32;
  const hexes=[];
  let hoverX=-9999,hoverY=-9999;

  function buildHexes(){
    hexes.length=0;
    const cols=Math.ceil(canvas.width/(R*1.75))+2;
    const rows=Math.ceil(canvas.height/(R*1.52))+2;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        hexes.push({
          x:c*R*1.75+(r%2)*R*0.875,
          y:r*R*1.52,
          phase:Math.random()*Math.PI*2,
          speed:0.25+Math.random()*0.35
        });
      }
    }
  }
  buildHexes();

  section.addEventListener('mousemove',e=>{
    const rect=section.getBoundingClientRect();
    hoverX=e.clientX-rect.left;
    hoverY=e.clientY-rect.top;
  });
  section.addEventListener('mouseleave',()=>{hoverX=-9999;hoverY=-9999});

  function hexPath(cx,cy,r){
    ctx.beginPath();
    for(let i=0;i<6;i++){
      const a=Math.PI/3*i-Math.PI/6;
      i===0?ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
    }
    ctx.closePath();
  }

  let t=0;
  const HOVER_RADIUS=130;
  function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    t+=0.007;
    const isLight=document.documentElement.getAttribute('data-theme')==='light';

    hexes.forEach(h=>{
      const pulse=(Math.sin(t*h.speed+h.phase)+1)/2;
      const dist=Math.hypot(h.x-hoverX,h.y-hoverY);
      const proximity=Math.max(0,1-dist/HOVER_RADIUS);
      const baseAlpha=0.018+pulse*0.022;   // very dim base
      const hoverAlpha=proximity*0.40;     // subtle hover lift
      const alpha=Math.min(1,baseAlpha+hoverAlpha);

      hexPath(h.x,h.y,R-2);
      if(isLight){
        ctx.strokeStyle=`rgba(46,125,50,${alpha})`;
        if(proximity>0.2){ctx.fillStyle=`rgba(46,125,50,${proximity*0.02})`;ctx.fill()}
      } else {
        ctx.strokeStyle=`rgba(184,240,160,${alpha})`;
        if(proximity>0.2){ctx.fillStyle=`rgba(184,240,160,${proximity*0.02})`;ctx.fill()}
      }
      ctx.lineWidth=0.6;
      ctx.stroke();
    });
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── PROJECTS STACKED CARDS ─────────────────── */
(function initStackedCards(){
  const stack   = document.getElementById('proj-stack');
  const stickies = stack ? Array.from(stack.querySelectorAll('.proj-card-sticky')) : [];
  if(!stickies.length) return;

  const CARD_COUNT = stickies.length;
  // Each card gets its own "scroll range" of 1 viewport height
  // so the total scroller height = cards * 100vh
  // (the last card doesn't need a range — it just stays pinned until we scroll past)
  stack.style.height = (CARD_COUNT * 100) + 'vh';

  // Each sticky wrapper is 100vh tall (the sticky height = viewport)
  // We offset each wrapper so they all stack at top:0 within the scroller
  stickies.forEach((s, i) => {
    s.style.height = '100vh';
  });

  // On scroll: for each card compute how far the NEXT card has scrolled into view
  // and apply a slight scale-down + opacity fade to the CURRENT card
  // so it feels like the new card is pushing it away
  function onScroll(){
    const scrollTop = window.scrollY;
    const stackTop  = stack.getBoundingClientRect().top + scrollTop;
    const vh        = window.innerHeight;

    stickies.forEach((sticky, i) => {
      const cardEl = sticky.querySelector('.proj-card');
      // Reset any previously applied transforms — cards stay full opacity/scale
      cardEl.style.transform = '';
      cardEl.style.opacity   = '';
    });
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll(); // init
})();

/* ── PROJECT SLIDESHOWS ──────────────────────── */
(function initSlideshows(){
  document.querySelectorAll('.proj-slideshow').forEach(wrap => {
    const track  = wrap.querySelector('.ss-track');
    const slides = track.querySelectorAll('img');
    const dots   = wrap.querySelectorAll('.ss-dot');
    const prev   = wrap.querySelector('.ss-prev');
    const next   = wrap.querySelector('.ss-next');
    const total  = slides.length;
    let cur = 0;
    let autoTimer;

    wrap.setAttribute('data-total', total);

    function goTo(idx) {
      cur = (idx + total) % total;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(cur + 1), 3500);
    }

    if(prev) prev.addEventListener('click', e => { e.stopPropagation(); goTo(cur - 1); startAuto(); });
    if(next) next.addEventListener('click', e => { e.stopPropagation(); goTo(cur + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); goTo(i); startAuto(); }));

    // auto-advance only while the card is in view
    const sticky = wrap.closest('.proj-card-sticky');
    if(sticky) {
      ScrollTrigger.create({
        trigger: sticky,
        start: 'top top',
        end: 'bottom top',
        onEnter: startAuto,
        onEnterBack: startAuto,
        onLeave: () => clearInterval(autoTimer),
        onLeaveBack: () => clearInterval(autoTimer),
      });
    } else {
      startAuto();
    }
  });
})();

/* ── TIMELINE ───────────────────────────────── */
const tlFill=document.createElement('div');
tlFill.style.cssText='position:absolute;left:0;top:8px;width:1px;height:0;background:var(--accent);z-index:0;opacity:0.4;';
const tl=document.querySelector('.timeline');
if(tl){
  tl.appendChild(tlFill);
  ScrollTrigger.create({trigger:tl,start:'top 70%',onEnter:()=>gsap.to(tlFill,{height:'100%',duration:1.8,ease:'power3.out'})});
  document.querySelectorAll('.timeline-item').forEach((item,i)=>{
    gsap.to(item,{opacity:1,x:0,duration:0.7,delay:i*0.2,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 80%'}});
  });
}

/* ── ACHIEVEMENTS ───────────────────────────── */
document.querySelectorAll('.achievement-card').forEach((card,i)=>{
  gsap.to(card,{opacity:1,y:0,duration:0.6,delay:i*0.1,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 85%'}});
});

/* ── SKILLS PILLS STAGGER ───────────────────── */
ScrollTrigger.create({
  trigger:'#skills',start:'top 70%',
  onEnter:()=>gsap.to('.pill',{opacity:1,y:0,duration:0.5,stagger:{amount:0.9,from:'start'},ease:'power3.out'})
});

/* ── STAT COUNTERS ──────────────────────────── */
ScrollTrigger.create({
  trigger:'.stats-row',start:'top 85%',
  onEnter:()=>{
    gsap.to('.stats-row',{opacity:1,y:0,duration:0.6});
    document.querySelectorAll('[data-count]').forEach(el=>{
      const target=parseInt(el.getAttribute('data-count'));
      let count=0;
      const step=Math.max(1,Math.floor(target/20));
      const timer=setInterval(()=>{count=Math.min(count+step,target);el.textContent=count+(target>10?'+':'');if(count>=target)clearInterval(timer)},60);
    });
  }
});

/* ── CONTACT LINE BACKGROUND ────────────────── */
(function initContactLines(){
  const canvas=document.getElementById('contact-lines-bg');
  const section=document.getElementById('contact');
  if(!canvas||!section) return;
  const ctx=canvas.getContext('2d');
  const SPACING=40;

  function draw(){
    const isLight=document.documentElement.getAttribute('data-theme')==='light';
    canvas.width=section.offsetWidth;
    canvas.height=section.offsetHeight;
    canvas.style.position='absolute';
    canvas.style.inset='0';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // horizontal lines
    ctx.strokeStyle=isLight?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.028)';
    ctx.lineWidth=1;
    for(let y=0;y<canvas.height;y+=SPACING){
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();
    }
    // diagonal lines
    ctx.strokeStyle=isLight?'rgba(42,110,46,0.06)':'rgba(184,240,160,0.018)';
    const diag=canvas.width+canvas.height;
    for(let d=-diag;d<diag;d+=SPACING*2){
      ctx.beginPath();ctx.moveTo(d,0);ctx.lineTo(d+canvas.height,canvas.height);ctx.stroke();
    }
  }

  draw();
  window.addEventListener('resize',draw);

  // redraw when theme toggles
  const themeToggle=document.getElementById('theme-toggle');
  if(themeToggle) themeToggle.addEventListener('click',()=>setTimeout(draw,20));
})();

/* ── GENERIC REVEAL ─────────────────────────── */
document.querySelectorAll('.reveal').forEach(el=>{
  gsap.to(el,{opacity:1,y:0,duration:0.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}});
});

/* ── ACTIVE NAV ON SCROLL ───────────────────── */
const navSections=document.querySelectorAll('section[id]');
ScrollTrigger.create({
  onUpdate:()=>{
    let current='';
    navSections.forEach(s=>{if(s.getBoundingClientRect().top<120)current=s.id});
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.classList.toggle('active',a.getAttribute('href')==='#'+current);
    });
  }
});