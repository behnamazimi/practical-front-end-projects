"use strict";

class ElementHelper {
    constructor(app, quizCard, questionCard, resultCard, quiz) {
        this.app = app;
        this.quiz = quiz;
        this.quizCard = quizCard;
        this.questionCard = questionCard;
        this.resultCard = resultCard;

        this.initListeners();
    }

    initListeners() {
        this.startBtn = this.quizCard.querySelector(".quiz-details__start-btn");
        this.startBtn.addEventListener("click", this.showQuestionsCard.bind(this));

        this.nextBtn = this.app.querySelector("#next-btn");
        this.nextBtn.addEventListener("click", this.nextBtnHandler.bind(this));

        this.stopBtn = this.app.querySelector("#stop-btn");
        this.stopBtn.addEventListener("click", this.stopBtnHandler.bind(this));

        this.gotoHome = this.resultCard.querySelector("#go-to-home");
        this.gotoHome.addEventListener("click", this.hideResultCard.bind(this));

    }

    showQuizCard() {

        const titleElm = this.quizCard.querySelector(".quiz-details__title");
        const descriptionElm = this.quizCard.querySelector(".quiz-details__description");
        const metaQCElm = this.quizCard.querySelector(".quiz-details__meta.--qc strong");
        const metaTimeElm = this.quizCard.querySelector(".quiz-details__meta.--t strong");

        titleElm.innerText = this.quiz.title;
        descriptionElm.innerText = this.quiz.description;
        metaQCElm.innerText = this.quiz._questions.length;
        metaTimeElm.innerText = this.quiz._time;

        this.quizCard.classList.add("show");
    }

    hideQuizCard() {
        this.quizCard.classList.remove("show");
    }

    showQuestionsCard() {
        this.hideQuizCard();

        this.questionCard.classList.add("show");
        this.questionCard.classList.remove("time-over");

        this.startQuiz();
    }

    hideQuestionsCard() {
        this.questionCard.classList.remove("show");
    }

    showResultCard(result) {
        this.hideQuestionsCard();

        const scoreElm = this.resultCard.querySelector("#score");

        if (scoreElm && result)
            scoreElm.innerText = result.score;

        this.resultCard.classList.add("show");
    }

    hideResultCard() {
        this.resultCard.classList.remove("show");
        this.showQuizCard();
    }

    startQuiz() {
        this.resetPrevQuiz();
        this.quiz.reset();
        const firstQuestion = this.quiz.start();
        if (firstQuestion) {
            this.parseNextQuestion(firstQuestion)
        }

        this.nextBtn.innerText = "Next";

        const progressRemainingTimeElm = document.querySelector(".questions-card__remaining-time");
        const progressbarElm = document.querySelector(".questions-card__progress .--value");
        this.remainingTimeInterval = setInterval(() => {
            const qTime = this.quiz.timeDetails;
            if (qTime && qTime.remainingTime) {
                progressRemainingTimeElm.innerText = qTime.remainingTime;

                let progressPercent = (((qTime.quizTime - qTime.elapsedTime) * 100) / qTime.quizTime);
                if (progressPercent < 0)
                    progressPercent = 0;

                progressbarElm.style.width = progressPercent + '%';
            }

            if (qTime.timeOver) {
                console.log("qTime clear");
                this.questionCard.classList.add("time-over");
                this.nextBtn.innerText = "Show Result";
                clearInterval(this.remainingTimeInterval)
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
            this.showResultCard(result.result)
        } else if (result) {
            this.parseNextQuestion(result.nextQ)
        }

    }

    stopBtnHandler() {
        this.resetPrevQuiz();
        this.showResultCard();
    }

    resetPrevQuiz() {
        this.quiz.stop();
        clearInterval(this.remainingTimeInterval);

        const progressRemainingTimeElm = document.querySelector(".questions-card__remaining-time");
        const progressbarElm = document.querySelector(".questions-card__progress .--value");
        const scoreElm = this.resultCard.querySelector("#score");

        scoreElm.innerText = 0;
        progressRemainingTimeElm.innerText = "00:00";
        progressbarElm.style.width = '100%';
    }
}
