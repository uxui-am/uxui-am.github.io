// Mobile burger menu (<=820px): replaces the header tools (All projects, Get in touch, CV, language) on phones.
(function(){
  var tools=document.querySelector('.hero-utilities')||document.querySelector('.tools');
  if(!tools||document.querySelector('.mm-btn'))return;
  var isCase=!tools.classList.contains('hero-utilities');
  var projectsHref=isCase?'../#work':'#work';
  var cv=tools.querySelector('a.hero-cv2, a.cv');
  var langs=tools.querySelector('nav.hl2');
  var ink=cv?getComputedStyle(cv).color:'#fff';

  tools.classList.add('mm-hide-mobile');

  var btn=document.createElement('button');
  btn.type='button';btn.className='mm-btn';btn.style.color=ink;
  btn.setAttribute('aria-label','Menu');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','mm-panel');
  btn.innerHTML='<i></i><i></i><i></i>';
  tools.parentNode.insertBefore(btn,tools.nextSibling);

  var panel=document.createElement('div');
  panel.className='mm-panel';panel.id='mm-panel';
  var logoSrc=(isCase?'../':'')+'img/am-logo-mobile-white.svg';
  var cur=langs&&langs.querySelector('a.on');
  var html='<div class="mm-top"><div class="mm-left">'+
    (cv?'<a class="mm-cv" href="'+cv.getAttribute('href')+'" target="_blank" rel="noopener">CV <span class="mm-cv-arrow" aria-hidden="true">&#8595;</span></a>':'')+
    '<div class="mm-langslot"></div></div><button type="button" class="mm-close" aria-label="Close menu"><i></i><i></i></button>';
  var AR=' <span class="mm-arrow" aria-hidden="true">&#8599;</span>';
  if(isCase){
    html+='</div><nav aria-label="Site menu"><ul>'+
      '<li><a class="mm-item" href="'+projectsHref+'">All projects'+AR+'</a></li>'+
      '</ul>';
  }else{
    // Home: every section of the page, named exactly as its heading.
    var homeSecs=[].slice.call(document.querySelectorAll('main section[id], body > section[id], section[id]')).filter(function(x,i,a){return a.indexOf(x)===i&&x.querySelector('h2')});
    html+='</div><nav aria-label="Site menu"><ul>'+homeSecs.map(function(sec){var hh=sec.querySelector('h2'),t=(hh.getAttribute('aria-label')||hh.textContent).replace(/\s+/g,' ').trim();
      return '<li><a class="mm-item mm-home-sec" href="#'+sec.id+'">'+t+AR+'</a></li>'}).join('')+'</ul>'+
      '<a class="mm-item mm-top-link mm-home-top" href="#top">Back to top <span class="mm-arrow" aria-hidden="true">&#8593;</span></a>';
  }
  if(isCase){
    var secs=[].slice.call(document.querySelectorAll('.case-section[id]'));
    if(secs.length){
      html+='<button type="button" class="mm-item mm-acc" aria-expanded="false" aria-controls="mm-secs">Case contents <span class="mm-arrow" aria-hidden="true">&#8595;</span></button>'+
        '<ul class="mm-secs" id="mm-secs">'+secs.map(function(sec,i){var h=sec.querySelector('h2');var t=h?(h.getAttribute('aria-label')||h.textContent).replace(/\s+/g,' ').trim():sec.id;
        return '<li><a class="mm-item mm-sec" href="#'+sec.id+'"><span class="mm-num">0'+(i+1)+'</span>'+t+'</a></li>'}).join('')+'</ul>'+
        '<a class="mm-item mm-contact" href="#contact">Get in touch'+AR+'</a>'+
        '<a class="mm-item mm-top-link" href="#top">Back to top <span class="mm-arrow" aria-hidden="true">&#8593;</span></a>';
    }
  }
  html+='</nav>';
  panel.innerHTML=html;
  document.body.appendChild(panel);
  var scrim=document.createElement('div');scrim.className='mm-scrim';scrim.setAttribute('aria-hidden','true');document.body.insertBefore(scrim,panel);

  var root=document.documentElement,btns=[btn],trigger=btn;

  // Home page: fixed bar (logo left, burger right) that appears once the hero header scrolls away.
  {
    var top=isCase?tools.parentNode:document.querySelector('.hero-top');var pre=isCase?'../':'';
    var bar=document.createElement('div');bar.className='mm-bar';
    bar.innerHTML='<a class="mm-bar-logo" href="'+(isCase?'../':'#')+'" aria-label="'+(isCase?'Home':'Back to top')+'"><img src="'+pre+'img/am-logo-mobile.svg" width="40" height="40" alt=""></a>';
    var btn2=btn.cloneNode(true);btn2.style.color='#101114';btn2.removeAttribute('id');bar.appendChild(btn2);btns.push(btn2);
    document.body.appendChild(bar);
    if(!isCase)bar.querySelector('.mm-bar-logo').addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});
    var limit=function(){return top?top.getBoundingClientRect().bottom+window.scrollY:80};
    var barImg=bar.querySelector('img'),lastDark=null,tick=false;
    // Match the bar to the section it currently sits over: dark bar on dark blocks, white bar on light ones.
    var bgUnder=function(){var el=document.elementFromPoint(innerWidth/2,bar.offsetHeight+2);if(!el)return 255;
      // Use the section's own background: the outermost filled layer inside the section, ignoring photos/cards nested deeper.
      var lum=function(n){var c=getComputedStyle(n).backgroundColor,m=c.match(/[\d.]+/g);return m&&(m.length<4||+m[3]>0.5)?(+m[0]*299+ +m[1]*587+ +m[2]*114)/1000:null};
      var sec=el.closest('section, footer, header, .hero, .case-section, .contact'),best=null,n=el;
      if(sec){while(n&&n!==sec.parentElement){var l=lum(n);if(l!==null&&n.tagName!=='IMG'&&n.tagName!=='VIDEO'&&n.tagName!=='PICTURE')best=l;n=n.parentElement}if(best!==null){var own=lum(sec);return own!==null?own:best}}
      n=sec?sec.parentElement:el;while(n&&n!==document.documentElement){var l2=lum(n);if(l2!==null)return l2;n=n.parentElement}return 255};
    var paint=function(){tick=false;var dark=bgUnder()<110;if(dark===lastDark)return;lastDark=dark;
      bar.classList.toggle('is-dark',dark);btn2.style.color=dark?'#fff':'#101114';barImg.src=pre+(dark?'img/am-logo-mobile-white.svg':'img/am-logo-mobile.svg')};
    var onScroll=function(){root.classList.toggle('mm-bar-on',window.scrollY>limit());if(!tick){tick=true;requestAnimationFrame(paint)}};
    addEventListener('scroll',onScroll,{passive:true});onScroll();
  }

  // Hide the fixed bars while scrolling down, show them again on scroll up.
  var lastY=window.scrollY;
  addEventListener('scroll',function(){var y=window.scrollY,d=y-lastY;if(Math.abs(d)<6)return;
    if(!root.classList.contains('mm-open')){if(d>0&&y>120)root.setAttribute('data-mm-down','');else root.removeAttribute('data-mm-down')}lastY=y},{passive:true});

  function setOpen(open,from){
    if(open){trigger=from||trigger;placeLang(true);markSection()}else{setLang();placeLang(false);if(acc){acc.setAttribute('aria-expanded','false');panel.classList.remove('mm-acc-open')}}
    root.classList.toggle('mm-open',open);root.classList.toggle('mm-lock',open);
    btns.forEach(function(b){b.setAttribute('aria-expanded',open?'true':'false');b.setAttribute('aria-label',open?'Close menu':'Menu')});
    if(open){close.focus({preventScroll:true})}else{trigger.focus({preventScroll:true})}
  }
  btns.forEach(function(b){b.addEventListener('click',function(){setOpen(!root.classList.contains('mm-open'),b)})});
  scrim.addEventListener('click',function(){setOpen(false)});
  // Scroll so the section's top edge sits at the top of the screen; correct afterwards because lazy images above can shift the page.
  function goTo(t){
    var smooth=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    var y=function(){return Math.round(t.getBoundingClientRect().top+window.scrollY)};
    window.scrollTo({top:y(),behavior:smooth?'smooth':'auto'});
    var fix=function(){if(Math.abs(t.getBoundingClientRect().top)>2)window.scrollTo({top:y(),behavior:'auto'})};
    var done=false,once=function(){if(done)return;done=true;fix();setTimeout(fix,400);setTimeout(fix,1000)};
    if('onscrollend' in window)window.addEventListener('scrollend',once,{once:true});
    setTimeout(once,smooth?1400:50);
  }
  function markSection(){var links=panel.querySelectorAll('.mm-sec, .mm-home-sec');if(!links.length)return;var cur=null;
    [].forEach.call(links,function(a){var t=document.querySelector(a.getAttribute('href'));if(t&&t.getBoundingClientRect().top<=140)cur=a});
    [].forEach.call(links,function(a){if(a===cur)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
  var close=panel.querySelector('.mm-close'),slot=panel.querySelector('.mm-langslot'),home=langs&&langs.parentNode,next=langs&&langs.nextSibling,lw=null;
  // The real desktop language picker is moved into the menu while it is open, so it keeps its look and behaviour.
  function setLang(){if(langs)langs.classList.remove('open')}
  function placeLang(inMenu){if(!langs)return;if(inMenu)slot.appendChild(langs);else home.insertBefore(langs,next)}
  close.addEventListener('click',function(){setOpen(false)});
  var acc=panel.querySelector('.mm-acc');
  if(acc)acc.addEventListener('click',function(){var o=acc.getAttribute('aria-expanded')!=='true';acc.setAttribute('aria-expanded',o?'true':'false');panel.classList.toggle('mm-acc-open',o)});
  window.addEventListener('click',function(e){if(!panel.contains(e.target))return;
    var a=e.target.closest('a');if(!a||a.getAttribute('aria-disabled')==='true'||a.closest('.hl2'))return;if(a.getAttribute('href')==='#'){e.preventDefault();if(a.classList.contains('mm-logo')){setOpen(false);window.scrollTo({top:0,behavior:'smooth'})}return}
    var href=a.getAttribute('href');
    if(href.charAt(0)==='#'){
      e.preventDefault();setOpen(false);
      var t=href==='#top'?null:document.querySelector(href);if(href==='#top'){requestAnimationFrame(function(){window.scrollTo({top:0,behavior:'smooth'})});return}
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        if(t){goTo(t);history.replaceState(null,'',href)}
      })});
    }else{setOpen(false)}
  },true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('mm-open')){if(langs&&langs.classList.contains('open'))setLang();else setOpen(false)}});
  matchMedia('(min-width:821px)').addEventListener('change',function(m){if(m.matches)setOpen(false)});
})();
