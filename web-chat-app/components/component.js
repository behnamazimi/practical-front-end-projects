class Component extends HTMLElement {

    constructor({attrTypes, template, shadowMode = "open"}) {
        super();

        this.attrTypes = attrTypes;
        this._template = template;
        this._shadowMode = shadowMode;

        this.checkAttrs();

        this.makeShadow();
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

            // replace attribute with parsed value if value is not null
            if (value !== null)
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
            console.error(`Warning: ${error}`)
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

    get disabled() {
        return this.hasAttribute('disabled');
    }

    /**
     * reflect the disabled attr on HTML tag
     * @param val
     */
    set disabled(val) {
        const isDisabled = Boolean(val);
        if (isDisabled)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static generateTagName(className) {
        return className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * generate list of attrs has observe:true
     * @param attrTypes {Object}
     * @returns {string[]}
     */
    static getObservedAttrs(attrTypes = {}) {
        return Object.entries(attrTypes || {})
            .filter(([_, details]) => details.observe)
            .map(([attr, _]) => attr);
    }

}

export default Component
