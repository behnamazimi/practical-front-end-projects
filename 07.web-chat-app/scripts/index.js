const NUMBER_OF_CHATS = 10;
let fakeChats = [];

// Generate an array of fake chats to show in the app
for (let i = 1; i <= NUMBER_OF_CHATS; i++) {
    fakeChats.push(chatGenerator(i));
}

// Signed-in user object
const authedUser = {
    id: '12',
    name: 'Behnam Azimi',
    username: 'bhnmzm',
    online: true,
    lastSeen: 'Today',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
};

// Initialize the chat application
const app = new ChatApp('chat-web-app');
app.signin(authedUser);

// Add all generated chats to the app
fakeChats.forEach(chat => app.addChat(chat));

// Simulate receiving messages - send 100 messages at random intervals
let remainingMessages = 100;
const messageInterval = setInterval(() => {
    if (--remainingMessages === 0) {
        clearInterval(messageInterval);
        return;
    }

    setTimeout(() => {
        const senderChat = fakeChats[randomNumber(1, NUMBER_OF_CHATS)];
        if (!senderChat) return;

        // 20% chance to flag the message
        const isFlagged = Math.random() > 0.8;

        app.newMessage({
            text: getRandomText(Math.random() > 0.5),
            sender: isFlagged ? authedUser.id : senderChat.id,
            time: new Date(),
            toChat: isFlagged ? senderChat.id : authedUser.id
        });
    }, randomNumber(1000, 5000));
}, 1500);
