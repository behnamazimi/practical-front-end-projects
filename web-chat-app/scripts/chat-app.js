// connection between components is with events and
// this const object is for keeping all event types in one place to easy access
window.APP_EVENTS = {
    PROFILE_BTN_CLICK: "profile-btn-click",
    CHAT_CLICKED: "chat-clicked",
    CHAT_SELECTED: "chat-selected",
    AUTHED_USER_NEW_MESSAGE: "authed-user-new-message",
    USER_SIGN_IN: "user-sign-in",
    SEARCH_IN_CHATS: "search-in-chats",
    NEW_MESSAGE_RECEIVE: "new-message-receive",
    CHAT_BOX_BACK_CLICKED: "chat-box-back-clicked",
    DESELECT_SELECTED_CHAT: "deselect-selected-chat",
};

/**
 * This class controls the whole app
 */
class ChatApp {

    /**
     * this receive the id of container of app and get it
     * the container is required to run app
     * @param appId
     */
    constructor(appId) {
        // check the existence of appId
        this.assert(appId, "app container id not passed.");
        this._app = document.getElementById(appId);
        // check the existence of container
        this.assert(this._app, `Container with id "${appId}" not found. `);

        this._authedUser = null;
        this._chats = [];
        this._messages = [];
        this._componenets = {};

        // find and assign required app-components
        this.assignComponents();

        // initialize listeners
        this.initListeners();

        // render the existed chats
        this.sendChatsToList();
    }

    /**
     * Find main components and assign it to this._components property
     * It's just for remove duplication, after this, we access all components
     * in this._components without re-select from DOM and just
     */
    assignComponents() {
        this._componenets.authedUser = document.querySelector("authed-user");
        this._componenets.appBranch = document.querySelector("app-brand");
        this._componenets.chatsList = document.querySelector("chats-list");
        this._componenets.chatBox = document.querySelector("chat-box");
    }

    /**
     * This method is for initializing required events
     */
    initListeners() {
        this._componenets.appBranch.on(APP_EVENTS.PROFILE_BTN_CLICK, this._onProfileBtnClick.bind(this));
        this._componenets.chatsList.on(APP_EVENTS.CHAT_SELECTED, this._onChatSelected.bind(this));
        this._componenets.chatBox.on(APP_EVENTS.AUTHED_USER_NEW_MESSAGE, this._onAuthedUserNewMessages.bind(this));
        this._componenets.chatBox.on(APP_EVENTS.CHAT_BOX_BACK_CLICKED, this._onChatBoxBack.bind(this));
    }

    /**
     * To simulate sign-in, use this method.
     * Logged in user object should pass to this.
     * @param user
     */
    signin(user) {
        // check the validity of user object
        this.assert(user && user.id, "Invalid user object");
        this._authedUser = user;

        // after sign-in we need to set active user on authedUser component
        // and make it hidden by default
        // and tell the chatBox component that a user is signed-in
        this._componenets.authedUser.setUser(this._authedUser);
        this._componenets.authedUser.hidden = true;
        this._componenets.chatBox.emit(APP_EVENTS.USER_SIGN_IN, {id: user.id});
    }

    /**
     * use this method to send message to app
     * @param msg {{time: Date, sender: String, text: String, toChat: String}}
     */
    newMessage(msg) {
        // check the validity of received msg object
        this.assert(msg && msg.time && msg.sender && msg.text && msg.toChat,
            `Invalid message object.`);

        // push to messages pool
        this._messages.push(msg);

        // we need to check the sender of new message, if it send by logged in
        // user we should tell chatBox to render the message too.
        if (this.activeChat && msg.sender === this.activeChat.id) {
            this._componenets.chatBox.renderMessage(msg);
        }
        // also we need to send received message to chatsList component
        this._componenets.chatsList.emit(APP_EVENTS.NEW_MESSAGE_RECEIVE, msg);
    }

    /**
     * getter for this._authedUser
     * @returns {Object}
     */
    get authedUser() {
        return this._authedUser;
    }

    /**
     * handle profile section visibility on profile-btn click
     * @private
     */
    _onProfileBtnClick() {
        // toggle the visibility of authedUser component
        this._componenets.authedUser.hidden = !this._componenets.authedUser.hidden
    }

    /**
     * this method fire when a chat selected.
     * it find the messages of target chat and send those to chatBox to render
     * @param detail
     * @private
     */
    _onChatSelected({detail}) {
        // find all messages of selected chat
        const chatMessaged = this._messages.filter(m => m.sender === detail.id || m.toChat === detail.id);

        // set selected chat as activeChat of whole app
        this.activeChat = this._chats.find(c => c.id === detail.id);

        // if the chatBox if open for activeChat, scroll content to end
        if (this._componenets.chatBox.activeChat && this._componenets.chatBox.activeChat.id === this.activeChat.id) {
            this._componenets.chatBox.scrollToEnd();
            return;
        }

        // mark all messages as read and remove unread badge for selected chat
        this.activeChat.elm.markAllAsRead();
        // change the current chat of chatBox component
        this._componenets.chatBox.setActiveChat(this.activeChat);

        // send all messages of target chat to render in chatBox
        chatMessaged.map(msg => {
            this._componenets.chatBox.renderMessage(msg)
        })
    }

    /**
     * this method fire when a new message from signed in user sent to a chat
     * @param detail
     * @private
     */
    _onAuthedUserNewMessages({detail}) {
        // add sender property to message and
        // push it to the messages pool
        this._messages.push({...detail, sender: this.authedUser.id})
    }

    /**
     * fires when back btn clicked in chat-box
     * @private
     */
    _onChatBoxBack() {
        this._componenets.chatsList.emit(APP_EVENTS.DESELECT_SELECTED_CHAT);
    }

    /**
     * send chats to chatList
     */
    sendChatsToList() {
        if (!this._chats)
            return;

        this._componenets.chatsList.setChats(this._chats)
    }

    /**
     * use this method to add new chat to whole app
     * @param chat
     */
    addChat(chat) {
        // check the validity of chat object
        this.assert(chat && chat.id, `Invalid chat object.`);

        // update chats array
        this._chats.push(chat);

        this.sendChatsToList();
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
