window.APP_EVENTS = {
    PROFILE_BTN_CLICK: "profile-btn-click",
    CHAT_CLICKED: "chat-clicked",
    CHAT_SELECTED: "chat-selected",
    AUTHED_USER_NEW_MESSAGE: "authed-user-new-message",
    USER_SIGN_IN: "user-sign-in",
    SEARCH_IN_CHATS: "search-in-chats",
    NEW_MESSAGE_RECEIVE: "new-message-receive",
};

class ChatApp {


    constructor(appId) {
        this.assert(appId, "app container id not passed.");
        this._app = document.getElementById(appId);
        this.assert(this._app, `Container with id "${appId}" not found. `);

        this._authedUser = null;
        this._chats = [];
        this._messages = [];
        this._componenets = {};
        this._searchInChatsTrend = '';
        this.assignComponents();

        this.initListeners();

        this.renderChats();
    }

    assignComponents() {
        this._componenets.authedUser = document.querySelector("authed-user");
        this._componenets.appBranch = document.querySelector("app-brand");
        this._componenets.chatsList = document.querySelector("chats-list");
        this._componenets.chatBox = document.querySelector("chat-box");
    }

    initListeners() {
        this._componenets.appBranch.on(APP_EVENTS.PROFILE_BTN_CLICK, this._onProfileBtnClick.bind(this));
        this._componenets.chatsList.on(APP_EVENTS.CHAT_SELECTED, this._onChatSelected.bind(this));
        this._componenets.chatsList.on(APP_EVENTS.SEARCH_IN_CHATS, this._onSearchInChats.bind(this));
        this._componenets.chatBox.on(APP_EVENTS.AUTHED_USER_NEW_MESSAGE, this._onAuthedUserNewMessages.bind(this));
    }

    _onProfileBtnClick() {
        this._componenets.authedUser.hidden = !this._componenets.authedUser.hidden
    }

    signin(user) {
        this.assert(user && user.id, "Invalid user object");
        this._authedUser = user;

        this._componenets.authedUser.setUser(this._authedUser);
        this._componenets.authedUser.hidden = true;
        this._componenets.chatBox.emit(APP_EVENTS.USER_SIGN_IN, {id: user.id});
    }

    newMessage(msg) {
        this.assert(msg && msg.time && msg.sender && msg.text && msg.toChat,
            `Invalid message object.`);

        this._messages.push(msg);
        if (this.activeChat && msg.sender === this.activeChat.id) {
            this._componenets.chatBox.renderMessage(msg);
        }

        this._componenets.chatsList.emit(APP_EVENTS.NEW_MESSAGE_RECEIVE, msg);
    }


    get authedUser() {
        return this._authedUser;
    }

    _onChatSelected({detail}) {
        const chatMessaged = this._messages.filter(m => m.sender === detail.id || m.toChat === detail.id);
        this.activeChat = this._chats.find(c => c.id === detail.id);
        if (this._componenets.chatBox.activeChat && this._componenets.chatBox.activeChat.id === this.activeChat.id) {
            this._componenets.chatBox.scrollToEnd();
            return;
        }

        this.activeChat.elm.markAllAsRead();
        this._componenets.chatBox.setActiveChat(this.activeChat);
        chatMessaged.map(msg => {
            this._componenets.chatBox.renderMessage(msg)
        })
    }

    _onSearchInChats({detail}) {
        this._searchInChatsTrend = (detail.trend || '').toLocaleString();
        this.renderChats();
    }

    _onAuthedUserNewMessages({detail}) {
        this._messages.push({...detail, sender: this.authedUser.id})
    }

    renderChats() {
        if (!this._chats)
            return;

        const filteredChats = this._chats
            .filter(c => ~c.name.toLowerCase().indexOf(this._searchInChatsTrend)
                || ~c.username.toLowerCase().indexOf(this._searchInChatsTrend));

        this._componenets.chatsList.setChats(filteredChats)
    }

    addChat(chat) {
        this.assert(chat && chat.id, `Invalid chat object.`);

        if (chat.messages && chat.messages.length) {
            const lastMessage = chat.messages[chat.messages.length - 1];
            chat.desc = (lastMessage.text || '').substr(0, 25)
        }
        this._chats.push(chat);

        this.renderChats();
    }

    getRandomText() {
        const lorem = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
        const i1 = Math.floor(Math.random() * lorem.length + 1);
        const i2 = Math.floor(Math.random() * lorem.length + 1);
        const start = Math.min(i1, i2);
        const end = Math.min(i2, i1);
        return lorem.substr(start, end)
    }

    /**
     * to check condition and fire event if its false
     * @param condition
     * @param error
     */
    assert(condition, error) {
        if (!condition)
            throw new Error(`${error}`)
    }
}

export default ChatApp
