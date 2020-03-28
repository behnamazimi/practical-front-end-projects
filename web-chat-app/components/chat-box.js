import Component from "./component";

class ChatBox extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            readonly: {
                type: "boolean",
                observe: true
            }
        };
    }

    /**
     * generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(ChatBox.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatBox.name);
    }

    /**
     * styles of component
     * @returns {string}
     */
    static get style() {
        return (`<style>
                :host {
                    display: block;
                    height: 100%;
                }
                :host([hidden]) {
                    display: none;
                }
                * {
                    box-sizing: content-box;
                    user-select: none;                        
                }
                .chat-box-inner {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .chat-box-inner .chat-list-wrapper {
                    position: relative;
                    background: transparent url("https://mir-s3-cdn-cf.behance.net/project_modules/disp/2d9dd173426833.5c08f5634ff45.png");
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    min-height: 0;
                    overflow: hidden;
                }
                .chat-box-inner .scrollable {
                    position: relative;
                    overflow: hidden;
                    overflow-y: auto;
                    min-height: 0;
                    padding: 1em;
                }
                .chat-box-inner .chat-list-wrapper:before ,
                .chat-box-inner .chat-list-wrapper:after {
                    content: '';
                    position: absolute;
                    top: -2px;
                    width: 100%;
                    height: 1px;
                    box-shadow: 0px -2px 10px 3px rgba(0,0,0,0.16);
                    z-index: 1;
                }
                .chat-box-inner .chat-list-wrapper:after {
                    top: unset;
                    bottom: -2px;
                    box-shadow: 0px -2px 10px 3px rgba(0,0,0,0.16);
                }
                h1{margin:0;}
                </style>`)
    }

    /**
     * html template of component
     * @returns {string}
     */
    static get template() {
        return (`
            <template>
                ${ChatBox.style}
                <div class="chat-box-inner">
                    <slot name="chat-with"></slot>
                    <div class="chat-list-wrapper">
                        <div class="scrollable" id="chat-list">
                            
                            <h1>Chat here... 3</h1>
                            <h1>Chat here... 4</h1>
                            <h1>Chat here... 1</h1>
                            <h1>Chat here... 2</h1>
                            <h1>Chat here... 3</h1>
                            <h1>Chat here... 4</h1>
                            <h1>Chat here... 1</h1>
                            <h1>Chat here... 2</h1>
                            <h1>Chat here... 3</h1>
                            <h1>Chat here... 44444</h1>
                        </div>
                    </div>
                    <slot name="messaging"></slot>
                </div>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatBox.attrTypes,
            template: ChatBox.template
        });

        this._chatList = this.shadowRoot.getElementById("chat-list");

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

    set readOnly(value) {
        if (value) {
            this.setAttribute('readonly', '');

        } else {
            this.removeAttribute('readonly');
        }
    }

    get readOnly() {
        return this.hasAttribute('readonly');
    }

    initListeners() {
        this.on("add-chat", this._onChatAdd)
    }

    removeListeners() {
        this.off("add-chat", this._onChatAdd)
    }

    _onChatAdd(e) {
        const n = document.createElement("h1");
        n.innerText = e.detail.text;
        this._chatList.appendChild(n);
        this.scrollToEnd();
    }

    /**
     * scroll the chat list to the end
     */
    scrollToEnd() {
        this._chatList.scrollTo({
            top: this._chatList.scrollHeight,
        })
    }

    render() {

        this.scrollToEnd();

        if (this.readOnly) {
            this.shadowRoot.querySelector("slot[name=messaging]").remove();
        }

    }

}

customElements.define(ChatBox.tagName, ChatBox);
