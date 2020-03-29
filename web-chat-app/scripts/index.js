const numberOfChats = 10;
let fakeChats = [];
for (let i = 1; i < numberOfChats; i++) {
    fakeChats.push(chatGenerator(i))
}


const authedUser = {
    id: Math.random().toString(32).substr(2, 10),
    name: "Behnam Azimi",
    username: "bhnmzm",
    online: true,
    lastSeen: "Today",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
};

const app = new ChatApp("chat-web-app");
app.signin(authedUser);

fakeChats.map(fc => app.addChat(fc));

let fakeMsgCounter = 1000;

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
    }, randomNumber(1000, 5000))

}, 500);
