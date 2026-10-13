(function () {
  let activeModal = null;
  const bind = (container, { initialFocus, fallbackFocus, onClose } = {}) => {
    let opener = null;
    let background = [];
    const focusableElements = () => [...container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => !element.hidden && !element.closest('[hidden], [inert]') && element.getClientRects().length);

    const open = () => {
      if (!container.hidden) return;
      activeModal?.close();
      opener = document.activeElement;
      container.hidden = false;
      background = [...document.body.children]
        .filter((element) => element !== container && !element.contains(container))
        .map((element) => ({ element, inert: element.inert }));
      background.forEach(({ element }) => { element.inert = true; });
      activeModal = controls;
      requestAnimationFrame(() => {
        if (!container.hidden) (initialFocus || focusableElements()[0])?.focus({ preventScroll: true });
      });
    };

    const close = () => {
      if (container.hidden) return;
      container.hidden = true;
      background.forEach(({ element, inert }) => { element.inert = inert; });
      background = [];
      const target = opener?.isConnected && !opener.closest('[hidden], [inert]') ? opener : fallbackFocus;
      target?.focus({ preventScroll: true });
      opener = null;
      if (activeModal === controls) activeModal = null;
      onClose?.();
    };

    container.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || container.hidden) return;
      const elements = focusableElements();
      const first = elements[0];
      const last = elements.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !elements.includes(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !elements.includes(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    });

    const controls = Object.freeze({ open, close });
    return controls;
  };

  window.EA_MODAL = Object.freeze({ bind });
})();
