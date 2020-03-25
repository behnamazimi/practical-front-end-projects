class Component extends HTMLElement {

    constructor({attrTypes, template, shadowMode = "open"}) {
        super();

        this.attrTypes = attrTypes;
        this._template = template;
        this._shadowMode = shadowMode;

        this.checkAttrs();

        this.makeShadow();

        console.log(Component.attrTypes);

        this.findMainElement();
    }

    /**
     * parse attribute types according to passed types
     * @param value
     * @param target
     * @returns {(number | boolean | string)|*}
     */
    parseAttrType(value, target) {
        if (value === void 0 || value === null)
            return value;

        switch (target) {
            case "n":
            case "number":
                value = value.indexOf(".") ? parseFloat(value) : parseInt(value);
                break;

            case "o":
            case "object":
                value = JSON.parse(value);
                break;

            case "b":
            case "bool":
            case "boolean":
                value = Boolean(value);
                break;

            default:
                value = value.toString()
        }

        return value;
    }

    /**
     * check type of attributes
     */
    checkAttrs() {
        if (!this.attrTypes)
            return;

        for (let [attr, details] of Object.entries(this.attrTypes)) {

            let value = this.parseAttrType(this.getAttribute(attr), details.type);

            // replace attribute with parsed value
            this.setAttribute(attr, value || "");

            if (details.required)
                this.assert(!!value,
                    `"${attr}" attr is knows as required but not passed to component.`);

            if (value !== null && details.type) {
                this.assert(typeof value === details.type,
                    `The type of "${attr}" attr must be ${details.type}.`);
            }

        }
    }

    /**
     * to check condition and fire event if its false
     * @param condition
     * @param error
     */
    assert(condition, error) {
        if (!condition)
            throw new Error(error)
    }

    /**
     * parse html and get content as html
     * @returns {Node}
     */
    parseTemplate() {
        let parser = new DOMParser();
        const doc = parser.parseFromString(this._template, 'text/html');

        return doc.querySelector("template").content.cloneNode(true);
    }

    /**
     * attach template to shadow
     */
    makeShadow() {
        // get template note
        const template = this.parseTemplate();

        // generate shadow dom
        this.attachShadow({mode: this._shadowMode}).appendChild(template);
    }

    /**
     * find main elements of shadow dom
     * @param query
     */
    findMainElement(query) {
        if (!this.elm) {
            // find element
            this.elm = this.shadowRoot.querySelector(query);
        }
    }

    /**
     * remove founded element
     */
    removeMainElement() {
        if (!this.elm)
            return;

        this.elm.remove();
        this.elm = null;
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static generateTagName(className) {
        return className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    static getObservedAttrs(attrTypes = {}) {
        return Object.entries(attrTypes || {})
            .filter(([_, details]) => details.observe)
            .map(([attr, _]) => attr);
    }

}

export default Component
