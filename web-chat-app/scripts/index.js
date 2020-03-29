import ChatApp from "./chat-app"
import {chatGenerator, randomNumber} from "./data-factory";

let fakeChats = [];
for (let i = 1; i < 50; i++) {
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

let a = setInterval(() => {
    const fakeSender = fakeChats[randomNumber(50, 1)];
    if (!fakeSender)
        return;

    app.newMessage({
        text: app.getRandomText(),
        sender: fakeSender.id,
        time: new Date(),
        toChat: authedUser.id
    });

}, 1500);
