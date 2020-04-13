const numberOfChats = 10;
let fakeChats = [];
// generate an array of fake chats to show in app
for (let i = 1; i < numberOfChats; i++) {
    fakeChats.push(chatGenerator(i))
}

// this is the signed-in user object
const authedUser = {
    id: '12',
    name: "Behnam Azimi",
    username: "bhnmzm",
    online: true,
    lastSeen: "Today",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
};

// create instance of ChatApp,
// this is the line that run application
const app = new ChatApp("chat-web-app");
app.signin(authedUser);

// add all generated chats to app one-by-one
fakeChats.map(fc => app.addChat(fc));


// below code is just for simulating message receive
// here we send 100 messages in different times ro app
let fakeMsgCounter = 100;
const interval = setInterval(() => {

    if (--fakeMsgCounter === 0) {
        clearInterval(interval);
        return;
    }

    setTimeout(() => {
        const fakeSender = fakeChats[randomNumber(numberOfChats, 1)];
        if (!fakeSender)
            return;

        // flag with a 20% probability
        const randomFlag = Math.random() > .8;

        app.newMessage({
            text: getRandomText(Math.random() > .5),
            sender: randomFlag ? authedUser.id : fakeSender.id,
            time: new Date(),
            toChat: randomFlag ? fakeSender.id : authedUser.id
        });

        // new message sending time can be dynamic, between 1s and 5s
    }, randomNumber(1000, 5000))

}, 1500);
