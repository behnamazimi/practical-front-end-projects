const LOCAL_NOTES_KEY = "APP_NOTES";
const LOCAL_CATS_KEY = "APP_CATS";

class Note {

    constructor() {
        this.notes = [];
        this.categories = [];

        this.updatingCategoryID = null;
        this._selectedCategory = null;
        this._selectedNote = null;

        this.loadLocalData();
    }

    loadLocalData() {
        const localCats = localStorage.getItem(LOCAL_CATS_KEY);
        if (localCats && this._isValidJsonString(localCats)) {
            const cats = JSON.parse(localCats);
            if (Array.isArray(cats))
                this.categories = cats.map(cat => new CategoryItem(cat));
        }
        const localNotes = localStorage.getItem(LOCAL_NOTES_KEY);
        if (localNotes && this._isValidJsonString(localNotes)) {
            const notes = JSON.parse(localNotes);
            if (Array.isArray(notes))
                this.notes = notes.map(note => new NoteItem(note));
        }
    }

    /**
     * Save data to local storage
     */
    saveData() {
        const cats = JSON.stringify(this.categories.map(cat => cat.data));
        const notes = JSON.stringify(this.notes.map(note => note.data));

        localStorage.setItem(LOCAL_CATS_KEY, cats);
        localStorage.setItem(LOCAL_NOTES_KEY, notes);
    }

    _isValidJsonString(JSONString) {
        try {
            JSON.parse(JSONString);
            return true
        } catch (e) {
            return false
        }
    }

    addNote(note) {
        if (!(note instanceof NoteItem))
            throw new Error(`Expecting NoteItem instance but received ${typeof note}`);

        this.notes.push(note);
        this.selectedNote = note;
        // save changes to local storage
        this.saveData();
    }

    updateNote(details = {}) {
        if (!this.selectedNote)
            return;

        this.notes = this.notes.map(note => {
            if (note.data.id === parseInt(this.selectedNote.data.id)) {
                note.data = {
                    ...details,
                    created_at: this.selectedNote.data.created_at,
                    id: this.selectedNote.data.id
                };
                note.update(details);
            }
            return note;
        });

        // save changes to local storage
        this.saveData();
    }

    removeNote(id) {
        this.notes = this.notes.filter(note => {
            if (note.data.id === parseInt(id))
                note.removeElement();

            return note.data.id !== parseInt(id)
        });
        // save changes to local storage
        this.saveData();
    }

    filterNotes(trend) {
        let result = this.notes
            .filter(note => note.data.title.toLowerCase().indexOf(trend.toLowerCase()) > -1
                || note.data.content.toLowerCase().indexOf(trend.toLowerCase()) > -1);

        // filter by selected category
        if (this.selectedCategory)
            result = result.filter(note => note.data.category === this.selectedCategory.data.id);

        return result;
    }

    addCategory(category) {
        if (!(category instanceof CategoryItem))
            throw new Error(`Expecting CategoryElement instance but received ${typeof category}`);

        this.categories.push(category);
        // save changes to local storage
        this.saveData();
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

        this.updatingCategoryID = null;
        // save changes to local storage
        this.saveData();
    }

    getCategoryByID(id) {
        return this.categories.find(cat => cat.data.id === parseInt(id))
    }

    getNoteById(id) {
        return this.notes.find(cat => cat.data.id === parseInt(id))
    }

    removeCategory(id) {
        this.categories = this.categories.filter(cat => {
            if (cat.data.id === parseInt(id)) {
                // remove selectedCategory too
                if (this.selectedCategory && this.selectedCategory.data.id === parseInt(id))
                    this.selectedCategory = null;

                cat.removeElement();
            }

            return cat.data.id !== parseInt(id)
        });

        // save changes to local storage
        this.saveData();
    }

    findCategory(id) {
        return this.categories.find(cat => cat.data.id === parseInt(id))
    }

    get selectedCategory() {
        return this._selectedCategory;
    }

    set selectedCategory(category) {

        if (!category) {
            if (this._selectedCategory)
                this._selectedCategory.deselect();
            this._selectedCategory = null;
            return;
        }

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

        // clear note selection
        if (!note) {
            if (this._selectedNote)
                this._selectedNote.deselect();
            this._selectedNote = null;
            return
        }

        if (!(note instanceof NoteItem))
            throw new Error(`Expecting NoteElement instance but received ${typeof note}`);

        // call select method of NoteItem
        // to set its checked status as true manually
        note.select();
        this._selectedNote = note;

        // update selected category according to the selected note
        if (note.data.category) {
            const noteCategory = this.findCategory(note.data.category);
            if (noteCategory) {
                this.selectedCategory = noteCategory
            }
        }
    }
}
