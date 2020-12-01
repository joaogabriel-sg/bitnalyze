export default class AccordionList {
  constructor(questions, answers, classToOpen) {
    this.questions = [...document.querySelectorAll(questions)];
    this.answers = [...document.querySelectorAll(answers)];
    this.eventsList = ['click', 'touchstart'];
    this.classToOpen = classToOpen;
  }

  openingAnswer(index) {
    this.questions.forEach((question) => question.classList.remove(this.classToOpen));
    this.answers.forEach((answer) => answer.classList.remove(this.classToOpen));
    this.questions[index].classList.add(this.classToOpen);
    this.answers[index].classList.add(this.classToOpen);
  }

  addEventsForQuestions() {
    this.questions.forEach((question, index) => {
      this.eventsList.forEach((eventItem) => {
        question.addEventListener(eventItem, (e) => {
          e.preventDefault();
          this.openingAnswer(index);
        });
      });
    });
  }

  init() {
    if (this.questions.length && this.answers.length) {
      this.openingAnswer(0);
      this.addEventsForQuestions();
    }
    return this;
  }
}
