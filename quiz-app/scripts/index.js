"use strict";

const quizWrapper = document.getElementById("quiz-app");

function initQuiz() {
    const questions = [
        {
            title: "Question 1?",
            options: ["O1", "O2", "O3", "O4"]
        }, {
            title: "Question 2?",
            options: ["O1", "O2", "O3", "O4"]
        }, {
            title: "Question 3?",
            options: ["O1", "O2", "O3", "O4"]
        }, {
            title: "Question 4?",
            options: ["O1", "O2", "O3", "O4"]
        },
    ];

    const quiz = new Quiz(
        "Web Quiz",
        `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.`,
        10);

    questions.map(q => quiz.addQuestion(q.title, q.options));

    console.log(quiz);
}

initQuiz();


