const intro = document.querySelector('#intro');
const details = {
  'rota-1': document.querySelector('#detail-route-1'),
  'rota-2': document.querySelector('#detail-route-2'),
  'rota-3': document.querySelector('#detail-route-3'),
};
let transitioning = false;

function currentRoute() {
  const route = location.hash.replace('#', '');
  return details[route] ? route : 'rota-1';
}

function activateRouteFromHash() {
  intro.classList.add('screen--active');
  Object.values(details).forEach((detail) => {
    detail.classList.remove('screen--active', 'is-entering', 'is-exiting');
  });
}

function openDetail() {
  if (transitioning) return;
  transitioning = true;
  const detail = details[currentRoute()];
  intro.classList.add('is-exiting');
  window.setTimeout(() => {
    intro.classList.remove('screen--active', 'is-exiting');
    detail.classList.add('screen--active');
    detail.classList.add('is-entering');
    window.setTimeout(() => detail.classList.remove('is-entering'), 1100);
    transitioning = false;
  }, 560);
}

intro.addEventListener('click', openDetail);
intro.addEventListener('touchend', (event) => {
  event.preventDefault();
  openDetail();
}, { passive: false });

activateRouteFromHash();
window.addEventListener('hashchange', () => window.location.reload());

function addCalendarReminder() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = 'evento.ics';
    return;
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tauany e Gabriel//Save the Date//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:tauany-gabriel-2027-11-20@save-the-date',
    'DTSTAMP:20261115T120000Z',
    'DTSTART;VALUE=DATE:20271120',
    'DTEND;VALUE=DATE:20271121',
    'SUMMARY:Casamento Tauany e Gabriel',
    'LOCATION:Saint Jardim Eventos\\, Araçoiaba da Serra - SP',
    'DESCRIPTION:Save the Date — Tauany e Gabriel',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tauany-e-gabriel.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

document.querySelectorAll('.calendar-button').forEach((button) => {
  button.addEventListener('click', addCalendarReminder);
});
