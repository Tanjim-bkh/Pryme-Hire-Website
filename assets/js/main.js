document.addEventListener('DOMContentLoaded', () => {
  // 1. Hamburger toggle
  const hamburger = document.querySelector('.navbar-hamburger');
  const mobileMenu = document.querySelector('.navbar-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // 2. Active nav link
  // Hrefs are relative ("about.html", "../index.html"); link.pathname gives the
  // browser-resolved full path, which we compare against the current page.
  const normalise = (path) => {
    let p = decodeURIComponent(path);
    if (p.endsWith('/')) p += 'index.html';
    return p.replace(/\.html$/, '');
  };
  const current = normalise(window.location.pathname);
  const navLinks = document.querySelectorAll('.navbar-links a, .navbar-mobile a');
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === '#' || link.classList.contains('btn')) return;
    if (normalise(link.pathname) === current) link.classList.add('active');
  });
  if (/\/services\//.test(current)) {
    const toggle = document.querySelector('.navbar-dropdown > a');
    if (toggle) toggle.classList.add('active');
  }

  // 3. Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (id === '#') {
        event.preventDefault();
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 4. Contact form validation
  const form = document.getElementById('contact-form');
  if (form) {
    const success = document.getElementById('form-success');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (field) => {
      const group = field.closest('.form-group');
      const value = field.value.trim();
      let message = '';
      if (field.required && !value) {
        message = 'This field is required.';
      } else if (field.type === 'email' && value && !emailPattern.test(value)) {
        message = 'Enter a valid email address, like name@company.com.au.';
      }
      if (group) {
        group.classList.toggle('has-error', Boolean(message));
        const error = group.querySelector('.form-error');
        if (error && message) error.textContent = message;
      }
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    };

    form.querySelectorAll('[required]').forEach((field) => {
      field.addEventListener('input', () => {
        if (field.closest('.form-group.has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = Array.from(form.querySelectorAll('[required]'));
      const results = fields.map(validateField);
      if (results.includes(false)) {
        const firstInvalid = fields[results.indexOf(false)];
        firstInvalid.focus();
        return;
      }
      // No backend yet: connect a form service here to actually deliver enquiries.
      form.hidden = true;
      if (success) {
        success.classList.add('show');
        success.focus();
      }
    });
  }

  // 5. Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 6. Footer year
  document.querySelectorAll('.footer-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
