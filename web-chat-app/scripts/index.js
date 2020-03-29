import ChatApp from "./chat-app"

window.loggenInUser = {
    id: Math.random().toString(32).substr(2, 10),
    name: "Behnam Azimi",
    username: "bhnmzm",
    online: true,
    lastSeen: "Yesterday",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
};

const tempChat = {
    id: Math.random().toString(32).substr(2, 10),
    name: "Haniyeh Mahboubifar",
    username: "hanimf",
    online: true,
    lastseen: "Today",
    unreadcount: "0",
    avatar: "https://randomuser.me/api/portraits/women/53.jpg",
    messages: []
};

const tempChat2 = {
    id: Math.random().toString(32).substr(2, 10),
    name: "Hani Azimi",
    username: "hadihamze",
    online: false,
    lastseen: "Aug 12, 2019",
    unreadcount: "0",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    messages: []
};

const app = new ChatApp("chat-web-app");
app.signin(loggenInUser);
app.addChat(tempChat);
app.addChat(tempChat2);

app.newMessage({
    text: getMsgText(),
    sender: tempChat.id,
    time: new Date(),
    toChat: loggenInUser.id
});
app.newMessage({
    text: getMsgText(),
    sender: loggenInUser.id,
    toChat: tempChat.id,
    time: new Date(),
});
app.newMessage({
    text: getMsgText(),
    sender: tempChat.id,
    time: new Date(),
    toChat: loggenInUser.id
});
app.newMessage({
    text: getMsgText(),
    sender: tempChat.id,
    time: new Date(),
    toChat: loggenInUser.id
});

setTimeout(() => {
    app.newMessage({
        text: getMsgText(),
        sender: tempChat.id,
        time: new Date(),
        toChat: loggenInUser.id
    });

}, 2000);

/*
window.loggenInUser = {
    id: "3",
    name: "Behnam Azimi",
    username: "bhnmzm",
    online: true,
    lastSeen: "Yesterday",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg"
};

const chats = [
    {
        id: "3",
        title: "Behnam Azimi",
        online: true,
        lastseen: "Yesterday",
        unreadcount: "4",
        desc: "Received message shows here",
        avatar: "https://randomuser.me/api/portraits/men/10.jpg"
    },

];


const chatsList = document.querySelector("chats-list");
chatsList.setChats(chats);

const chatBox = document.querySelector("chat-box");
chatBox.activeChat = window.loggenInUser;
// document.querySelectorAll("chat-list-item")
//     .forEach(i => {
//         i.on("selected", (e) => {
//
//             // unselect other items
//             document.querySelectorAll("chat-list-item")
//                 .forEach(i => i.shadowRoot.host.selected = false);
//             //
//             // console.log(e.detail);
//             //
//             chatBox.emit("new-message", {
//                 message: getMsgText(),
//                 sender: "4",
//                 time: new Date()
//             })
//         })
//     });
*/

function getMsgText() {
    const lorem = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
    const i1 = Math.floor(Math.random() * lorem.length + 1);
    const i2 = Math.floor(Math.random() * lorem.length + 1);
    const start = Math.min(i1, i2);
    const end = Math.min(i2, i1);
    return lorem.substr(start, end)
}
