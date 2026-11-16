// A presentation of the actual Figma page, inside the laptop display.
const pageDocument = document.querySelector('#screen-document');
const reducedScroll = matchMedia('(prefers-reduced-motion: reduce)');
let previewVisible = window.parent === window;
let previewReady = false;
let previousFrame = null;
let phase = 'hero';
let phaseTime = 0;
let position = 0;
let startPosition = 0;
let destination = 0;
let stepIndex = 0;
let movementDuration = 1;
let pauseDuration = 0;
let maxPosition = 0;
let facultyTop = 0;
const facultyTrack = document.querySelector(".faculty-track");
let revealBands = [];
let revealCards = [];
function revealContent(){for(const band of [...revealBands,...revealCards])if(band.top < position + 860)band.element.classList.add("is-revealed");}

function beginScrollStep() {
  startPosition = position;
  const distance = [980, 1200, 850, 1100, 1320, 920][stepIndex % 6];
  destination = Math.min(maxPosition, position + distance);
  movementDuration = 1.0 + (stepIndex % 3) * .1;
  phase = 'moving';
  phaseTime = 0;
  stepIndex++;
}

function renderScrollFrame(now) {
  const elapsed = previousFrame === null ? 0 : Math.min((now - previousFrame) / 1000, .08);
  previousFrame = now;
  if (previewReady && previewVisible && !document.hidden && !reducedScroll.matches) {
    if(phase === "hero")document.querySelector(".hero").classList.add("is-text-visible");
    phaseTime += elapsed;
    if (phase === 'hero' && phaseTime >= 3) beginScrollStep();
    else if (phase === 'moving') {
      const progress = Math.min(1, phaseTime / movementDuration);
      const eased = progress * progress * (3 - 2 * progress);
      position = startPosition + (destination - startPosition) * eased;
      if (progress === 1) {
        phase = position >= maxPosition ? 'bottom' : 'pause';
        pauseDuration = stepIndex % 4 === 0 ? 1.1 : .55 + (stepIndex % 3) * .12;
        phaseTime = 0;
      }
    } else if (phase === 'pause' && phaseTime >= pauseDuration) beginScrollStep();
    // Hold the footer, then fade back to the hero for the next presentation.
    else if (phase === 'bottom' && phaseTime >= 4) {
      phase = 'reset';
      phaseTime = 0;
    } else if (phase === 'reset') {
      pageDocument.style.opacity = String(Math.max(0, 1 - phaseTime / .3));
      if (phaseTime >= .3) {
        position = 0;
        document.querySelector(".hero").classList.remove("is-text-visible");
        stepIndex = 0;
        for(const band of [...revealBands,...revealCards])band.element.classList.remove("is-revealed");
        phase = 'return';
        phaseTime = 0;
      }
    } else if (phase === 'return') {
      pageDocument.style.opacity = String(Math.min(1, phaseTime / .3));
      if (phaseTime >= .3) {
        phase = 'hero';
        phaseTime = 0;
      }
    }
    revealContent();
    pageDocument.style.transform = `translate3d(0,${-position}px,0)`;
  }
  if(facultyTrack)facultyTrack.style.animationPlayState=previewReady&&previewVisible&&!document.hidden&&!reducedScroll.matches&&facultyTop<position+1103&&facultyTop+700>position?"running":"paused";
  requestAnimationFrame(renderScrollFrame);
}

window.addEventListener('message', event => {
  if (event.source !== window.parent || event.origin !== location.origin) return;
  if (event.data?.type === 'hoss-preview-visibility') {
    previewVisible = Boolean(event.data.active);
    previousFrame = null;
  }
});
document.addEventListener('visibilitychange', () => { previousFrame = null; });
reducedScroll.addEventListener('change', () => {
  position = 0;
  phase = 'hero';
  phaseTime = 0;
  pageDocument.style.transform = 'translate3d(0,0,0)';
  pageDocument.style.opacity = '1';
});

Promise.all([
  document.fonts.ready,
  ...[...document.querySelectorAll('.page-continuation img')].map(img => img.decode())
]).then(() => {
  maxPosition = Math.max(0, pageDocument.scrollHeight - 1103);
  const canvasScale = document.querySelector('#screen-canvas').getBoundingClientRect().width / 1920;
  const documentTop = pageDocument.getBoundingClientRect().top;
  revealBands = [...document.querySelectorAll('.reveal-band')].map(element=>({element,top:(element.getBoundingClientRect().top-documentTop)/canvasScale}));
  revealCards = [...document.querySelectorAll('.reveal-card')].map(element=>({element,top:(element.getBoundingClientRect().top-documentTop)/canvasScale}));
  facultyTop=(document.querySelector(".faculty-marquee").getBoundingClientRect().top-documentTop)/canvasScale;
  previewReady = true;
  previousFrame = null;
}).catch(error => {
  // Keep the animated hero visible if a page asset cannot be loaded.
  console.error('The website preview could not load all sections.', error);
});
requestAnimationFrame(renderScrollFrame);
