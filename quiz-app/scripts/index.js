"use strict";

const quizWrapper = document.getElementById("quiz-app");

const q = new Question("First question?", ["A", "B", "C", "D"]);

q.answer(1);
