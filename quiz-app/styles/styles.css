/** Simple Reset - START */
html {
    box-sizing: border-box;
    font-size: 16px;
    overflow-x: hidden;
}

*, *:before, *:after {
    box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
}

ol, ul {
    list-style: none;
}

img {
    max-width: 100%;
    height: auto;
}

/** Global - START */
body {
    font-family: 'Lato', sans-serif;
}

#quiz-app {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.center-card {
    height: 100%;
    width: 100%;
    max-width: 468px;
    max-height: 600px;
    overflow-y: auto;
    background: #fff;
    border-radius: .7rem;
    box-shadow: 1px 1px 15px 2px rgba(0, 0, 0, 0.16);
    padding: 2rem;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    transform-origin: top;
    transform: translateY(-150px) scale(.6);
    transition: transform .5s, opacity .7s .1s, visibility .7s .1s;
    user-select: none;
    z-index: -1;
}

.center-card.show {
    position: relative;
    transform: translateY(0px) scale(1);
    opacity: 1;
    visibility: visible;
    transition: transform .6s, opacity .7s .2s, visibility .7s .2s;
}

.default-btn {
    outline: none;
    border: none;
    background: #028a3d;
    padding: .4rem 1rem;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    min-width: 140px;
    height: 40px;
    text-transform: uppercase;
    font-size: 15px;
    font-weight: normal;
    box-shadow: 1px 1px 12px 2px rgba(0, 0, 0, .2);
    transition: all .3s;
}

.default-btn:hover {
    box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, .3);
}

.default-btn:active {
    box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, .3);
    transform: scale(0.95);
}

/** Quiz Card - START */
.quiz-details {
}

.quiz-details__question-icon {
    display: block;
    margin: 2rem 1rem;
    text-align: center;
}

.quiz-details__question-icon svg {
    stroke: #000;
    stroke-width: 2px;
    fill: #028a3d;
}

.quiz-details__title {
    font-weight: normal;
    text-align: left;
    font-size: 24px;
    color: #555;
}

.quiz-details__description {
    margin-top: 1rem;
    color: #888;
    line-height: 24px;
    margin-bottom: 1rem;
}

.quiz-details__meta {
    margin-top: .5rem;
    font-size: 14px;
    opacity: 0.6;
    color: #028a3d;
}

.quiz-details__meta span {
    margin-right: .3rem;
}

.quiz-details__start-btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    position: sticky;
    width: 100%;
    top: 100%;
    left: 0;
}

.quiz-details__start-btn {
    width: 60%;
    height: 40px;
}

.quiz-details__start-btn:hover {
    box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, .3);
}

.quiz-details__start-btn:active {
    box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, .3);
    transform: scale(0.95);
}


/** Question Card - START */
.questions-card {

}

.questions-card__progress-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin: .5rem 0 1rem;
    font-size: 14px;
    font-weight: bold;
}

.questions-card__progress {
    width: 100%;
    display: block;
    height: 8px;
    margin-top: .5rem;
    border-radius: 4px;
    background: #ddd;
    position: relative;
    overflow: hidden;
}

.questions-card__progress .--value {
    position: absolute;
    left: 0;
    height: 8px;
    width: 100%;
    display: inline-block;
    background: green;
    transition: all .3s;
}

.questions-card__q-title {
    font-size: 20px;
    line-height: 26px;
    font-weight: lighter;
    margin-top: 3rem;
    display: block;
    position: relative;
}

.questions-card__q-title:before {
    content: attr(data-qn);
    display: block;
    font-size: 16px;
    margin-bottom: .25rem;
    color: #bbb;
    font-weight: bold;
}

.question-card__options {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 1rem;
}

.question-card__option {
    display: block;
    margin-top: .5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
    text-align: left;
}

.question-card__option input[type="radio"] {
    display: none;
}


.question-card__option__value {
    display: block;
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    position: relative;
    cursor: pointer;
}

.question-card__option__value:before,
.question-card__option__value:after {
    content: '';
    display: inline-block;
    position: absolute;
    left: 1rem;
    top: calc(50% - 10px);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #ddd;
}

.question-card__option__value:after {
    display: none;
    width: 14px;
    height: 14px;
    left: calc(1rem + 3px);
    top: calc(50% - 7px);
    background-color: orange;
}

.question-card__option:hover,
.question-card__option:hover .question-card__option__value:before {
    border-color: orange;
}

.question-card__option input[type="radio"]:checked ~ label:after {
    display: inline-block;
}

.question-card-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    position: sticky;
    width: 100%;
    top: 100%;
    left: 0;
}

.question-card-buttons__stop {
    background-color: #ec880c;
}

.questions-card.time-over .question-card-buttons__stop {
    display: none;
}

.questions-card.time-over .question-card-buttons {
    justify-content: flex-end;
}


/** Result Card - START */
.result-card {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.result-card__score {
    font-size: calc(2vw + 2vh + 7vmin);
    margin-top: 2rem;
}

.result-card__score__lbl {
    color: #888;
}

.result-card-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    position: sticky;
    width: 100%;
    top: 100%;
    left: 0;
}

.result-card-buttons button {
    background: #0880d6;
    width: 60%;
}
