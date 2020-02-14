"use strict";

const app = document.getElementById("quiz-app");
const quizCard = document.getElementById("quiz-details");
const questionsCard = document.getElementById("questions-card");
const resultCard = document.getElementById("result-card");

let quiz;

function initApp() {
    const questions = [
        {
            title: "Question 1?",
            options: ["O1", "O2", "O3", "O4"]
        }, {
            title: "Question 2?",
            options: ["O 11", "O2", "O3", "O4"]
        }, {
            title: "Question 3?",
            options: ["O1", "O 22", "O3", "O4"]
        }, {
            title: "Question 4?",
            options: ["O1", "O2", "O 33", "O4"]
        },
    ];

    quiz = new Quiz(
        "The second round of JavaScript contest in quiz concept",
        `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.`,
        10);

    questions.map(q => quiz.addQuestion(q.title, q.options));
}

initApp();
console.log(quiz);


const elementHelper = new ElementHelper(app, quizCard, questionsCard, resultCard, quiz);

elementHelper.showQuizCard();
