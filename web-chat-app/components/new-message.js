import Component from "./component";

class NewMessage extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {};
    }

    /**
     * generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(NewMessage.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(NewMessage.name);
    }

    /**
     * styles of component
     * @returns {string}
     */
    static get style() {
        return (`<style>
                :host {
                    display: flex;
                    --primaryColor:  #3AD07A;
                    --hoverColor: #edfbf3;
                }
                :host([hidden]) {
                    display: none;
                }
                * {
                    box-sizing: border-box;
                    user-select: none;                        
                }
                .input-wrapper {
                    width: 100%;
                    padding: .5em;
                }
                .input-wrapper textarea {
                    max-height: 200px;
                    min-height: 32px;
                    width: 100%;
                    max-width: 100%;
                    border: 1px solid #efefef;
                    padding: .5rem;
                    font-family: 'Lato', sans-serif;
                    font-size: 16px;
                    border-radius: 4px;
                    transition: all .2s;
                    color: #444;
                }
                .input-wrapper textarea:focus {
                    outline: none;
                    box-shadow: 0 0 3px 1px #3ad07a;
                }
                .input-wrapper textarea::placeholder {
                    opacity: .5;
                }
                .send-btn {
                    background: transparent;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    color: var(--primaryColor);
                    width: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .send-btn:focus,
                .send-btn:hover {
                    cursor: pointer;
                    background: #f2f2f2;
                    border-radius: 4px;
                }
                .actions-wrapper {
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    padding: .5em .5em .5em 0;
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
                ${NewMessage.style}
                <div class="input-wrapper">
                    <textarea name="new_message" id="new-message-input"
                        placeholder="write message here (Ctrl+Enter to send)"
                        tabindex="1"
                        rows="2"></textarea>
                </div>
                <div class="actions-wrapper">
                    <button class="send-btn" id="send-btn" tabindex="2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: NewMessage.attrTypes,
            template: NewMessage.template
        });

        this.render();
    }

    onMount() {
        this.initListeners();
    }

    onUnmount() {
        this.removeListeners();
    }

    initListeners() {
        this.addEventListener("keydown", this._onKeyPress.bind(this));
        this._sendButton.addEventListener("click", this._onSend.bind(this));
    }

    removeListeners() {
        this.removeEventListener("keydown", this._onKeyPress.bind(this));
        this._sendButton.removeEventListener("click", this._onSend.bind(this));
    }

    _onKeyPress(e) {
        if (e.ctrlKey && e.key.toLowerCase() === "enter") {
            this._onSend();
        }
    }

    _onSend() {

        if (!this._textarea.value) {
            this._textarea.focus();
            return;
        }

        this.emit(APP_EVENTS.AUTHED_USER_NEW_MESSAGE, {
            text: this._textarea.value.trim(),
            time: new Date(),
        })
    }


    get message() {
        return this._textarea.value;
    }

    clear() {
        this._textarea.value = "";
        this._textarea.focus();
    }

    render() {
        this._sendButton = this.shadowRoot.getElementById("send-btn");
        this._textarea = this.shadowRoot.getElementById("new-message-input");

    }

}

customElements.define(NewMessage.tagName, NewMessage);
