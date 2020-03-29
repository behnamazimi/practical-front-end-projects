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
                        padding: .5em 0;
                    }
                    .search-wrapper {
                        margin-top: .3em;
                        padding: .5rem;
                    }
                    #search-input {
                        border: 1px solid #e0e0e0;
                        background-color: #f9f9f9;
                        height: 36px;
                        border-radius: 25px;
                        width: 100%;
                        outline: none;
                        padding: .2em 1em;
                        font-family: 'Lato', sans-serif;
                        color: #555;
                    }
                    #search-input:focus {
                        box-shadow: 0 0 3px 1px #3ad07a;
                    }
                    #search-input::placeholder {
                        opacity: .5;
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
                <div class="search-wrapper">
                    <input type="search" id="search-input" placeholder="Search">   
                </div>
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

        this.chatsWrapper = this.shadowRoot.getElementById("chats-wrapper");
        this._searchInput = this.shadowRoot.getElementById("search-input");
        this._searchDebounceFlag = null;
    }

    onMount() {
        this.initListeners();
    }

    onUnmount() {
        this.removeListeners();
    }

    initListeners() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
        this._searchInput.addEventListener("input", this._onSearch.bind(this));
        this.on(APP_EVENTS.NEW_MESSAGE_RECEIVE, this._onNewMessageReceive.bind(this));
    }

    removeListeners() {
        document.removeEventListener("keydown", this._onKeyDown.bind(this))
    }

    _onKeyDown(e) {
        if (e.ctrlKey && e.key === "f") {
            e.preventDefault();
            this._searchInput.focus();
        }
    }

    _onSearch(e) {
        if (this._searchDebounceFlag)
            clearTimeout(this._searchDebounceFlag);

        this._searchDebounceFlag = setTimeout(() => {
            this.render();
        }, 300);
    }

    _onNewMessageReceive({detail}) {
        if (!detail.sender)
            return;

        const senderChatIndex = this._chats.findIndex(c => c.id === detail.sender);
        const senderChat = this._chats.splice(senderChatIndex, 1)[0];

        // update unread message
        senderChat.unreadcount = (+senderChat.unreadcount || 0) + 1;
        const alreadySelected = senderChat.elm.selected;

        senderChat.elm.remove();
        senderChat.elm = this.generateChatListItem(senderChat);
        senderChat.elm.selected = alreadySelected;
        this._chats.unshift(senderChat);

        this.appendChatToList(senderChat, true);
    }

    setChats(chats) {
        this._chats = chats;
        this.chatsWrapper.innerHTML = '';
        this.render();
    }

    generateChatListItem(chat) {
        const chatListItem = document.createElement("chat-list-item");
        chatListItem.setAttribute("id", chat.id);
        chatListItem.setAttribute("title", chat.name);
        chatListItem.setAttribute("name", chat.name);
        chatListItem.setAttribute("avatar", chat.avatar);
        chatListItem.setAttribute("desc", chat.desc || chat.username);
        chatListItem.setAttribute("lastseen", chat.lastseen);
        chatListItem.setAttribute("unreadcount", chat.unreadcount);
        if (chat.online)
            chatListItem.setAttribute("online", '');

        chatListItem.on(APP_EVENTS.CHAT_CLICKED, this._onChatClicked.bind(this));

        return chatListItem
    }

    _onChatClicked({detail}) {
        this._chats.map(chat => {
            if (chat.id !== detail.id)
                chat.elm.selected = false;
            else
                chat.unreadcount = 0;
        });

        this.emit(APP_EVENTS.CHAT_SELECTED, detail)
    }

    appendChatToList(chat, appendFirst = false) {
        const searchTrend = (this._searchInput.value || '').toLowerCase();
        if (~chat.name.toLowerCase().indexOf(searchTrend)
            || ~chat.username.toLowerCase().indexOf(searchTrend)) {

            if (!appendFirst) {
                this.chatsWrapper.appendChild(chat.elm);
            } else {
                this.chatsWrapper.insertBefore(chat.elm, this.chatsWrapper.firstChild);
            }
        }
    }

    /**
     * render component according to template and attributes
     */
    render() {
        this.chatsWrapper.innerHTML = '';
        this._chats = this._chats.map(chat => {
            chat.elm = this.generateChatListItem(chat);

            this.appendChatToList(chat);

            return chat
        })
    }

}

customElements.define(ChatsList.tagName, ChatsList);
