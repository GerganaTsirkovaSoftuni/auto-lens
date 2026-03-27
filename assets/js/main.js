const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('DOMContentLoaded', () => {
  body.classList.add('page-ready');
});

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('[data-nav-link]').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
  );

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const gallery = document.querySelector('[data-gallery]');
const galleryMoreButton = document.querySelector('[data-gallery-more]');

if (gallery) {
  const hiddenItems = () => Array.from(gallery.querySelectorAll('.gallery-item.is-hidden'));

  if (galleryMoreButton) {
    galleryMoreButton.addEventListener('click', () => {
      hiddenItems().slice(0, 4).forEach((item) => {
        item.classList.remove('is-hidden');
      });

      if (hiddenItems().length === 0) {
        galleryMoreButton.style.display = 'none';
      }
    });
  }

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');

  if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImage.setAttribute('src', '');
      lightboxImage.setAttribute('alt', '');
      lightboxCaption.textContent = '';
      body.style.overflow = '';
    };

    gallery.querySelectorAll('[data-gallery-open]').forEach((button) => {
      button.addEventListener('click', () => {
        const imageSrc = button.getAttribute('data-full') || '';
        const caption = button.getAttribute('data-caption') || '';
        const altText = button.querySelector('img')?.getAttribute('alt') || caption;

        lightboxImage.setAttribute('src', imageSrc);
        lightboxImage.setAttribute('alt', altText);
        lightboxCaption.textContent = caption;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
}
