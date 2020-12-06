import debounce from './debounce.js';

export default class ScrollAnimation {
  constructor(elements) {
    this.elements = [...document.querySelectorAll(elements)];
    this.halfWindow = window.innerHeight * 0.85;
    this.checkDistances = debounce(this.checkDistances.bind(this), 30);
    this.getElementsInformations = debounce(this.getElementsInformations.bind(this), 30);
  }

  getElementsInformations() {
    this.distances = this.elements.map((element) => {
      const offset = element.offsetTop;
      return { element, offset: Math.round(offset - this.halfWindow) };
    });
    this.checkDistances();
  }

  checkDistances() {
    this.distances.forEach(({ element, offset }) => {
      if (window.pageYOffset > offset) {
        element.classList.add('active');
      } else if (element.classList.contains('active')) {
        element.classList.remove('active');
      }
    });
  }

  init() {
    if (this.elements.length) {
      this.getElementsInformations();
      this.checkDistances();
      window.addEventListener('scroll', this.checkDistances);
      window.addEventListener('resize', this.getElementsInformations);
    }
    return this;
  }
}
