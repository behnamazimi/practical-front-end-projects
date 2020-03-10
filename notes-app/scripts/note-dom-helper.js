"use strict";

const TYPES = {
    category: {
        tag: "div",
        containerID: "categories-list",
        attributes: [
            ["class", "category-item"],
            ["data-cat-id", function () {
                return this.data.id;
            }]
        ],
        child: [
            {
                tag: "input",
                attributes: [
                    ["type", "radio"],
                    ["name", "category-item"],
                    ["id", function () {
                        return `cat-${this.data.id}`
                    }],
                    ["value", function () {
                        return this.data.id
                    }],
                ],
            },
            {
                tag: "label",
                attributes: [
                    ["type", "radio"],
                    ["for", function () {
                        return `cat-${this.data.id}`
                    }],
                ],
                inner: function () {
                    return this.data.title
                }
            },
            {
                tag: "button",
                attributes: [
                    ["type", "button"],
                    ["data-action", "remove"],
                ],
                inner: "x",
            },
            {
                tag: "button",
                attributes: [
                    ["type", "button"],
                    ["data-action", "edit"],
                ],
                inner: "E",
            }
        ]
    },
    note: {
        tag: "div",
        containerID: "notes-list",
        attributes: [
            ["class", "note-item"],
            ["data-note-id", function () {
                return this.data.id;
            }]
        ],
        child: [
            {
                tag: "input",
                attributes: [
                    ["type", "radio"],
                    ["name", "note-item"],
                    ["id", function () {
                        return `note-${this.data.id}`
                    }],
                    ["value", function () {
                        return this.data.id
                    }],
                ],
            },
            {
                tag: "label",
                attributes: [
                    ["type", "radio"],
                    ["for", function () {
                        return `cat-${this.data.id}`
                    }],
                ],
                child: [
                    {
                        tag: "strong",
                        attributes: [
                            ["class", "note-item__title"],
                        ],
                        inner: function () {
                            return this.data.title
                        }
                    },
                    {
                        tag: "small",
                        attributes: [
                            ["class", "note-item__subtitle"],
                        ],
                        inner: function () {
                            return this.data.content.substr(0, 70)
                        }
                    }
                ]
            },
            {
                tag: "button",
                attributes: [
                    ["type", "button"],
                    ["data-action", "remove"],
                ],
                inner: "x",
            },
        ]
    },
    alertBox: {
        tag: "div",
        containerID: "note-app",
        attributes: [
            ["class", "alert-box"],
        ],
        child: [
            {
                tag: "div",
                attributes: [
                    ["class", "alert-box__inner"],
                ],
                child: [
                    {
                        tag: "h3",
                        attributes: [
                            ["class", "alert-box__header"],
                        ],
                        inner: function () {
                            return this.data.header || ''
                        }
                    },
                    {
                        tag: "p",
                        attributes: [
                            ["class", "alert-box__message"],
                        ],
                        inner: function () {
                            return this.data.message || ''
                        }
                    },
                    {
                        tag: "button",
                        attributes: [
                            ["class", "alert-box__ok"],
                        ],
                        events: [
                            ["click", function () {
                                return this.close.call(this)
                            }]
                        ],
                        inner: function () {
                            return this.data.buttonText || ''
                        }
                    }
                ]
            }
        ]
    },
};

class AppElement {

    constructor(type, data, appendAutomatically = true) {
        this._type = type;
        this.data = data;
        this.el = null;

        this.createElement();

        // append created element to container
        this.appendToContainer();
    }

    appendToContainer() {
        const targetType = TYPES[this._type];
        const container = document.getElementById(targetType.containerID);
        if (!container)
            throw new Error(`Target container not found for ${this._type}`);

        container.appendChild(this.el)
    }

    _createChildElements(childArray, target) {
        childArray.map(child => {
            const childElm = document.createElement(child.tag);
            if (child.attributes && Array.isArray(child.attributes))
                child.attributes.map(([name, value]) => {
                    if (value && typeof value === "function")
                        childElm.setAttribute(name, value.call(this));
                    else if (value)
                        childElm.setAttribute(name, value)

                });

            if (child.events && Array.isArray(child.events))
                child.events.map(([event, fn]) => {
                    childElm.addEventListener(event, fn.bind(this))
                });


            if (child.inner && typeof child.inner === "function")
                childElm.innerText = child.inner.call(this);
            else if (child.inner)
                childElm.innerText = child.inner;

            // create child of child elements
            if (child.child)
                this._createChildElements(child.child, childElm);

            target.append(childElm)
        });
    }

    createElement() {
        const targetType = TYPES[this._type];
        this.el = document.createElement(targetType.tag);
        targetType.attributes.map(([name, value]) => {
            if (value && typeof value === "function")
                this.el.setAttribute(name, value.call(this));
            else
                this.el.setAttribute(name, value)
        });

        // create child elements
        if (targetType.child)
            this._createChildElements(targetType.child, this.el);
    }

    removeElement() {
        if (!this.el || !this.el["remove"])
            return false;

        return this.el.remove();
    }

}

class CategoryItem extends AppElement {

    constructor(details) {
        super("category", details);
    }

    // update category title
    update(title) {
        this.el.querySelector("label").innerText = title
    }

    // select the item
    select() {
        this.el.querySelector("input").checked = true;
    }


}

class NoteItem extends AppElement {

    constructor(details) {
        super("note", details);
    }

    // update category title
    update({title, content}) {
        this.el.querySelector("label strong").innerText = title;
        this.el.querySelector("label small").innerText = content.substr(0, 70)
    }

    // select the item
    select() {
        this.el.querySelector("input").checked = true;
    }

}

class AlertBox extends AppElement {
    constructor(details) {
        super("alertBox", details);
    }

    show(details = null) {

        if (!details)
            throw new Error("Show method requires details");

        this.data = details;

        this.el.querySelector(".alert-box__header").innerText = this.data.header;
        this.el.querySelector(".alert-box__message").innerText = this.data.message;
        this.el.querySelector(".alert-box__ok").innerText = this.data.buttonText;

        this.el.style.display = "block";
    }

    close() {
        this.el.style.display = "none";
    }
}
