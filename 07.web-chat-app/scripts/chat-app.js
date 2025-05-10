// Centralized event types for easy access and consistency
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
 * Main class controlling the entire chat application
 */
class ChatApp {
  /**
   * @param {string} appId - ID of the container element for the app
   */
  constructor(appId) {
    this.assert(appId, "App container ID not provided.");
    this._appContainer = document.getElementById(appId);
    this.assert(this._appContainer, `Container with id "${appId}" not found.`);

    this._authedUser = null;
    this._chats = [];
    this._messages = [];
    this._components = {};

    this.assignComponents();
    this.initListeners();
    this.sendChatsToList();
  }

  /**
   * Assign main components from the DOM for easier access
   */
  assignComponents() {
    this._components.authedUser = document.querySelector("authed-user");
    this._components.appBranch = document.querySelector("app-brand");
    this._components.chatsList = document.querySelector("chats-list");
    this._components.chatBox = document.querySelector("chat-box");
  }

  /**
   * Initialize event listeners for key components
   */
  initListeners() {
    this._components.appBranch.on(APP_EVENTS.PROFILE_BTN_CLICK, this._onProfileBtnClick.bind(this));
    this._components.chatsList.on(APP_EVENTS.CHAT_SELECTED, this._onChatSelected.bind(this));
    this._components.chatBox.on(APP_EVENTS.AUTHED_USER_NEW_MESSAGE, this._onAuthedUserNewMessages.bind(this));
    this._components.chatBox.on(APP_EVENTS.CHAT_BOX_BACK_CLICKED, this._onChatBoxBack.bind(this));
  }

  /**
   * Sign in a user and set up the UI accordingly
   * @param {Object} user - User object with at least an 'id'
   */
  signin(user) {
    this.assert(user && user.id, "Invalid user object");
    this._authedUser = user;

    this._components.authedUser.setUser(this._authedUser);
    this._components.authedUser.hidden = true;

    this._components.chatBox.emit(APP_EVENTS.USER_SIGN_IN, { id: user.id });
  }

  /**
   * Handle incoming message
   * @param {Object} msg - Message object with time, sender, text, toChat
   */
  newMessage(msg) {
    this.assert(msg && msg.time && msg.sender && msg.text && msg.toChat, "Invalid message object.");

    this._messages.push(msg);

    // If the message belongs to the active chat, render it
    if (this.activeChat && msg.sender === this.activeChat.id) {
      this._components.chatBox.renderMessage(msg);
    }

    // Notify chats list about new message
    this._components.chatsList.emit(APP_EVENTS.NEW_MESSAGE_RECEIVE, msg);
  }

  /**
   * Getter for the authenticated user
   * @returns {Object}
   */
  get authedUser() {
    return this._authedUser;
  }

  /**
   * Toggle profile section visibility
   * @private
   */
  _onProfileBtnClick() {
    this._components.authedUser.hidden = !this._components.authedUser.hidden;
  }

  /**
   * Handle chat selection
   * @param {Object} event - Event with detail containing chat ID
   * @private
   */
  _onChatSelected({ detail }) {
    const chatId = detail.id;

    // Filter messages belonging to selected chat
    const chatMessages = this._messages.filter(
      (m) => m.sender === chatId || m.toChat === chatId
    );

    // Find chat object by ID
    this.activeChat = this._chats.find((c) => c.id === chatId);

    if (!this.activeChat) return;

    // If chat box is already showing this chat, scroll to end
    if (
      this._components.chatBox.activeChat &&
      this._components.chatBox.activeChat.id === this.activeChat.id
    ) {
      this._components.chatBox.scrollToEnd();
      return;
    }

    // Mark all messages as read for this chat
    this.activeChat.elm.markAllAsRead();

    // Set active chat in chatBox component
    this._components.chatBox.setActiveChat(this.activeChat);

    // Render all messages for this chat
    chatMessages.forEach((msg) => {
      this._components.chatBox.renderMessage(msg);
    });
  }

  /**
   * Handle new message from signed-in user
   * @param {Object} event - Event with detail containing message info
   * @private
   */
  _onAuthedUserNewMessages({ detail }) {
    this._messages.push({ ...detail, sender: this.authedUser.id });
  }

  /**
   * Handle the back button in the chat box
   * @private
   */
  _onChatBoxBack() {
    this._components.chatsList.emit(APP_EVENTS.DESELECT_SELECTED_CHAT);
  }

  /**
   * Send the current list of chats to the chat list component
   */
  sendChatsToList() {
    if (!this._chats) return;
    this._components.chatsList.setChats(this._chats);
  }

  /**
   * Add a new chat to the app
   * @param {Object} chat - Chat object with at least an 'id'
   */
  addChat(chat) {
    this.assert(chat && chat.id, "Invalid chat object.");
    this._chats.push(chat);
    this.sendChatsToList();
  }

  /**
   * Assertion helper
   * @param {boolean} condition
   * @param {string} message
   * @private
   */
  assert(condition, message) {
    if (!condition) throw new Error(message);
  }
}
