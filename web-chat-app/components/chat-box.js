import Component from "./component";

class ChatBox extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            activeChat: {
                type: "boolean",
                observe: true
            },
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
                    --primaryColor:  #3AD07A;
                    --hoverColor: #edfbf3;
                    display: block;
                    height: 100%;
                    max-height: 100%;
                }
                :host([hidden]) {
                    display: none;
                }
                * {
                    box-sizing: border-box;
                    user-select: none;                        
                }
                .chat-box-inner {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .chat-box-inner .chat-list-wrapper {
                    position: relative;
                    background: #3ad07a1f url(../static/chat-box-bg.png);
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
                    padding: 1em 1em 1.5em;
                    display: grid;
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
                    box-shadow: 0px -2px 10px 1px rgba(0,0,0,0.16);
                }
                .chat-day {
                    margin: 2em 0;
                    text-align: center; 
                }
                .chat-day span{
                    font-size: 14px;
                    padding: .5rem 1.5rem;
                    border-radius: 25px;
                    background: rgba(0,0,0,.2);
                    color: #fff;
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
                ${ChatBox.style}
                <div class="chat-box-inner">
                    <active-chat></active-chat>
                    <div class="chat-list-wrapper">
                        <div class="scrollable" id="chat-list">
                            
                        </div>
                    </div>
                    <new-message></new-message>
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

    set activeChat(chat) {
        this._activeChat = chat;

        this.renderChatBoxHeader();
    }

    get activeChat() {
        return this._activeChat;
    }

    initListeners() {
        this.on("new-message", this._onMessageReceive.bind(this));
        this._newMessageBox.on("new-message", this._onMessageReceive.bind(this))
    }

    removeListeners() {
        this._newMessageBox.off("new-message", this._onMessageReceive.bind(this))
    }

    _onMessageReceive({detail}) {
        const {sender, message, time} = detail;
        const isFromUser = sender === window.loggenInUser.id;
        const isSameSender = this.lastMessage && this.lastMessage.sender === sender;

        this.assert(time instanceof Date, "Message time is not a real Date object");

        const timeToShow = `${time.getHours()}:${time.getMinutes()}`;

        const msg = document.createElement("chat-message");
        msg.setAttribute("text", message);
        msg.setAttribute("position", isFromUser ? "right" : "left");
        msg.setAttribute("sender", sender);
        msg.setTimeObject(time);
        msg.setAttribute("time", timeToShow);
        msg.setAttribute("title", time.toLocaleString());
        msg.isLastInGroup = true;

        if (this.lastMessage && isSameSender)
            this.lastMessage.isLastInGroup = false;

        console.log(this._isMessageForDifferentDay(time));
        if (!this.lastMessage || this._isMessageForDifferentDay(time)) {
            this._appendDateToChatList(time);
        }

        this.lastMessage = msg;
        this._chatList.appendChild(msg);

        this._newMessageBox.clear();

        this.scrollToEnd();

    }

    _isMessageForDifferentDay(time) {
        if (!this.lastMessage || !time)
            return false;

        return time.toDateString() !== this.lastMessage.timeObject.toDateString();
    }

    _appendDateToChatList(time) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.assert(time, "Message time not passed");

        let dayTitle = `${monthNames[time.getMonth()]} ${time.getDay()}, ${time.getFullYear()}`;
        if (time.toDateString() === new Date().toDateString())
            dayTitle = "Today";

        const dateNode = document.createElement("div");
        dateNode.classList.add("chat-day");
        dateNode.innerHTML = `<span>${dayTitle}</span>`;

        this._chatList.appendChild(dateNode);
    }

    /**
     * scroll the chat list to the end
     */
    scrollToEnd() {
        this._chatList.scrollTo({
            top: this._chatList.scrollHeight,
        })
    }

    renderChatBoxHeader() {
        const activeChatNode = this.shadowRoot.querySelector("active-chat");
        this.assert(activeChatNode, "The active-chat node not found in chat-box");

        activeChatNode.setAttribute("id", this._activeChat.id);
        activeChatNode.setAttribute("title", this._activeChat.title);
        activeChatNode.setAttribute("avatar", this._activeChat.avatar || "");
        if (this._activeChat.online)
            activeChatNode.setAttribute("online", '');
        else
            activeChatNode.removeAttribute("online");
    }

    render() {

        this._newMessageBox = this.shadowRoot.querySelector("new-message");

        if (this.readOnly) {
            this._newMessageBox.remove();
        }

        this.scrollToEnd();
    }

}

customElements.define(ChatBox.tagName, ChatBox);
