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

#note-app {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fbfbf9;
    display: flex;
    flex-direction: column;
}

#note-app main {
    position: relative;

    flex-grow: 1;
    display: grid;
    grid-template-columns: 200px 250px auto;
    grid-template-rows: calc(100vh - 3em);
    grid-template-areas: "categories notes editor";
}

.custom-radio {
    position: relative;
}

.custom-radio:hover {
    cursor: pointer;
}

.custom-radio input[type="radio"] {
    display: none;
}

.custom-radio label {
    cursor: pointer;
    display: block;
    padding: .5em 2.5em .5em .75em;
}

.custom-radio:hover label {
    background-color: rgba(239, 187, 0, 0.08);
}

.custom-radio input[type="radio"]:checked ~ label {
    background-color: #f5eea9;
}

.input-field {
    background-color: transparent;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.input-field input {
    background-color: transparent;
    outline: none;
    box-shadow: none;
    padding: .4em;
    border: 1px solid #d0d0d0;
    border-radius: .3em;
    max-width: 100%;
}

.input-field input:focus {
    background-color: #e2e0e0;
}

.icon-button {
    background-color: #efefef;
    width: 1.75em;
    border-radius: .3em;
    outline: none;
    cursor: pointer;
    display: inline-flex;
    padding: .2em;
    box-shadow: none;
    border: 1px solid #d0d0d0;
}

.icon-button > svg {
    pointer-events: none;
    stroke: #949494;
    width: 100%;
    stroke-width: 1.7;
}

.icon-button:hover {
    background-color: #e0e0e0;
}

.content-placeholder {
    font-size: 16px;
    color: #aaa;
}

/** Toolbox - START */
.toolbox {
    height: 3em;
    display: flex;
    justify-content: space-between;
    padding: .5rem 1rem;
    border-bottom: 2px solid #d0d0d0;
    background: #f5f5f5;
}

#add-category-form {
    display: flex;
    margin-right: 1.7em;
}

#add-category-form .input-field {
    max-width: 140px;
}

#add-category-form button {
    width: 2em;
    padding: 0 .3em;
    margin-left: .4em;
}

.toolbox__btn {
    width: 26px;
    margin-left: .5rem;
}

/** Categories List - START */
#categories-list {
    grid-area: categories;
    overflow-y: auto;
    border-right: 1px solid #e0e0e0;
    padding: .25em;
}

.category-item {
    border-bottom: 1px solid #dfdfdf;
}

.category-item .icon-button {
    position: absolute;
    top: 50%;
    right: .5em;
    transform: translateY(-50%);
    visibility: hidden;
    opacity: 0;
    transition: all .1s ease-in;
}

.category-item .icon-button:nth-of-type(2) {
    right: 2.5em;
}

.category-item:hover .icon-button {
    visibility: visible;
    opacity: 1;
}

/** Notes List - START */
#notes-list {
    grid-area: notes;
    overflow-y: auto;
    border-right: 1px solid #e0e0e0;
    padding: .25em;
}

.note-item {
    border-bottom: 1px solid #dfdfdf;
}

.note-item .icon-button {
    position: absolute;
    top: 50%;
    right: .5em;
    transform: translateY(-50%);
    visibility: hidden;
    opacity: 0;
    transition: all .1s ease-in;
}

.note-item:hover .icon-button {
    visibility: visible;
    opacity: 1;
}

.note-item__title {
    display: block;
    margin-bottom: .3em;
}

.note-item__subtitle {
    display: block;
    color: #888;
    font-size: 14px;
}

.note-item__datetime {
    display: block;
    color: #888;
    font-size: 12px;
    margin-top: .3em;
}

/** Editor - START */
#note-editor {
    grid-area: editor;
}

#note-add-edit-form {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#note-add-edit-form input,
#note-add-edit-form textarea {
    border: none;
    border-bottom: 1px solid #e0e0e0;
    background-color: transparent;
    padding: 1em;
    box-shadow: none;
    outline: none;
}

#note-add-edit-form input {
    font-size: 16px;
    font-family: 'Lato', sans-serif;
}

#note-add-edit-form textarea {
    flex-grow: 1;
    min-width: 100%;
    max-width: 100%;
    font-size: 16px;
    line-height: 24px;
    font-family: 'Lato', sans-serif;
}

#note-add-edit-form textarea:focus,
#note-add-edit-form input:focus {
    background-color: #f5f5f5;
}

#note-add-edit-form button {
    background: #e0e0e0;
    box-shadow: none;
    border: none;
    padding: 1em;
    border-radius: .3em;
    cursor: pointer;
}

#note-add-edit-form button:hover {
    background-color: #d5d5d5;
}


/** Alert Box - START */
.alert-box {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 5;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    visibility: hidden;
    opacity: 0;
    transition: all .1s ease-in;
}

.alert-box.visible {
    visibility: visible;
    opacity: 1;
}

.alert-box__inner {
    padding: 1em;
    background: #fff;
    border-radius: .5em;
    width: 100%;
    max-width: 360px;
}

.alert-box__header {
    margin-bottom: 1rem;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
}

.alert-box__message {
    margin: 1rem 0;
    text-align: left;
    font-size: 16px;
    color: #888;
}

.alert-box__ok {
    float: right;
    background: #e0e0e0;
    box-shadow: none;
    border: none;
    padding: .5em 1em;
    border-radius: .3em;
    cursor: pointer;
}

.alert-box__ok:hover {
    background-color: #d5d5d5;
}
