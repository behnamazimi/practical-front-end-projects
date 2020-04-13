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
        this._selectedChat = null;

    }

    // call on mounting
    onMount() {
        this.initListeners();
    }

    // call on un-mounting
    onUnmount() {
        this.removeListeners();
    }

    /**
     * Initialize required listeners
     */
    initListeners() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
        this._searchInput.addEventListener("input", this._onSearch.bind(this));
        this.on(APP_EVENTS.NEW_MESSAGE_RECEIVE, this._onNewMessageReceive.bind(this));
        this.on(APP_EVENTS.DESELECT_SELECTED_CHAT, this._onChatDeselect.bind(this));
    }

    /**
     * remove added listeners
     */
    removeListeners() {
        document.removeEventListener("keydown", this._onKeyDown.bind(this))
    }

    /**
     * Listen document keypress to handle Ctrl + F keys and focus on search box
     * @param e
     * @private
     */
    _onKeyDown(e) {
        if (e.ctrlKey && e.key === "f") {
            e.preventDefault();
            this._searchInput.focus();
        }
    }

    /**
     * fires on search input change and call render on every 300ms
     * @param e
     * @private
     */
    _onSearch(e) {
        if (this._searchDebounceFlag)
            clearTimeout(this._searchDebounceFlag);

        this._searchDebounceFlag = setTimeout(() => {
            this.render();
        }, 300);
    }

    /**
     * fires when a new message received, and handle the
     * position changing of chat that send/receive message
     * also, handle the unread message count of the chat.
     * @param detail
     * @private
     */
    _onNewMessageReceive({detail}) {
        if (!detail.sender)
            return;

        // actually here we find the target chat and
        // remove it's element from chats-list DOM,
        // update the unread messages count,
        // generate a new element for it and append it
        // as the first child of chats-list
        const senderChatIndex = this._chats.findIndex(c => c.id === detail.sender);
        const senderChat = this._chats.splice(senderChatIndex, 1)[0];

        // update unread messages count
        senderChat.unreadcount = (+senderChat.unreadcount || 0) + 1;

        // check the selection status of chat to apply it on the new element
        const alreadySelected = senderChat.elm.selected;

        // remove previous element of chat
        senderChat.elm.remove();

        // generate new element for updated chat
        senderChat.elm = this.generateChatListItem(senderChat);

        senderChat.elm.selected = alreadySelected;

        // push the updated chat to the start of the chats array
        this._chats.unshift(senderChat);

        // append the updated chat to chatsList as the first child in the list
        this.appendChatToList(senderChat, true);
    }

    /**
     * this method call from parent component to set the chats array
     * every time, it makes the this.chatsWrapper empty and calls the render method
     * @param chats
     */
    setChats(chats) {
        this._chats = chats;
        this.chatsWrapper.innerHTML = '';
        this.render();
    }

    /**
     * this method generate chat-list-item component for chat object
     * @param chat
     * @returns {HTMLElement}
     */
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

        // set the click listener of newly created component
        chatListItem.on(APP_EVENTS.CHAT_CLICKED, this._onChatClicked.bind(this));

        return chatListItem
    }

    /**
     * this method calls when component received a message to clear selection
     * @private
     */
    _onChatDeselect() {
        if (!this._selectedChat)
            return;

        this._selectedChat.elm.selected = false;
        this._selectedChat = null;

        this.render();
    }

    /**
     * fires when a chat-item-list has been clicked
     * @param detail
     * @private
     */
    _onChatClicked({detail}) {

        this._selectedChat = null;
        // we loop over chats to reset unread message counter
        // of clicked chat and remove selection of other chats
        this._chats.map(chat => {
            if (chat.id !== detail.id) {
                chat.elm.selected = false;
                this._selectedChat = chat;
            } else {
                chat.unreadcount = 0;
            }
        });

        // send the clicked chat-item details to parent component
        this.emit(APP_EVENTS.CHAT_SELECTED, detail)
    }

    /**
     * this method controls the adding of chat to the this.chatsWrapper element
     * also, the searching action happens here. it filters the chat with the value of search input
     * @param chat
     * @param appendFirst
     */
    appendChatToList(chat, appendFirst = false) {
        const searchTrend = (this._searchInput.value || '').toLowerCase();

        // check if the chat.name or chat.username contains the value of search input or not
        if (~chat.name.toLowerCase().indexOf(searchTrend)
            || ~chat.username.toLowerCase().indexOf(searchTrend)) {

            if (!appendFirst) { // append at the end of the list
                this.chatsWrapper.appendChild(chat.elm);

            } else { // append as the first child of the list
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

            // generate chat-list-item component for the chat object
            chat.elm = this.generateChatListItem(chat);

            // append chat to list
            this.appendChatToList(chat);

            return chat
        })
    }

}

// define chats-list tag name
customElements.define(ChatsList.tagName, ChatsList);
