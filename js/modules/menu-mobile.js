import debounce from './debounce.js';

export default class MenuMobile {
  constructor(menuMobile) {
    this.menuMobile = document.querySelector(menuMobile);
    this.eventsList = ['click', 'touchstart'];
    this.openOrClosed = this.openOrClosed.bind(this);
    this.resizeWindow = debounce(this.resizeWindow.bind(this), 50);
  }

  toggleClasses() {
    this.menuMobile.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  removeClasses() {
    this.menuMobile.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  resizeWindow(e) {
    if (e.currentTarget.innerWidth >= 600) {
      window.removeEventListener('resize', this.resizeWindow);
      this.removeClasses();
    }
  }

  openOrClosed(e) {
    e.preventDefault();
    this.toggleClasses();
    window.addEventListener('resize', this.resizeWindow);
  }

  addEventOpenOrClosed() {
    this.eventsList.forEach((eventItem) => {
      this.menuMobile.addEventListener(eventItem, this.openOrClosed);
    });
  }

  init() {
    if (this.menuMobile) this.addEventOpenOrClosed();
    return this;
  }
}
