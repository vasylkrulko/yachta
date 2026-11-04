const menuOverlay = document.querySelector('.mobile-menu-overlay');
const openMenuBtn = document.querySelector('.header-btn-menu');
const closeMenuBtn = document.querySelector('.mobile-btn-close');
const menuLinks = document.querySelectorAll('.mobile-menu-link');

if (menuOverlay && openMenuBtn && closeMenuBtn) {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  let previousFocus = null;
  let backgroundElements = [];

  // Блокування фонової сторінки
  function disableBackground() {
    let current = menuOverlay;

    while (current.parentElement && current.parentElement !== document.body) {
      const parent = current.parentElement;

      [...parent.children].forEach((element) => {
        if (element !== current) {
          backgroundElements.push({
            element,
            wasInert: element.inert,
          });

          element.inert = true;
        }
      });

      current = parent;
    }

    [...document.body.children].forEach((element) => {
      if (element !== current) {
        backgroundElements.push({
          element,
          wasInert: element.inert,
        });

        element.inert = true;
      }
    });
  }

  // Відновлення фонової сторінки
  function enableBackground() {
    backgroundElements.forEach(({ element, wasInert }) => {
      element.inert = wasInert;
    });

    backgroundElements = [];
  }

  // Відкриття меню
  function openMenu() {
    if (menuOverlay.classList.contains('is-open')) return;

    previousFocus = document.activeElement;

    menuOverlay.classList.add('is-open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    openMenuBtn.setAttribute('aria-expanded', 'true');

    disableBackground();

    // Початковий фокус — кнопка закриття
    closeMenuBtn.focus();
  }

  // Закриття меню
  function closeMenu(restoreFocus = true) {
    if (!menuOverlay.classList.contains('is-open')) return;

    menuOverlay.classList.remove('is-open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    openMenuBtn.setAttribute('aria-expanded', 'false');

    enableBackground();

    if (restoreFocus && previousFocus?.isConnected) {
      previousFocus.focus();
    }
  }

  // Focus Trap + Escape
  menuOverlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = [
      ...menuOverlay.querySelectorAll(focusableSelector),
    ].filter(
      (element) =>
        element.getClientRects().length > 0 &&
        !element.closest('[inert]') &&
        element.getAttribute('aria-hidden') !== 'true',
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      (document.activeElement === firstElement ||
        !menuOverlay.contains(document.activeElement))
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === lastElement ||
        !menuOverlay.contains(document.activeElement))
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  // Відкриття та закриття кнопками
  openMenuBtn.addEventListener('click', openMenu);

  closeMenuBtn.addEventListener('click', () => {
    closeMenu();
  });

  // Закриття після кліку на навігаційне посилання
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}
