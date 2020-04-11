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
                type: "string",
                observe: true
            },
            audio: {
                type: "string",
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
                    box-sizing: border-box;
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
                    white-space: pre-line;          
                }
                #time {
                    font-size: 12px;
                    opacity: .7;
                    position: absolute;
                    right: .5em;
                    bottom: .3em;
                }
                #audio-play {
                    background-color: transparent;
                    border-radius: 50%;
                    border: 1px solid #fff;
                    color: #fff;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    outline: none;
                    cursor: pointer;
                }
                #audio-play svg {
                    margin-left: 2px;
                }
                #audio-play .pause-icon{
                    display: none;
                }
                #audio-play.playing .play-icon{
                    display: none;
                }
                #audio-play.playing .pause-icon{
                    display: inline-block;
                    margin-left: 0;
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
                <button id="audio-play">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="play-icon">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="pause-icon">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                </button>
                <span id="time"></span>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatMessage.attrTypes,
            template: ChatMessage.template
        });

        this._textElement = this.shadowRoot.getElementById("text");
        this._timeElement = this.shadowRoot.getElementById("time");
        this._audioPlayBtn = this.shadowRoot.getElementById("audio-play");

    }

    onMount() {
        this._audioPlayBtn.addEventListener("click", this._onAudioPlayBtnClick.bind(this))
    }

    onUnmount() {
        this._audioPlayBtn.removeEventListener("click", this._onAudioPlayBtnClick.bind(this))
    }

    // call on attributes changed
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        // re-render component
        this.render();
    }

    /**
     * reflect the text attr on HTML tag
     * @param value
     */
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

    /**
     * reflect the audio attr on HTML tag
     * @param value
     */
    set audio(value) {
        if (value) {
            this.setAttribute('audio', value);
            this._audioElement = new Audio(value);

            const onPause = () => {
                this._audioPlayBtn.classList.remove("playing");
            };

            const onPlay = () => {
                this._audioPlayBtn.classList.add("playing");
            };
            this._audioElement.onended = onPause;
            this._audioElement.onpause = onPause;
            this._audioElement.onplay = onPlay;
        } else {
            this.removeAttribute('audio');
        }
    }

    get audio() {
        return this.getAttribute('audio');
    }

    setTimeObject(value) {
        this._timeObject = value;
    }

    get timeObject() {
        return this._timeObject;
    }

    /**
     * reflect the time attr on HTML tag
     * @param value
     */
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

    /**
     * reflect the sender attr on HTML tag
     * @param value
     */
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

    /**
     * reflect the islastingroup attr on HTML tag
     * @param value
     */
    set isLastInGroup(value) {
        if (value) {
            this.setAttribute('lastingroup', '');
        } else {
            this.removeAttribute('lastingroup');
        }
    }

    get isLastInGroup() {
        return this.hasAttribute('lastingroup');
    }

    _onAudioPlayBtnClick() {
        if (!this._audioElement)
            return;

        if (this._audioElement.paused) {
            this._audioElement.play();
        } else {
            this._audioElement.pause();
        }
    }

    /**
     * render message by attributes
     */
    render() {
        this._textElement.innerHTML = this.text;
        this._timeElement.innerHTML = this.time;
        this._audioPlayBtn.style.display = this.audio ? "flex" : "none";
    }

}

// define chat-message tag name
customElements.define(ChatMessage.tagName, ChatMessage);
