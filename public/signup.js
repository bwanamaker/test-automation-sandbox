const form = document.querySelector('#email-signup');

if (form) {
  const email = document.querySelector('#email');
  const modal = document.querySelector('#signup-modal');
  const title = document.querySelector('#modal-title');
  const message = document.querySelector('#modal-message');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = email.checkValidity();
    title.textContent = valid ? 'Subscription confirmed' : 'Subscription not confirmed';
    message.textContent = valid ? 'Thank you for exploring with us. This sample signup does not send emails.' : 'Enter an email address in the format you@example.com.';
    modal.showModal();
    if (valid) form.reset();
  });
  document.querySelector('#close-modal').addEventListener('click', () => modal.close());
}

const addToBasket = document.querySelector('.product-form button[type="button"]');

if (addToBasket) {
  const modal = document.createElement('dialog');
  modal.innerHTML = '<button class="modal-close" aria-label="Close confirmation" type="button">X</button><h2>Added to basket</h2><p>Your bicycle has been added to the basket.</p>';
  document.body.append(modal);
  let timeout;
  const closeModal = () => modal.close();
  addToBasket.addEventListener('click', () => {
    clearTimeout(timeout);
    modal.showModal();
    timeout = setTimeout(closeModal, 5000);
  });
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('close', () => clearTimeout(timeout));
}
