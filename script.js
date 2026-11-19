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

function addCalendarReminder() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = 'evento.ics';
    return;
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sannessa e Angelo//Save the Date//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:sannessa-angelo-2027-08-16@save-the-date',
    'DTSTAMP:20261118T120000Z',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'DTSTART;VALUE=DATE:20270816',
    'DTEND;VALUE=DATE:20270817',
    'SUMMARY:Casamento Sannessa e Angelo',
    'LOCATION:Casa do Valle\\, Chapada dos Guimarães - MT',
    'DESCRIPTION:Save the Date — Sannessa e Angelo',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const file = typeof File === 'function'
    ? new File([blob], 'sannessa-e-angelo.ics', { type: 'text/calendar;charset=utf-8' })
    : null;

  if (file && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: 'Casamento Sannessa e Angelo',
      text: 'Adicionar o casamento à agenda',
    }).catch(() => {});
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sannessa-e-angelo.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

document.querySelectorAll('.calendar-button').forEach((button) => {
  button.addEventListener('click', addCalendarReminder);
});

showIntro();
window.addEventListener('hashchange', () => showIntro());
