"use strict";

class ElementHelper {
    constructor(app, quizCard, questionCard, resultCard, quiz) {
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

        this.nextBtn = this.app.querySelector("#next-btn");
        this.stopBtn = this.app.querySelector("#stop-btn");

        this.nextBtn.addEventListener("click", this.nextBtnHandler.bind(this));
        this.stopBtn.addEventListener("click", this.stopBtnHandler.bind(this));

        this.questionCard.classList.add("show");
        this.questionCard.classList.remove("time-over");

        setTimeout(() => {
            this.startQuiz();
        }, 700) // 700 is the longest transition time
    }

    hideQuestionsCard() {
        this.questionCard.classList.remove("show");
    }

    showResultCard() {
        this.hideQuizCard();
        this.hideQuestionsCard();


        // this.questionCard.classList.add("show");
    }

    hideResultCard() {
        // this.questionCard.classList.remove("show");
    }

    startQuiz() {
        const firstQuestion = this.quiz.start();
        if (firstQuestion) {
            this.parseNextQuestion(firstQuestion)
        }

        this.nextBtn.innerText = "Next";

        const progressRemainingTimeElm = document.querySelector(".questions-card__remaining-time");
        const progressbarElm = document.querySelector(".questions-card__progress .--value");
        const remainingTimeInterval = setInterval(() => {
            const qTime = this.quiz.timeDetails;

            if (qTime && qTime.remainingTime) {
                progressRemainingTimeElm.innerText = qTime.remainingTime;

                let progressPercent = (((qTime.quizTime - qTime.elapsedTime) * 100) / qTime.quizTime);
                if (progressPercent < 0)
                    progressPercent = 0;

                progressbarElm.style.width = progressPercent + '%';
            }

            if (qTime.timeOver) {
                this.questionCard.classList.add("time-over");
                this.nextBtn.innerText = "Show Result";
                clearInterval(remainingTimeInterval)
            }
        }, 1000);
    }

    parseNextQuestion(question) {
        const questionTitleElm = document.getElementById("question-title");
        const optionOneElm = document.querySelector("#option-one ~ label");
        const optionTwoElm = document.querySelector("#option-two ~ label");
        const optionThreeElm = document.querySelector("#option-three ~ label");
        const optionFourElm = document.querySelector("#option-four ~ label");
        const selectedOption = document.querySelector("input[name=question-option]:checked");
        const progressQuestionCountElm = document.querySelector(".questions-card__q-count");

        progressQuestionCountElm.innerText = `Question ${this.quiz._currentQuestionIndex + 1}/${this.quiz._questions.length}`
        questionTitleElm.setAttribute("data-qn", `Q ${this.quiz._currentQuestionIndex + 1}:`);
        questionTitleElm.innerText = question.title;

        optionOneElm.innerText = question.options[0];
        optionTwoElm.innerText = question.options[1];
        optionThreeElm.innerText = question.options[2];
        optionFourElm.innerText = question.options[3];

        if (selectedOption)
            selectedOption.checked = false;

    }

    nextBtnHandler() {
        const selectedOption = document.querySelector("input[name=question-option]:checked");

        let result;
        if (!selectedOption) {
            result = this.quiz.skipCurrentQuestion();
        } else {
            result = this.quiz.answerCurrentQuestion(selectedOption.value);
        }

        if (result.finished || result.timeOver) {
            this.showResultCard()
        } else {
            this.parseNextQuestion(result.nextQ)
        }

        console.log(result);
    }

    stopBtnHandler() {
        this.hideQuestionsCard();
        this.showQuizCard();
        this.quiz.stop();
        this.quiz.reset();
    }

}
