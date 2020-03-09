class Note {

    constructor() {
        this.notes = [];
        this.categories = [];

        this.updatingCategoryID = null;
        this.updatingNoteID = null;
        this._selectedCategory = null;
        this._selectedNote = null;
    }

    addNote(note) {
        if (!(note instanceof NoteItem))
            throw new Error(`Expecting NoteItem instance but received ${typeof note}`);

        this.notes.push(note)
    }

    updateNote(details = {}) {
        if (!this.updatingNoteID)
            return;

        this.notes = this.notes.map(note => {
            if (note.data.id === parseInt(this.updatingNoteID)) {
                note.data = {...details, id: this.updatingNoteID};
                note.update(details);
            }
            return note;
        });

        this.updatingNoteID = null
    }

    removeNote(id) {
        this.notes = this.notes.filter(note => {
            if (note.data.id === parseInt(id))
                note.removeElement();

            return note.data.id !== parseInt(id)
        });
    }

    findNote(trend) {
        return this.notes
            .find(note => note.title.toLowerCase().indexOf(trend.toLowerCase()) > -1
                || note.content.toLowerCase().indexOf(trend.toLowerCase()) > -1)
    }

    addCategory(category) {
        if (!(category instanceof CategoryItem))
            throw new Error(`Expecting CategoryElement instance but received ${typeof category}`);

        this.categories.push(category)
    }

    updateCategory(title) {
        if (!this.updatingCategoryID)
            return;

        this.categories = this.categories.map(cat => {
            if (cat.data.id === parseInt(this.updatingCategoryID)) {
                cat.data.title = title;
                cat.update(title)
            }
            return cat;
        });

        this.updatingCategoryID = null
    }

    getCategoryByID(id) {
        return this.categories.find(cat => cat.data.id === parseInt(id))
    }

    getNoteById(id) {
        return this.notes.find(cat => cat.data.id === parseInt(id))
    }

    removeCategory(id) {
        this.categories = this.categories.filter(cat => {
            if (cat.data.id === parseInt(id))
                cat.removeElement();

            return cat.data.id !== parseInt(id)
        });
    }

    get selectedCategory() {
        return this._selectedCategory;
    }

    set selectedCategory(category) {
        if (!(category instanceof CategoryItem))
            throw new Error(`Expecting CategoryElement instance but received ${typeof category}`);

        // call select method of CategoryItem
        // to set its checked status as true manually
        category.select();
        this._selectedCategory = category;
    }

    get selectedNote() {
        return this._selectedNote;
    }

    set selectedNote(note) {
        if (!(note instanceof NoteItem))
            throw new Error(`Expecting NoteElement instance but received ${typeof note}`);

        // call select method of NoteItem
        // to set its checked status as true manually
        note.select();
        this._selectedNote = note;
    }
}
