"use strict";

let TIME_OVER_SYM = Symbol("TO");
let TIMER_INTERVAL_SYM = Symbol("TI");

class Quiz {

    /**
     *
     * @param title - quiz main title
     * @param description
     * @param time - in second
     */
    constructor(title, description, time) {

        if (!title)
            throw new Error("Title of quiz is required.");

        if (!description)
            throw new Error("Description of quiz is required.");

        if (!time || time < 10)
            throw new Error("Time is required and must be more than 10 sec.");

        this.title = title;
        this.description = description;
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
        if (this._startTime) {
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

        if (this._startTime) {
            console.log("Already started.");
            return;
        }

        this.reset();
        this._startTime = new Date().getTime();

        this._setTicker();

        return this.currentQuestion();
    }

    stop() {
        this._endTime = new Date().getTime();
        clearInterval(this[TIMER_INTERVAL_SYM]);
        this[TIMER_INTERVAL_SYM] = null;
    }

    currentQuestion() {
        if (!this._startTime) {
            console.log("Quiz not started");
            return;
        }

        return this._questions[this._currentQuestionIndex];
    }

    result() {
        if (!this._startTime) {
            console.log("Quiz not started.");
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
            finished: this.isOnLastQuestion() || this[TIME_OVER_SYM] || this._endTime
        };
    }

    reset() {
        if (this._startTime && !this._endTime) {
            console.log("Can not reset the running quiz.");
            return;
        }

        this._startTime = null;
        this._endTime = null;
        this._remainingTime = this._time;
        this._currentQuestionIndex = 0;
        this[TIME_OVER_SYM] = false;
        clearInterval(this[TIMER_INTERVAL_SYM]);

        this._questions = this._questions.map(q => ({id: q.id, title: q.title, options: q.options}))
    }

    answerCurrentQuestion(option) {
        if (!this._startTime) {
            console.log("Start the quiz first");
            return;
        }

        let response = {
            timeOver: this[TIME_OVER_SYM],
            finished: this.isOnLastQuestion() || this._endTime || this[TIME_OVER_SYM]
        };

        if (!this[TIME_OVER_SYM]) {

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

            if (!response.finished) {
                const nextQ = askNextQuestion.call(this);
                if (nextQ) {
                    response.nextQ = nextQ;
                }
            }
        }

        if (response.finished) {
            response.result = this.result();
            this.stop();
        }

        return response;
    }

    skipCurrentQuestion() {
        if (!this._startTime) {
            console.log("Start the quiz first");
            return;
        }

        let response = {
            timeOver: this[TIME_OVER_SYM],
            finished: this.isOnLastQuestion() || this._endTime || this[TIME_OVER_SYM]
        };

        if (!this[TIME_OVER_SYM]) {

            const currentQ = this.currentQuestion();
            if (currentQ.skip !== void (0)) {
                console.log("You already skipped this question");
                return;
            }
            if (currentQ.answer !== void (0)) {
                console.log("You already answered this question");
                return;
            }
            currentQ.skip = true;

            if (!response.finished) {
                const nextQ = askNextQuestion.call(this);
                if (nextQ) {
                    response.nextQ = nextQ;
                }
            }
        }

        if (response.finished) {
            response.result = this.result();
            this.stop();
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

    isOnLastQuestion() {
        return this._currentQuestionIndex + 1 >= this._questions.length
    }

    get timeDetails() {
        let now = new Date().getTime();
        return {
            quizTime: this._time,
            start: this._startTime,
            end: this._endTime,
            elapsedTime: ((this._endTime || now) - this._startTime) / 1000, // ms to sec
            remainingTime: secToTimeStr(this._remainingTime),
            timeOver: this[TIME_OVER_SYM]
        }
    }

    _setTicker() {
        if (!this._startTime) {
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
    if (!this._startTime) {
        console.log("Quiz not started");
        return;
    }

    const currentQ = this.currentQuestion();
    if (currentQ.answer === void (0) && currentQ.skip === void (0)) {
        console.log("Current question answered or skipped.");
        return;
    }

    if (this.isOnLastQuestion()) {
        console.log("No more question.");
        return;
    }

    return this._questions[++this._currentQuestionIndex];
}

function secToTimeStr(seconds) {

    let timeInHour = Math.floor(seconds / 3600);
    let timeInMin = Math.floor((seconds % 3600) / 60);
    let timeInSec = Math.floor(seconds % 60);

    if (timeInHour < 10)
        timeInHour = `0${timeInHour}`;

    if (timeInMin < 10)
        timeInMin = `0${timeInMin}`;

    if (timeInSec < 10)
        timeInSec = `0${timeInSec}`;

    let timeStr = `${timeInMin}:${timeInSec}`;
    if (parseInt(timeInHour))
        timeStr = `${timeInHour}:${timeStr}`;

    return timeStr;
}
