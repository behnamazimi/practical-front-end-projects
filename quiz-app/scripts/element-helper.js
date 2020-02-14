"use strict";

class ElementHelper {
    constructor(app, quizCard, questionCard, quiz) {
        this.app = app;
        this.quiz = quiz;
        this.quizCard = quizCard;
        this.questionCard = questionCard;

    }

    showQuizCard() {
        this.hideQuestionsCard();

        const titleElm = this.quizCard.querySelector(".quiz-details__title");
        const descriptionElm = this.quizCard.querySelector(".quiz-details__description");
        const metaQCElm = this.quizCard.querySelector(".quiz-details__meta.--qc strong");
        const metaTimeElm = this.quizCard.querySelector(".quiz-details__meta.--t strong");
        const buttonElm = this.quizCard.querySelector(".quiz-details__start-btn");

        titleElm.innerText = this.quiz.title;
        descriptionElm.innerText = this.quiz.description;
        metaQCElm.innerText = this.quiz._questions.length;
        metaTimeElm.innerText = this.quiz._time;

        buttonElm.addEventListener("click", this.showQuestionsCard.bind(this));

        this.quizCard.classList.add("show");
    }

    hideQuizCard() {
        this.quizCard.classList.remove("show");
    }

    showQuestionsCard() {
        this.hideQuizCard();

        const nextBtn = this.app.querySelector("#next-btn");
        const stopBtn = this.app.querySelector("#stop-btn");

        nextBtn.addEventListener("click", this.nextBtnHandler.bind(this));
        stopBtn.addEventListener("click", this.stopBtnHandler.bind(this));

        this.questionCard.classList.add("show");
        setTimeout(() => {
            this.startQuiz();
        }, 700) // 700 is the longest transition time
    }

    hideQuestionsCard() {
        this.questionCard.classList.remove("show");
    }

    startQuiz() {
        const firstQuestion = this.quiz.start();
        if (firstQuestion) {
            this.parseNextQuestion(firstQuestion)
        }
    }

    parseNextQuestion(question) {
        console.log(question);
    }

    nextBtnHandler() {
        const selectedOption = document.querySelector("input[name=question-option]:checked");

        let result;
        if (!selectedOption) {
            result = this.quiz.skipCurrentQuestion();
        } else {
            result = this.quiz.answerCurrentQuestion(selectedOption.value);
        }

        if (result.finished) {
            alert("finished")
        } else if (result.timeOver) {
            alert("timeOver")
        } else {
            this.parseNextQuestion(result.nextQ)
        }

        console.log(result);
    }

    stopBtnHandler() {
        this.hideQuestionsCard();
        this.showQuizCard()
    }

}
