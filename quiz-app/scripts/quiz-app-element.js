class QuizAppElement {


    constructor(wrapper, type) {
        this.wrapper = wrapper;
        this.type = type;
    }

    generateElement() {
        this.element = document.createElement("div");

        this.wrapper.appendChild(this.element);
    }
}
