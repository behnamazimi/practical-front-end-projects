import Component from "./component";


class ChatsList extends Component {

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
        return super.getObservedAttrs(ChatsList.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatsList.name);
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
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        min-height: 0;
                        overflow: hidden;
                    }
                    * {
                        box-sizing: border-box;
                        user-select: none;                        
                    }
                    .scrollable {
                        width: 100%;
                        height: 100%;
                        max-height: 100%;
                        position: relative;
                        overflow: hidden;
                        overflow-y: auto;
                        min-height: 0;
                    }
                    #chats-wrapper {
                        overflow: hidden;
                        overflow-y: auto;
                        height: 100%;
                        margin-right: -12px;
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
                ${ChatsList.style}
                <div class="scrollable">
                    <div id="chats-wrapper"></div>
                </div>  
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatsList.attrTypes,
            template: ChatsList.template
        });

        this.chatsWrapper = this.shadowRoot.getElementById("chats-wrapper")

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

    setChats(chats) {
        this._chats = chats;

        this.render();
    }

    get chats() {
        return this._chats;
    }

    generateChatListItem(chat) {
        const chatListItem = document.createElement("chat-list-item");
        chatListItem.setAttribute("id", chat.id);
        chatListItem.setAttribute("title", chat.title);
        chatListItem.setAttribute("avatar", chat.avatar);
        chatListItem.setAttribute("desc", chat.desc);
        chatListItem.setAttribute("lastseen", chat.lastseen);
        chatListItem.setAttribute("unreadcount", chat.unreadcount);
        if (chat.online)
            chatListItem.setAttribute("online", '');

        return chatListItem
    }

    /**
     * render component according to template and attributes
     */
    render() {

        this.chats.map(chat => {
            this.chatsWrapper.appendChild(this.generateChatListItem(chat))
        })
    }

}

customElements.define(ChatsList.tagName, ChatsList);
