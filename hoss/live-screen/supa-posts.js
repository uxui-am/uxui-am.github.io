const A='assets/dual-phone/',fan=document.querySelector('.fan'),frame=document.querySelector('.scene-fit'),space=document.querySelector('.social-space'),world=document.querySelector('.social-world');
const posts=[
 {user:'weekend.diary',avatar:'ef66d.png',cover:'47d2a.png',copy:'Slow mornings, fresh pages.'},
 {user:'stay.and.wander',avatar:'4747b.png',cover:'73d01.png',copy:'Checking in, switching off.'},
 {user:'coffee.moments',avatar:'b0c9f.png',cover:'9759a.png',copy:'Good coffee. Better company.'},
 {user:'morning.escapes',avatar:'d7609.png',cover:'26f2a.png',copy:'A slow start, a sea breeze.'},
 {user:'poolside.moments',avatar:'20f9f.png',cover:'b9bc3.png',copy:'A little escape from the everyday.'}
];
world.innerHTML='<div class="fan-shade"></div>'+posts.map(p=>`<article class="supa-post" aria-label="${p.user}"><header class="post-header"><img src="${A+p.avatar}" alt=""><strong>${p.user}</strong><span class="dots">•••</span></header><div class="supa-photo">${p.cover?`<img class="cover" src="${(window.HOSS_MOBILE_PREVIEW?'assets/mobile/'+p.cover.replace('.png','.webp'):A+p.cover)}" alt="${p.copy}">`:p.layers.map(([src,w,h,x,y])=>`<img src="${A+src}" alt="" style="width:${w}%;height:${h}%;left:${x}%;top:${y}%">`).join('')}</div><div class="post-actions">${['0a112.svg','6ab66.svg','17af9.svg','440b9.svg'].map(src=>`<img src="${A+src}" alt="">`).join('')}</div><p class="post-copy">${p.copy}</p></article>`).join('');
const cards=[...world.querySelectorAll('.supa-post')],slots=[{x:0,y:0,z:8,r:0,s:1},{x:38,y:-17,z:4,r:9.56,s:.9},{x:82,y:-23,z:0,r:14.38,s:.8},{x:-82,y:-23,z:0,r:-14.38,s:.8},{x:-38,y:-17,z:4,r:-9.56,s:.9}],reduced=matchMedia('(prefers-reduced-motion:reduce)'),play=document.querySelector('#autoplay'),scrub=document.querySelector('#scrub');
let time=0,last=null,playing=!reduced.matches,previewActive=window.parent===window;
window.addEventListener('message',event=>{if(event.source===window.parent&&event.origin===location.origin&&event.data?.type==='hoss-preview-visibility'){previewActive=Boolean(event.data.active);last=null}});
const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};const mix=(a,b,t)=>a+(b-a)*t;
function fit(){const s=Math.min(frame.clientWidth/840,frame.clientHeight/620)*1.375;space.style.transform=`translate(${(frame.clientWidth-840*s)/2}px,${(frame.clientHeight-620*s)/2}px) scale(${s})`}
function draw(){const t=((time%9)+9)%9,step=Math.floor(t/1.8),p=ease((t%1.8-1.1)/.65);cards.forEach((card,i)=>{const rank=(i-step+5)%5,a=slots[rank],b=slots[(rank+4)%5],behind=rank===3,arc=behind?Math.sin(p*Math.PI):0;const x=mix(a.x,b.x,p),y=mix(a.y,b.y,p)+arc*8,z=mix(a.z,b.z,p)-arc*16,r=mix(a.r,b.r,p);card.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateZ(${r}deg) scale(${mix(a.s,b.s,p)})`;card.style.zIndex=String(Math.round(200+z*10));});scrub.value=String(t)}
function sync(){play.textContent=playing?'Пауза':'Продолжить';play.setAttribute('aria-pressed',String(!playing))}
function tick(now){const dt=last===null?0:Math.min((now-last)/1000,.06);last=now;if(playing&&previewActive&&!document.hidden){time+=dt;draw()}requestAnimationFrame(tick)}
new ResizeObserver(fit).observe(frame);play.onclick=()=>{playing=!playing;sync()};document.querySelector('#replay').onclick=()=>{time=0;playing=!reduced.matches;sync();draw()};scrub.oninput=()=>{time=Number(scrub.value);playing=false;sync();draw()};document.querySelector('#view').onclick=()=>{document.body.classList.toggle('focus-mode');document.querySelector('#view').textContent=document.body.classList.contains('focus-mode')?'На hero':'Только композиция';window.dispatchEvent(new Event('resize'));fit()};
const video=document.querySelector('.background'),motion=document.querySelector('#motion');let backgroundPaused=reduced.matches;function syncVideo(){if(backgroundPaused||document.hidden)video.pause();else Promise.resolve();motion.textContent=backgroundPaused?'Продолжить фон':'Пауза фона'}motion.onclick=()=>{backgroundPaused=!backgroundPaused;syncVideo()};document.addEventListener('visibilitychange',()=>{last=null;syncVideo()});reduced.addEventListener('change',()=>{playing=!reduced.matches;sync()});
document.querySelector('.facts').innerHTML=['12 years leading social for the world’s biggest hotel brands','Former Director of Global Social Marketing, IHG','Built Kimpton’s award-winning social from zero','Multiple industry award-winner & strategist'].map(text=>`<div class="fact"><div class="check"><img src="assets/caf24.svg" width="14" height="14" alt=""></div><div>${text}</div></div>`).join('');fit();sync();syncVideo();draw();requestAnimationFrame(tick);





