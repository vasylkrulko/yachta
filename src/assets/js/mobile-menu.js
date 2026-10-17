const menuOverlay = document.querySelector('.mobile-menu-overlay');
const openMenuBtn = document.querySelector('.header-btn-menu');
const closeMenuBtn = document.querySelector('.mobile-btn-close');
const menuLinks = document.querySelectorAll('.mobile-menu-link');

openMenuBtn.addEventListener('click', () => {
  menuOverlay.classList.add('is-open');
});

closeMenuBtn.addEventListener('click', () => {
  menuOverlay.classList.remove('is-open');
});

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuOverlay.classList.remove('is-open');
  });
});
