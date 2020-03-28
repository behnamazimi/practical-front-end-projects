import Component from "./component";

class ChatMessage extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            sender: {
                type: "string",
                observe: true
            },
            position: {
                type: "string",
                observe: true
            },
            lastingroup: {
                type: "boolean",
                observe: true
            },
            text: {
                type: "boolean",
                observe: true
            },
            time: {
                type: "string",
                observe: true
            },
        };
    }

    /**
     * generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(ChatMessage.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatMessage.name);
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
                    position: relative;
                    display: block;
                    background: #fff;
                    border-radius: 8px;
                    margin: 0 0 .3em 0; 
                    padding: .5em .5em 1em;
                }
                :host([hidden]) {
                    display: none;
                }
                * {
                    box-sizing: content-box;
                    user-select: none;                        
                }
                :host([position=left]),
                :host([position=right]) {
                    max-width: 50%;
                    margin-right: .5rem;
                    margin-left: auto;
                    width: auto;
                    min-width: 150px;
                    background-color: var(--primaryColor);
                    color: #fff;
                    box-shadow: -1px 1px 3px 0 rgba(0, 0, 0, 0.14);
                }
                :host([position=left]) {
                    margin-left: .5rem;
                    margin-right: auto;
                    background-color: #fff;
                    color: #444;
                    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.14);
                }
                :host([lastingroup]) {
                    margin-bottom: 1em;
                }
                :host([position=left][lastingroup]):before,
                :host([position=right][lastingroup]):before {
                    content: '';
                    display: block;
                    width: .25rem;
                    height: .5rem;
                    position: absolute;
                    left: calc(100% - .4em);
                    bottom: 0;
                    border-bottom: .5rem solid var(--primaryColor);
                    border-right: .5rem solid transparent;
                }
                :host([position=left][lastingroup]):before{
                    border-bottom: .5rem solid #fff;
                    border-left: .5rem solid transparent;
                    border-right: none;
                    left: -.4em;
                }
                #text {
                    font-size: 16px;
                    line-height: 20px;
                    margin: 0 0 .2em;                    
                }
                #time {
                    font-size: 12px;
                    opacity: .7;
                    position: absolute;
                    right: .5em;
                    bottom: .3em;
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
                ${ChatMessage.style}
                <p id="text"></p>
                <span id="time"></span>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatMessage.attrTypes,
            template: ChatMessage.template
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

    set text(value) {
        if (value) {
            this.setAttribute('text', value);
        } else {
            this.removeAttribute('text');
        }
    }

    get text() {
        return this.getAttribute('text');
    }

    set time(value) {
        if (value) {
            this.setAttribute('time', value);
        } else {
            this.removeAttribute('time');
        }
    }

    get time() {
        return this.getAttribute('time');
    }

    set sender(value) {
        if (value) {
            this.setAttribute('sender', value);
        } else {
            this.removeAttribute('sender');
        }
    }

    get sender() {
        return this.getAttribute('sender');
    }

    set isLastInGroup(value) {
        if (value) {
            this.setAttribute('lastingroup', '');
            console.log(this.previousSibling);
        } else {
            this.removeAttribute('lastingroup');
        }
    }

    get isLastInGroup() {
        return this.hasAttribute('lastingroup');
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

    render() {

        this.shadowRoot.getElementById("text").innerHTML = this.text;
        this.shadowRoot.getElementById("time").innerHTML = this.time;
    }

}

customElements.define(ChatMessage.tagName, ChatMessage);
