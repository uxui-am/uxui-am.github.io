const projectMenu = document.querySelector('.case-project-menu');
const projectPanel = document.querySelector('.case-project-panel');
const contactLink = document.querySelector('.case-contact-link');
const contactSection = document.getElementById('contact');
const homepage = new URL('../', location.href);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let loadingProjects;
let scrollFrame;

async function loadProjects() {
  const response = await fetch(homepage);
  if (!response.ok) throw new Error('Latest projects unavailable');
  const page = new DOMParser().parseFromString(await response.text(), 'text/html');
  const projects = page.querySelector('#work .cases');
  if (!projects) throw new Error('Latest projects missing');
  projects.querySelectorAll('.case--extra').forEach(card => card.remove());
  projects.querySelectorAll('[src], [poster], [href]').forEach(element => {
    for (const name of ['src', 'poster', 'href']) {
      const value = element.getAttribute(name);
      if (!value) continue;
      const cardId = element.closest('article')?.id;
      element.setAttribute(name, new URL(value === '#' ? (cardId ? '#' + cardId : '#work') : value, homepage));
    }
  });
  projects.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  projectPanel.replaceChildren(projects);
}

function syncVideos() {
  projectPanel.querySelectorAll('video').forEach(video => {
    if (projectMenu.open && !reducedMotion.matches) {
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

projectMenu.addEventListener('toggle', () => {
  if (projectMenu.open && !loadingProjects) {
    loadingProjects = loadProjects().then(syncVideos).catch(() => { loadingProjects = null; });
  }
  syncVideos();
});

document.addEventListener('click', event => {
  if (!projectMenu.contains(event.target)) projectMenu.open = false;
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && projectMenu.open) {
    projectMenu.open = false;
    projectMenu.querySelector('summary').focus();
  }
});

contactLink.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  projectMenu.open = false;
  cancelAnimationFrame(scrollFrame);
  if (location.hash !== '#contact') history.pushState(null, '', '#contact');
  const start = scrollY;
  const target = start + contactSection.getBoundingClientRect().top;
  if (reducedMotion.matches) {
    scrollTo({top: target, behavior: 'instant'});
    return;
  }
  const started = performance.now();
  function glide(now) {
    const t = Math.min(1, (now - started) / 700);
    const progress = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    scrollTo({top: start + (target - start) * progress, behavior: 'instant'});
    if (t < 1) scrollFrame = requestAnimationFrame(glide);
  }
  scrollFrame = requestAnimationFrame(glide);
});

for (const event of ['wheel', 'touchstart', 'keydown']) {
  addEventListener(event, () => cancelAnimationFrame(scrollFrame), {passive: true});
}
