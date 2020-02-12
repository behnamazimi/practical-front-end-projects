class Question extends QuizAppElement {
    constructor(title, options) {
        super(quizWrapper, "question");
        this.title = title;
        this.options = options;
        this.id = (new Date()).getTime();

        this.generateElement();
    }

    /**
     * submit the answer
     *
     * @param selected - Should be one of [1, 2, 3, 4]
     */
    answer(selected) {
        if (selected === void (0))
            return;

        console.log(this.title, "=>", this.options[selected - 1] + " selected");
    }

}
