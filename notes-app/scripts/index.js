(() => {
    "use strict";
    const categoriesList = document.getElementById("categories-list");
    const notesList = document.getElementById("notes-list");
    const categoryAddEditForm = document.getElementById("add-category-form");
    const noteAddEditForm = document.getElementById("note-add-edit-form");
    const searchInput = document.getElementById("search-input");
    const newNoteBtn = document.getElementById("new-note-btn");
    const showAllNotesBtn = document.getElementById("show-all-notes");
    const _note_app = new Note();

    const alertBox = new AlertBox({});

    function filterNotesList(trend = '') {
        const result = _note_app.filterNotes(trend);

        notesList.innerHTML = '';
        // show result in list
        result.map(note => {
            notesList.appendChild(note.el)
        });

        if (!result.length)
            notesList.innerHTML = `<p class="content-placeholder">Notes not found.</p>`
    }

    function handleCategoryAddUpdate(e) {
        e.preventDefault();

        // find title input and get the value
        const titleInput = e.target.querySelector("input");

        if (!titleInput.value) {
            alertBox.show({header: "Category Adding Error", message: "Enter a valid title.", buttonText: "OK!"});
            titleInput.focus();
            return
        }

        if (!_note_app.updatingCategoryID) {
            // unique id for each cat
            const id = new Date().getTime();
            const newCat = new CategoryItem({title: titleInput.value.trim(), id});

            // add new category to app
            _note_app.addCategory(newCat);

        } else {
            // update existing category
            _note_app.updateCategory(titleInput.value.trim());
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
        if (!targetCategory) {
            alertBox.show({header: "Category Select Error", message: "Target category not found.", buttonText: "OK!"});
            return;
        }

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
            _note_app.selectedCategory = targetCategory;
        }

        filterNotesList()
    }

    function handleNoteAddUpdate(e) {
        e.preventDefault();

        const titleInput = e.target.querySelector("input");
        const contentArea = e.target.querySelector("textarea");

        if (!titleInput.value) {
            alertBox.show({header: "Note Saving Error", message: "Enter a valid title.", buttonText: "OK!"});
            titleInput.focus();
            return
        }

        if (!_note_app.selectedCategory) {
            alertBox.show({header: "Note Saving Error", message: "Select a category first.", buttonText: "OK!"});
            return;
        }

        const noteObj = {
            title: titleInput.value.trim(),
            content: contentArea.value.trim(),
            category: _note_app.selectedCategory.data.id // set category on note
        };

        if (!_note_app.selectedNote) {
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

    }

    function handleNoteItemClick(e) {
        e.preventDefault();

        const item = e.target.closest(".note-item");
        if (!item)
            return;

        const targetItemID = item.getAttribute("data-note-id");

        const targetNote = _note_app.getNoteById(targetItemID);
        if (!targetNote) {
            alertBox.show({header: "Note Select Error", message: "Target note not found.", buttonText: "OK!"});
            return;
        }

        // control item removing
        if (e.target.tagName === "BUTTON") {
            e.preventDefault();
            const action = e.target.getAttribute("data-action");
            if (action === "remove") {
                _note_app.removeNote(targetItemID);
            }

        } else {
            // set selected notes values to the editor form
            const noteTitle = noteAddEditForm.querySelector("input");
            const noteContent = noteAddEditForm.querySelector("textarea");
            noteTitle.value = targetNote.data.title;
            noteContent.value = targetNote.data.content;

            // update selected category
            _note_app.selectedNote = targetNote
        }

    }

    function handleSearchInNotes(e) {
        filterNotesList(e.target.value)
    }

    function handleNewNoteBtnClick(e) {
        _note_app.selectedNote = null;
        const noteTitle = noteAddEditForm.querySelector("input");
        const noteContent = noteAddEditForm.querySelector("textarea");
        noteTitle.value = '';
        noteContent.value = '';
        noteTitle.focus();

    }

    function handleShowAllNotesBtnClick(e) {
        _note_app.selectedCategory = null;
        filterNotesList()
    }

    function initListeners() {
        // add listener for category adding
        categoryAddEditForm.addEventListener("submit", handleCategoryAddUpdate);
        categoriesList.addEventListener("click", handleCategoryItemClick);

        // add listener to note form
        noteAddEditForm.addEventListener("submit", handleNoteAddUpdate);
        notesList.addEventListener("click", handleNoteItemClick);

        // add listener to control search
        searchInput.addEventListener("input", handleSearchInNotes);

        newNoteBtn.addEventListener("click", handleNewNoteBtnClick);

        showAllNotesBtn.addEventListener("click", handleShowAllNotesBtnClick);
    }

    initListeners();

})();
