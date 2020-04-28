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
            name: {
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
                        border-radius: 50%;
                        z-index: 1;
                    }
                    .avatar-container .char-avatar {
                        position: absolute;
                        z-index: 0;
                    }
                    .online-badge {
                        position: absolute;
                        right: 4px;
                        bottom: 0px;
                        width: 12px;
                        height: 12px;
                        background: var(--primaryColor);
                        display: inline-block;
                        border-radius: 50%;
                        border: 2px solid #fff;
                        visibility: hidden;
                        opacity: 0;
                        z-index: 2;
                    }
                     :host([online]) .online-badge {
                        visibility: visible;
                        opacity: 1;
                    }                    
                    #name {
                        flex: 0 1 100%;
                        position: relative;
                        margin: 0 0 .3em 0;
                        font-size: 1em;
                        font-weight: bold;
                    }
                    #more-btn {
                        background: transparent;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        color: var(--primaryColor);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 32px;
                        height: 28px;
                        border-radius: 5px;
                        margin: 0 .3em ;
                    }
                    #more-btn:hover {
                        background-color: #f2f2f2;
                    }
                    #back-btn {
                        background: transparent;
                        outline: none;
                        border: none;
                        margin-right: .5rem;
                        cursor: pointer;
                        color: var(--primaryColor);
                        border-radius: 4px;
                        height: 100%;
                        display: none;
                    }
                    #back-btn:hover {
                        background-color: var(--hoverColor);
                    }
                    @media screen and (max-width: 564px) {
                        #back-btn {
                            display: inline-block;
                        }
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
                <button id="back-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>                
                </button>
                <div class="avatar-container">
                    <span class="online-badge"></span>
                    <img src="" id="avatar">
                    <span class="char-avatar"></span>
                </div>
                <div id="name"></div>
                <div class="actions">
                    <button id="more-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>
                </div>                
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ActiveChat.attrTypes,
            template: ActiveChat.template
        });

        this._backBtn = this.shadowRoot.getElementById("back-btn");

        // render component
        this.render();
    }

    // call on attributes changed
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        // re-render component
        this.render();
    }

    onMount() {
        this._backBtn.addEventListener("click", this._onBackBtnClicked.bind(this))
    }

    onUnmount() {
        this._backBtn.removeEventListener("click", this._onBackBtnClicked.bind(this))
    }

    /**
     * fires when back btn clicked
     * @private
     */
    _onBackBtnClicked(){
        this.emit(APP_EVENTS.CHAT_BOX_BACK_CLICKED);
    }

    /**
     * render component according to template and attributes
     */
    render() {

        // check the existence of avatar
        // fetch first char of name to show if avatar not passed
        if (!this.getAttribute("avatar")) {
            // put first char of name when avatar not passed
            const name = (this.getAttribute("name") || "").toUpperCase();
            this.shadowRoot.querySelector(".char-avatar").innerText = name.substr(0, 1);
        }

        // loop over attributes and set all
        for (let attr of this.attributes) {
            const target = this.shadowRoot.getElementById(attr.name);
            if (!target)
                continue;

            switch (attr.name) {
                case "name":
                    target.innerText = attr.value;
                    break;
                case "avatar":
                    target.src = attr.value;
                    break;
            }

        }
    }

}

// define active-chat tag name
customElements.define(ActiveChat.tagName, ActiveChat);
