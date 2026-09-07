const form = document.querySelector<HTMLFormElement>('#email-signup');
const email = document.querySelector<HTMLInputElement>('#email');
const signupModal = document.querySelector<HTMLDialogElement>('#signup-modal');
const title = document.querySelector<HTMLElement>('#modal-title');
const message = document.querySelector<HTMLElement>('#modal-message');
const closeSignup = document.querySelector<HTMLButtonElement>('#close-modal');

if (form && email && signupModal && title && message && closeSignup) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = email.checkValidity();
    title.textContent = valid ? 'Subscription confirmed' : 'Subscription not confirmed';
    message.textContent = valid ? 'Thank you. Your workshop notes are on their way.' : 'Enter an email address in the format you@example.com.';
    signupModal.showModal();
    if (valid) form.reset();
  });
  closeSignup.addEventListener('click', () => signupModal.close());
}

const addToBasket = document.querySelector<HTMLButtonElement>('.product-form button[type="button"]');

if (addToBasket) {
  const modal = document.createElement('dialog');
  modal.innerHTML = '<button class="modal-close" aria-label="Close confirmation" type="button">X</button><h2>Added to basket</h2><p>Your bicycle has been added to the basket.</p>';
  document.body.append(modal);
  const close = modal.querySelector<HTMLButtonElement>('.modal-close');
  let timeout: ReturnType<typeof setTimeout>;
  const closeModal = () => modal.close();
  if (close) {
    addToBasket.addEventListener('click', () => {
      clearTimeout(timeout);
      modal.showModal();
      timeout = setTimeout(closeModal, 5000);
    });
    close.addEventListener('click', closeModal);
    modal.addEventListener('close', () => clearTimeout(timeout));
  }
}
