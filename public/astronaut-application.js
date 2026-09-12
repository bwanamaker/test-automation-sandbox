const loader = document.querySelector('#mission-loading');
const application = document.querySelector('#application-shell');
const form = document.querySelector('#astronaut-form');
const summary = document.querySelector('#form-summary');
const confirmation = document.querySelector('#application-confirmation');

const previousDelay = Number(sessionStorage.getItem('astronaut-load-delay'));
let loadDelay = 5000 + Math.floor(Math.random() * 10001);
if (loadDelay === previousDelay) loadDelay = loadDelay === 15000 ? 5000 : loadDelay + 1;
sessionStorage.setItem('astronaut-load-delay', String(loadDelay));
loader.dataset.loadDelay = String(loadDelay);

setTimeout(() => {
  loader.hidden = true;
  application.hidden = false;
}, loadDelay);

const messages = {
  'full-name': 'Please give Mission Control your full name.',
  email: 'Enter a valid transmission address, such as pilot@example.com.',
  'birth-date': 'Cadets must be at least 18 Earth years old.',
  'mission-role': 'Choose the role you would like to play aboard.',
  'flight-hours': 'Enter a whole number of flight hours from 0 to 50,000.',
  'emergency-name': 'Tell us whom to contact on the ground.',
  'emergency-phone': 'Enter an emergency telephone with at least seven digits.',
  'mission-statement': 'Your case for space travel needs at least 30 characters.',
  consent: 'You must accept the realities of space before launch.',
};

function setError(input, message) {
  const error = document.querySelector(`#${input.id}-error`);
  input.setCustomValidity(message);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) error.textContent = message;
  return !message;
}

function validateField(input) {
  const value = input.value.trim();
  let message = '';
  input.setCustomValidity('');
  if (input.id === 'full-name' && (!value || value.split(/\s+/).length < 2)) message = messages['full-name'];
  else if (input.id === 'email' && (!value || !input.validity.valid)) message = messages.email;
  else if (input.id === 'birth-date') {
    const birthDate = new Date(`${value}T00:00:00`);
    const age = (Date.now() - birthDate) / 31557600000;
    if (!value || Number.isNaN(birthDate.valueOf()) || age < 18) message = messages['birth-date'];
  } else if (input.id === 'mission-role' && !value) message = messages['mission-role'];
  else if (input.id === 'flight-hours' && (!value || !input.validity.valid)) message = messages['flight-hours'];
  else if (input.id === 'emergency-name' && !value) message = messages['emergency-name'];
  else if (input.id === 'emergency-phone' && (!value || (value.match(/\d/g) || []).length < 7)) message = messages['emergency-phone'];
  else if (input.id === 'mission-statement' && value.length < 30) message = messages['mission-statement'];
  else if (input.id === 'consent' && !input.checked) message = messages.consent;
  return setError(input, message);
}

function validateGroup(name, message) {
  const choices = [...form.querySelectorAll(`[name="${name}"]`)];
  const valid = choices.some(choice => choice.checked);
  const error = document.querySelector(`#${name === 'suitSize' ? 'suit-size' : name}-error`);
  choices.forEach(choice => choice.setAttribute('aria-invalid', String(!valid)));
  if (error) error.textContent = valid ? '' : message;
  return valid;
}

function validateForm() {
  const inputs = [...form.querySelectorAll('#full-name, #email, #birth-date, #mission-role, #flight-hours, #emergency-name, #emergency-phone, #mission-statement, #consent')];
  const fieldsValid = inputs.map(validateField).every(Boolean);
  const suitValid = validateGroup('suitSize', 'Choose the spacesuit size that suits you.');
  const specialtiesValid = validateGroup('specialties', 'Select at least one mission specialty.');
  return fieldsValid && suitValid && specialtiesValid;
}

let attemptedSubmission = false;
form.addEventListener('submit', event => {
  event.preventDefault();
  attemptedSubmission = true;
  if (!validateForm()) {
    summary.hidden = false;
    summary.textContent = 'Mission Control needs a few corrections before this application can launch.';
    summary.focus();
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  summary.hidden = true;
  document.querySelector('#confirmation-message').textContent = `Thank you, ${document.querySelector('#full-name').value.trim()}. Your file is safely aboard the Starward Bureau intake rocket.`;
  form.hidden = true;
  confirmation.hidden = false;
  confirmation.focus();
});

form.addEventListener('input', event => {
  if (attemptedSubmission && event.target.matches('input, textarea, select')) validateField(event.target);
});
form.addEventListener('change', event => {
  if (!attemptedSubmission) return;
  if (event.target.name === 'suitSize') validateGroup('suitSize', 'Choose the spacesuit size that suits you.');
  if (event.target.name === 'specialties') validateGroup('specialties', 'Select at least one mission specialty.');
});
form.addEventListener('reset', () => {
  attemptedSubmission = false;
  summary.hidden = true;
  form.querySelectorAll('.field-error').forEach(error => error.textContent = '');
  form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
});

document.querySelector('#return-to-earth').addEventListener('click', () => {
  form.reset();
  window.location.reload();
});
