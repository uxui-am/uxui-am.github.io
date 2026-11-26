// Desktop (>820px) fixed case bar: sections collapse into one dropdown with the current section,
// and All projects / Get in touch stay available on the right, as in the top case header.
(function(){
  var fh=document.querySelector('.fixed-header');if(!fh)return;
  var nav=fh.querySelector('nav.sections-nav'),tools=fh.querySelector('.tools'),back=fh.querySelector('.back');
  if(!nav||!tools)return;
  var links=[].slice.call(nav.querySelectorAll('a[href^="#"]'));if(!links.length)return;

  // Sections dropdown
  var box=document.createElement('div');box.className='fh-sec';
  box.innerHTML='<button type="button" class="fh-sec-btn" aria-expanded="false" aria-controls="fh-sec-list"><span class="fh-sec-label"></span><span class="fh-sec-arrow" aria-hidden="true">&#8595;</span></button><div class="fh-sec-list" id="fh-sec-list"></div>';
  var list=box.querySelector('.fh-sec-list'),btn=box.querySelector('.fh-sec-btn'),label=box.querySelector('.fh-sec-label');
  links.forEach(function(a){var c=document.createElement('a');c.href=a.getAttribute('href');c.innerHTML=a.querySelector('.nav-label')?a.querySelector('.nav-label').innerHTML:a.innerHTML;list.appendChild(c)});
  (back&&back.nextSibling?fh.insertBefore(box,back.nextSibling):fh.appendChild(box));
  fh.classList.add('fh-compact');

  function setOpen(o){box.classList.toggle('is-open',o);btn.setAttribute('aria-expanded',o?'true':'false')}
  btn.addEventListener('click',function(e){e.stopPropagation();setOpen(!box.classList.contains('is-open'))});
  list.addEventListener('click',function(e){if(e.target.closest('a'))setOpen(false)});
  document.addEventListener('click',function(e){if(!box.contains(e.target))setOpen(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('is-open')){setOpen(false);btn.focus()}});

  // Keep the label in sync with the section the page script marks as current.
  function sync(){var cur=nav.querySelector('a[aria-current="location"]')||links[0];
    label.innerHTML=cur.querySelector('.nav-label')?cur.querySelector('.nav-label').innerHTML:cur.textContent;
    [].forEach.call(list.querySelectorAll('a'),function(c){if(c.getAttribute('href')===cur.getAttribute('href'))c.setAttribute('aria-current','location');else c.removeAttribute('aria-current')})}
  sync();new MutationObserver(sync).observe(nav,{subtree:true,attributes:true,attributeFilter:['aria-current']});

  // All projects (with its mega menu) + Get in touch: the very same elements as in the top header,
  // moved into the fixed bar while it is shown, so they look and behave exactly the same.
  var topTools=document.querySelector('.hero .top .tools');
  var pm=topTools&&topTools.querySelector('.case-project-menu'),cl=topTools&&topTools.querySelector('.case-contact-link');
  if(pm&&cl){
    var anchor=document.createComment('case-tools'),cv=tools.querySelector('.cv'),inFixed=false;
    topTools.insertBefore(anchor,pm);
    var place=function(){var show=fh.classList.contains('is-visible')&&matchMedia('(min-width:821px)').matches;if(show===inFixed)return;inFixed=show;pm.open=false;
      if(show){tools.insertBefore(pm,cv);tools.insertBefore(cl,cv)}else{anchor.parentNode.insertBefore(cl,anchor.nextSibling);anchor.parentNode.insertBefore(pm,anchor.nextSibling)}};
    new MutationObserver(place).observe(fh,{attributes:true,attributeFilter:['class']});place();
  }
})();
