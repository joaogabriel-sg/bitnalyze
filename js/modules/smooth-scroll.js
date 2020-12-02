export default class SmoothScroll {
  constructor(links, options) {
    this.links = document.querySelectorAll(links);
    this.mobileMenu = document.querySelector('.header__mobile-burger');
    this.eventsList = ['click', 'touchstart'];
    this.goToSection = this.goToSection.bind(this);

    if (options === undefined) {
      this.options = { behavior: 'smooth', block: 'start' };
    } else {
      this.options = options;
    }
  }

  removeMobileMenu() {
    this.mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  goToSection(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const section = document.querySelector(href);
    this.removeMobileMenu();
    section.scrollIntoView(this.options);
  }

  addEventToLinks() {
    this.links.forEach((link) => {
      this.eventsList.forEach((eventItem) => {
        link.addEventListener(eventItem, this.goToSection);
      });
    });
  }

  init() {
    if (this.links.length) {
      this.addEventToLinks();
    }
    return this;
  }
}
