"use strict";

class ElementHelper {
    constructor(app, quizCard, questionCard) {
        this.app = app;
        this.quizCard = quizCard;
        this.questionCard = questionCard;

    }

    showQuizCard(quiz = {}) {
        const titleElm = this.quizCard.querySelector(".quiz-details__title");
        const descriptionElm = this.quizCard.querySelector(".quiz-details__description");
        const metaQCElm = this.quizCard.querySelector(".quiz-details__meta.--qc strong");
        const metaTimeElm = this.quizCard.querySelector(".quiz-details__meta.--t strong");
        const buttonElm = this.quizCard.querySelector(".quiz-details__start-btn");

        titleElm.innerText = quiz.title;
        descriptionElm.innerText = quiz.description;
        metaQCElm.innerText = quiz._questions.length;
        metaTimeElm.innerText = quiz._time;

        buttonElm.addEventListener("click", this.showQuestionsCard.bind(this));

        this.quizCard.classList.add("show")
    }

    showQuestionsCard() {
        this.quizCard.classList.remove("show")
    }

}
