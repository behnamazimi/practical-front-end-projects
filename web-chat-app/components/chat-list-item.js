class ChatListItem extends HTMLElement {

    constructor() {
        super();

        // get template note
        const template = this.getTemplateContent();

        // generate shadow dom
        this.shadowRoot = this.attachShadow({mode: 'open'})
            .appendChild(template);

        this.render();

    }

    getTemplateContent() {
        const templateId = "chat-list-item-template";

        this._template =
            `
            <template id="${templateId}">
                <style>
                    :root {
                    }
                    * {
                        box-sizing: content-box;
                        user-select: none;                        
                    }
                    .chat-list-item {
                        --primaryColor:  #3AD07A;
                        --hoverColor: #edfbf3;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding: 1em;
                        position: relative;
                        cursor: pointer;
                    }
                    .chat-list-item:hover,
                    .chat-list-item:hover .item-meta{
                        background: var(--hoverColor);
                    }
                    .chat-list-item.selected {
                        box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.1);
                    }
                    .avatar-container {
                        flex: 0 0 3em;
                        width: 3em;
                        height: 3em;
                        border-radius: 50%;
                        overflow: hidden;   
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 1em;
                        background: #efefef;
                        font-weight: bold;
                        font-size: 1em;
                        position: relative;
                    }
                    .avatar-container img {
                        max-width: 100%;
                    }
                    .online-badge {
                        position: absolute;
                        right: 10px;
                        bottom: 4px;
                        width: 8px;
                        height: 8px;
                        background: var(--primaryColor);
                        display: inline-block;
                        border-radius: 50%;
                        border: 1px solid #fff;
                        visibility: hidden;
                        opacity: 0;
                    }
                    .chat-list-item.online .online-badge {
                        visibility: visible;
                        opacity: 1;
                    }                    
                    .item-details {
                        flex: 0 1 100%;
                        position: relative;
                    }
                    #title {
                        margin: 0 0 .3em 0;
                        font-size: 1em;
                    }
                    #desc {
                        margin: 0;
                        font-size: .8em;
                        opacity: .4;
                        max-width: 80%;
                        overflow: hidden;
                        display: block;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .item-meta {
                        position: absolute;
                        right: 0;
                        top: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #fff;                    
                    }
                    #active-time {
                        font-size: .7em;
                        opacity: .5;
                        margin-right: 1em;
                    }
                    #msg-count {
                        background: var(--primaryColor);
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        text-align: center;
                        color: #fff;
                        font-size: .8em;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        visibility: hidden;
                        opacity: 0;
                    }
                    .chat-list-item.unread #msg-count {
                        visibility: visible;
                        opacity: 1;
                    }
                </style>
                <div class="chat-list-item">
                    <div class="avatar-container">
                        <span class="online-badge"></span>
                        <img id="avatar">
                    </div>
                    <div class="item-details">
                        <h3 id="title"></h3>
                        <p id="desc"></p>
                        <div class="item-meta">
                            <span id="active-time"></span>
                            <span id="msg-count"></span>
                        </div>
                    </div>
                </div>
            </template>
            `;

        let parser = new DOMParser();
        const doc = parser.parseFromString(this._template, 'text/html');

        return doc.getElementById(templateId).content.cloneNode(true);
    }

    render() {

        const itemElement = this.shadowRoot.querySelector(".chat-list-item");

        // put first char of title when avatar not passed
        const title = this.getAttribute("title").toUpperCase() || "";
        let nonAvatarSpan = document.createTextNode(title.substr(0, 1));

        if (!("avatar" in this.attributes)) {
            this.shadowRoot.querySelector(".avatar-container").append(nonAvatarSpan);
        }

        // loop over attributes and set all
        for (let attr of this.attributes) {
            const target = this.shadowRoot.getElementById(attr.name);
            if (target)
                target.innerText = attr.value;

            switch (attr.name) {
                case "avatar":
                    target.src = attr.value;
                    break;

                case "online":
                    if (attr.value === "true")
                        itemElement.classList.add("online");
                    else
                        itemElement.classList.remove("online");
                    break;

                case "msg-count":
                    if (parseInt(attr.value) > 0)
                        itemElement.classList.add("unread");
                    else
                        itemElement.classList.remove("unread");
                    break;

            }

        }
    }

}

customElements.define("chat-list-item", ChatListItem);
