"use strict";
(() => {
    const categoriesList = document.getElementById("categories-list");
    const notesList = document.getElementById("notes-list");
    const categoryAddEditForm = document.getElementById("add-category-form");
    const noteAddEditForm = document.getElementById("note-add-edit-form");
    const _note_app = new Note();

    function handleCategoryAddUpdate(e) {
        e.preventDefault();

        // find title input and get the value
        const titleInput = e.target.querySelector("input");

        if (!titleInput.value) {
            console.log("Enter a valid title");
            return
        }

        if (!_note_app.updatingCategoryID) {
            // unique id for each cat
            const id = new Date().getTime();
            const newCat = new CategoryItem({title: titleInput.value, id});

            // add new category to app
            _note_app.addCategory(newCat);

        } else {
            // update existing category
            _note_app.updateCategory(titleInput.value);
        }

        // reset input
        titleInput.value = "";
    }

    function handleCategoryItemClick(e) {
        e.preventDefault();

        const item = e.target.closest(".category-item");
        if (!item)
            return;

        const targetItemID = item.getAttribute("data-cat-id");

        const targetCategory = _note_app.getCategoryByID(targetItemID);
        if (!targetCategory)
            return;

        // control item removing
        if (e.target.tagName === "BUTTON") {
            e.preventDefault();
            const action = e.target.getAttribute("data-action");
            if (action === "remove") {
                _note_app.removeCategory(targetItemID);

            } else if (action === "edit") {
                const catEditInput = categoryAddEditForm.querySelector("input");
                _note_app.updatingCategoryID = targetCategory.data.id;
                catEditInput.value = targetCategory.data.title;
                catEditInput.focus();
            }

        } else {
            // update selected category
            _note_app.selectedCategory = targetCategory
        }

    }

    function handleNoteAddUpdate(e) {
        e.preventDefault();

        const titleInput = e.target.querySelector("input");
        const contentArea = e.target.querySelector("textarea");

        if (!titleInput.value) {
            console.log("Enter a valid title");
            return
        }

        if (!_note_app.selectedCategory) {
            console.log("Select a category first");
            return;
        }

        const noteObj = {
            title: titleInput.value,
            content: contentArea.value,
            category: _note_app.selectedCategory.data.id // set category on note
        };

        if (!_note_app.updatingNoteID) {
            // unique id for each note
            noteObj.id = new Date().getTime();
            noteObj.created_at = new Date().getTime();
            const newNote = new NoteItem(noteObj);

            // add new category to app
            _note_app.addNote(newNote);

        } else {
            noteObj.updated_at = new Date().getTime();
            // update existing category
            _note_app.updateNote(noteObj);
        }

        // reset input
        titleInput.value = "";
        contentArea.value = "";

    }

    function handleNoteItemClick(e) {
        e.preventDefault();

        const item = e.target.closest(".note-item");
        if (!item)
            return;

        const targetItemID = item.getAttribute("data-note-id");

        const targetNote = _note_app.getNoteById(targetItemID);
        if (!targetNote)
            return;

        // control item removing
        if (e.target.tagName === "BUTTON") {
            e.preventDefault();
            const action = e.target.getAttribute("data-action");
            if (action === "remove") {
                _note_app.removeNote(targetItemID);

            } else if (action === "edit") {
                const noteTitle = noteAddEditForm.querySelector("input");
                const noteContent = noteAddEditForm.querySelector("textarea");
                _note_app.updatingNoteID = targetNote.data.id;
                noteTitle.value = targetNote.data.title;
                noteContent.value = targetNote.data.content;
                noteTitle.focus();
            }

        } else {
            // update selected category
            _note_app.selectedNote = targetNote
        }

    }

    function initListeners() {
        // add listener for category adding
        categoryAddEditForm.addEventListener("submit", handleCategoryAddUpdate);
        categoriesList.addEventListener("click", handleCategoryItemClick);

        // add listener to note form
        noteAddEditForm.addEventListener("submit", handleNoteAddUpdate);
        notesList.addEventListener("click", handleNoteItemClick);
    }


    initListeners()


})();
