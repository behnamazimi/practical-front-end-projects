let TIME_OVER_SYM = Symbol();
let TIMER_INTERVAL_SYM = Symbol();

class Quiz {

    /**
     *
     * @param title - quiz main title
     * @param time - in second
     */
    constructor(title, time) {

        if (!title)
            throw new Error("Title of quiz is required.");

        if (!time || time < 10)
            throw new Error("Time is required and must be more than 10 sec.");

        this.title = title;
        this._time = time;
        this[TIME_OVER_SYM] = null;
        this[TIMER_INTERVAL_SYM] = null;
        this._questions = [];
    }

    /**
     *
     * @param title {String}
     * @param options {Array}
     */
    addQuestion(title, options) {
        if (this._started) {
            console.log("Question can not added on a started quiz.");
            return;
        }

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

        this.reset();
        this._started = true;
        this._startTime = new Date().getTime();

        this._setTicker();

        return this.currentQuestion();
    }

    stop() {
        if (!this._started) {
            console.log("Only started quiz can be stopped.");
            return;
        }

        this._stopped = true;
        this._endTime = new Date().getTime();
        clearInterval(this[TIMER_INTERVAL_SYM]);
    }

    currentQuestion() {
        if (!this._started) {
            console.log("Quiz not started");
            return;
        }

        return this._questions[this._currentQuestionIndex];
    }

    result() {
        if (!this._started) {
            console.log("Quiz not started");
            return;
        }

        let skipped = 0;
        let correct = 0;
        this._questions.map(q => {
            if (q.result)
                correct++;
            else if (q.skip)
                skipped++;
        });

        let score = (100 * correct) / this._questions.length;

        return {
            questionsCount: this._questions.length,
            skipped,
            correct,
            score,
            timeOver: this[TIME_OVER_SYM],
            finished: this[TIME_OVER_SYM] || this._stopped
        };
    }

    reset() {
        if (this._started) {
            console.log("Can not reset the started quiz.");
            return;
        }

        this._stopped = false;
        this._startTime = null;
        this._endTime = null;
        this._remainingTime = 0;
        this._currentQuestionIndex = 0;
        this[TIME_OVER_SYM] = false;
        clearInterval(this[TIMER_INTERVAL_SYM]);
    }

    answerCurrentQuestion(option) {
        if (!this._started) {
            console.log("Start the quiz first");
            return;
        }

        const nextQ = askNextQuestion.call(this);
        if (!nextQ || this[TIME_OVER_SYM])
            this.stop();

        let response = {
            timeOver: this[TIME_OVER_SYM],
            finished: !nextQ || this._stopped
        };

        if (response.finished) {
            response.result = this.result();

        } else {

            const currentQ = this.currentQuestion();
            if (currentQ.skip !== void (0)) {
                console.log("You already skipped this question");
                return;
            }

            if (currentQ.answer !== void (0)) {
                console.log("You already answered this question");
                return;
            }
            currentQ.answer = option;
            const answerResult = this.checkAnswerValidity(currentQ.id, option);
            currentQ.result = answerResult;

            response.answerResult = answerResult;
            response.nextQ = nextQ;
        }

        return response;
    }

    skipCurrentQuestion() {

        const nextQ = askNextQuestion.call(this);
        if (!nextQ || this[TIME_OVER_SYM])
            this.stop();

        let response = {
            timeOver: this[TIME_OVER_SYM],
            finished: !nextQ || this._stopped
        };

        if (response.finished) {
            response.result = this.result();

        } else {

            const currentQ = this.currentQuestion();
            if (currentQ.skip !== void (0)) {
                console.log("You already skipped this question");
                return;
            }

            if (currentQ.answer !== void (0)) {
                console.log("You already answered this question");
                return;
            }
            currentQ.answer = option;
            const answerResult = this.checkAnswerValidity(currentQ.id, option);
            currentQ.result = answerResult;

            response.answerResult = answerResult;
            response.nextQ = nextQ;
        }

        return response;
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

    get timeDetails() {
        let now = new Date().getTime();
        return {
            quizTime: this._time,
            start: this._startTime,
            end: this._endTime,
            elapsedTime: ((this._endTime || now) - this._startTime) / 1000, // ms to sec
            remainingTime: this.remainingTime
        }
    }

    get remainingTime() {
        return this._remainingTime;
    }

    _setTicker() {
        if (!this._started) {
            console.log("Quiz not started yet.");
            return;
        }

        if (this[TIMER_INTERVAL_SYM]) {
            console.log("The ticker has been set before");
            return;
        }

        let privateRemainingTimeInSec = this._time;
        this[TIME_OVER_SYM] = false;
        this[TIMER_INTERVAL_SYM] = setInterval(() => {
            --privateRemainingTimeInSec;
            this._remainingTime = privateRemainingTimeInSec;
            if (privateRemainingTimeInSec <= 0) {
                this[TIME_OVER_SYM] = true;
                this.stop();
            }
        }, 1000)
    }
}

function askNextQuestion() {
    if (!this._started) {
        console.log("Quiz not started");
        return;
    }

    const currentQ = this.currentQuestion();
    if (currentQ.answer === void (0) && currentQ.skip === void (0)) {
        console.log("Current question not answered or skipped.");
        return;
    }

    if (this._currentQuestionIndex + 1 >= this._questions.length) {
        console.log("No more question.");
        return;
    }

    return this._questions[++this._currentQuestionIndex];
}
