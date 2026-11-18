// Chaitanya Hospital – site scripts

const HOSPITAL_WHATSAPP = '917507077608'; // TODO: confirm this number is on WhatsApp

// ----- Mobile navigation -----
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

function setNav(open) {
  nav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navToggle.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
}

navToggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// ----- Footer year -----
document.getElementById('year').textContent = new Date().getFullYear();

// ----- Appointment form -> WhatsApp -----
const form = document.getElementById('appointmentForm');
if (form) initAppointmentForm(form);

function initAppointmentForm(form) {
  const errorBox = document.getElementById('formError');
  const dateInput = form.elements.date;

  const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  dateInput.min = toISO(new Date());

  function showError(message, field) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    if (field) {
      field.classList.add('invalid');
      field.focus();
    }
  }

  form.addEventListener('input', (e) => {
    e.target.classList.remove('invalid');
    errorBox.hidden = true;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { name, phone, date, session, message } = form.elements;
    const digits = phone.value.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');

    if (name.value.trim().length < 2) return showError('Please enter your full name.', name);
    if (!/^[6-9]\d{9}$/.test(digits)) return showError('Please enter a valid 10-digit mobile number.', phone);
    if (!date.value) return showError('Please choose a preferred date.', date);
    if (date.value < dateInput.min) return showError('Please choose today or a future date.', date);

    const prettyDate = new Date(`${date.value}T00:00`).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });

    const lines = [
      'Hello, I would like to book an appointment at Chaitanya Hospital.',
      '',
      `Name: ${name.value.trim()}`,
      `Mobile: ${digits}`,
      `Preferred date: ${prettyDate}`,
      session.value ? `Preferred time: ${session.value}` : null,
      message.value.trim() ? `Reason: ${message.value.trim()}` : null,
    ].filter((line) => line !== null);

    const url = `https://wa.me/${HOSPITAL_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
}
