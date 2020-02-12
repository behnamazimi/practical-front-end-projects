class Quiz {
    constructor(title, time) {
        this.title = title;
        this._time = time;
        this._questions = [];
    }

    addQuestion(title, options) {
        let id = this._questions.length;
        this._questions.push({id, title, options})
    }

    start() {
        if (!this._questions.length) {
            console.log("There is not any question");
            return;
        }

        if (this._started) {
            console.log("Already started.");
            return;
        }

        this._started = true;
        this._currentQuestionIndex = 0;
        this._startTime = (new Date()).getTime();
    }

    stop() {
        if (!this._started) {
            console.log("Only started quiz can be stopped.");
            return;
        }

        this._started = false;
        this._endTime = (new Date()).getTime();
    }

    currentQuestion() {
        if (!this._started) {
            console.log("Quiz not started");
            return;
        }

        return this._questions[this._currentQuestionIndex];
    }

    _nextQuestion() {
        if (!this._started) {
            console.log("Quiz not started");
            return;
        }

        if (this._currentQuestionIndex + 1 >= this._questions.length) {
            console.log("No more question.");
            return;
        }

        return this._questions[++this._currentQuestionIndex];
    }

    result() {
        if (!this._started) {
            console.log("Quiz not started");
            return;
        }

        return {};
    }

    reset() {
        if (this._started) {
            console.log("Can not reset the started quiz.");
            return;
        }

        this._startTime = null;
        this._endTime = null;
    }

    answerCurrentQuestion(option) {
        if (!this._started) {
            console.log("Start the quiz first");
            return;
        }

        const currentQ = this.currentQuestion();
        if (currentQ.answer !== void (0)) {
            console.log("You already answered this question");
            return;
        }
        currentQ.answer = option;

        const answerResult = this.checkAnswerValidity(currentQ.id, option);
        const nextQ = this._nextQuestion();

        return {
            answerResult,
            finished: !nextQ,
            nextQ
        }
    }

    skipCurrentQuestion() {
        if (!this._started) {
            console.log("Quiz not started.");
            return;
        }

        const currentQ = this.currentQuestion();
        if (currentQ.skip !== void (0)) {
            console.log("You already skipped this question");
            return;
        }
        currentQ.skip = true;

        const nextQ = this._nextQuestion();

        return {
            finished: !nextQ,
            nextQ
        }
    }


    /**
     * fake answer checking with 20 percent of wrong answering
     *
     * @param questionID
     * @param option
     */
    checkAnswerValidity(questionID, option) {
        return Math.random() > .2;
    }

    get time() {
        return {
            quizTime: this._time,
            start: this._startTime,
            end: this._endTime,
            elapsedTime: this._endTime - this._startTime,
        }
    }
}
