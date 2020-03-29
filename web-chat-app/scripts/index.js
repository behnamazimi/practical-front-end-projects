import ChatApp from "./chat-app"
import {chatGenerator, getRandomText, randomNumber} from "./data-factory";

let fakeChats = [];
for (let i = 1; i < 10; i++) {
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

setInterval(() => {
    const fakeSender = fakeChats[randomNumber(10, 1)];
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

}, 1500);
