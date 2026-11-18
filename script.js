const screens = {
  'rota-1': { intro: document.querySelector('#intro-route-1'), detail: document.querySelector('#detail-route-1') },
  'rota-2': { intro: document.querySelector('#intro-route-2'), detail: document.querySelector('#detail-route-2') },
};

let route = 'rota-1';
let transitioning = false;

function getRoute() {
  const requested = location.hash.replace('#', '').toLowerCase();
  return screens[requested] ? requested : 'rota-1';
}

function showIntro(nextRoute = getRoute()) {
  route = nextRoute;
  Object.values(screens).forEach(({ intro, detail }) => {
    intro.classList.remove('screen--active', 'is-exiting');
    detail.classList.remove('screen--active', 'is-entering');
  });
  screens[route].intro.classList.add('screen--active');
}

function openInvitation() {
  if (transitioning) return;
  transitioning = true;
  const current = screens[route];
  const detail = current.detail;
  current.intro.classList.add('is-exiting');
  window.setTimeout(() => {
    current.intro.classList.remove('screen--active', 'is-exiting');
    detail.classList.add('screen--active', 'is-entering');
    window.setTimeout(() => detail.classList.remove('is-entering'), 900);
    transitioning = false;
  }, 520);
}

document.querySelectorAll('.screen-hit-area').forEach((button) => button.addEventListener('click', openInvitation));
showIntro();
window.addEventListener('hashchange', () => showIntro());
