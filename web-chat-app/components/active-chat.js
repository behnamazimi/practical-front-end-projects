import Component from "./component";


class ActiveChat extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            id: {
                type: "string",
                observe: true
            },
            title: {
                type: "string",
                observe: true
            },
            avatar: {
                type: "string",
                observe: true
            },
            online: {
                type: "boolean",
                observe: true
            },
        };
    }

    /**
     * generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(ActiveChat.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ActiveChat.name);
    }

    /**
     * styles of component
     * @returns {string}
     */
    static get style() {
        return (`<style>
                    :host {
                        --primaryColor:  #3AD07A;
                        --hoverColor: #edfbf3;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding: .75em;
                        position: relative;
                    }
                    :host([hidden]) {
                        display: none;
                    }
                    * {
                        box-sizing: border-box;
                        user-select: none;                        
                    }
                    .avatar-container {
                        flex: 0 0 2.5em;
                        width: 2.5em;
                        height: 2.5em;
                        border-radius: 50%;
                        overflow: hidden;   
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 1em;
                        background: #efefef;
                        font-weight: bold;
                        font-size: 1em;
                        position: relative;
                    }
                    .avatar-container img {
                        max-width: 100%;
                        position: relative;
                        z-index: 1;
                    }
                    .avatar-container .char-avatar {
                        position: absolute;
                        z-index: 0;
                    }
                    .online-badge {
                        position: absolute;
                        right: 10px;
                        bottom: 4px;
                        width: 10px;
                        height: 10px;
                        background: var(--primaryColor);
                        display: inline-block;
                        border-radius: 50%;
                        border: 1px solid #fff;
                        visibility: hidden;
                        opacity: 0;
                        z-index: 2;
                    }
                     :host([online]) .online-badge {
                        visibility: visible;
                        opacity: 1;
                    }                    
                    #title {
                        flex: 0 1 100%;
                        position: relative;
                        margin: 0 0 .3em 0;
                        font-size: 1em;
                        font-weight: bold;
                    }
                </style>`)
    }

    /**
     * html template of component
     * @returns {string}
     */
    static get template() {
        return (`
            <template>
                ${ActiveChat.style}
                <div class="avatar-container">
                    <span class="online-badge"></span>
                    <img src="" id="avatar">
                    <span class="char-avatar"></span>
                </div>
                <div id="title"></div>
                <div class="actions">
                    More
                </div>                
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ActiveChat.attrTypes,
            template: ActiveChat.template
        });

        // render component
        this.render();
    }

    connectedCallback() {
        this.initListeners();
    }

    disconnectedCallback() {
        this.removeListeners();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        // re-render component
        this.render();
    }

    initListeners() {
    }

    removeListeners() {
    }

    /**
     * render component according to template and attributes
     */
    render() {

        // check the existence of avatar
        // fetch first char of title to show if avatar not passed
        if (!this.getAttribute("avatar")) {
            // put first char of title when avatar not passed
            const title = (this.getAttribute("title") || "").toUpperCase();
            this.shadowRoot.querySelector(".char-avatar").innerText = title.substr(0, 1);
        }

        // loop over attributes and set all
        for (let attr of this.attributes) {
            const target = this.shadowRoot.getElementById(attr.name);
            if (!target)
                continue;

            switch (attr.name) {
                case "title":
                    target.innerText = attr.value;
                    break;
                case "avatar":
                    target.src = attr.value;
                    break;
            }

        }
    }

}

customElements.define(ActiveChat.tagName, ActiveChat);
