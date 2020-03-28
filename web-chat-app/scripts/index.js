window.loggenInUser = {
    id: "3",
    title: "Behnam Azimi",
    online: true,
    lastSeen: "Yesterday",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg"
};

const chatBox = document.querySelector("chat-box");
chatBox.activeChat = window.loggenInUser;
document.querySelectorAll("chat-list-item")
    .forEach(i => {
        i.on("selected", (e) => {

            // unselect other items
            // document.querySelectorAll("chat-list-item")
            //     .forEach(i => i.shadowRoot.host.selected = false);
            //
            // console.log(e.detail);

            chatBox.emit("new-message", {
                message: getMsgText(),
                sender: "4",
                time: new Date()
            })
        })
    });

setTimeout(()=>{
    chatBox.activeChat = {...loggenInUser, online: false}
}, 3000);


function getMsgText() {
    const lorem = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
    const i1 = Math.floor(Math.random() * lorem.length + 1);
    const i2 = Math.floor(Math.random() * lorem.length + 1);
    const start = Math.min(i1, i2);
    const end = Math.min(i2, i1);
    return lorem.substr(start, end)
}
