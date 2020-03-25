import Component from "./component";

class ChatListItem extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            id: {
                type: "string",
                required: true,
            },
            title: {
                type: "string",
                required: true,
            },
            desc: {
                type: "string",
            },
            avatar: {
                type: "string",
            },
            lastseen: {
                type: "string",
            },
            unreadcount: {
                type: "number",
            },
            online: {
                type: "boolean",
            },
        };
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatListItem.name);
    }

    /**
     * styles of component
     * @returns {string}
     */
    static get style() {
        return (`<style>
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
                    #lastseen {
                        font-size: .7em;
                        opacity: .5;
                        margin-right: 1em;
                    }
                    #unreadcount {
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
                        overflow: hidden;
                        text-overflow: clip;
                    }
                    .chat-list-item.unread #unreadcount {
                        visibility: visible;
                        opacity: 1;
                    }
                </style>`)
    }

    /**
     * html template of component
     * @returns {string}
     */
    static get template() {
        return (`
            <template>
                ${ChatListItem.style}
                <div class="chat-list-item">
                    <div class="avatar-container">
                        <span class="online-badge"></span>
                        <img src="" id="avatar">
                    </div>
                    <div class="item-details">
                        <h3 id="title"></h3>
                        <p id="desc"></p>
                        <div class="item-meta">
                            <span id="lastseen"></span>
                            <span id="unreadcount"></span>
                        </div>
                    </div>
                </div>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatListItem.attrTypes,
            template: ChatListItem.template
        });

        // render component
        this.render();
    }

    connectedCallback() {
        this.initListeners();
    }

    attributeChangeCallback(attrName, oldValue, newValue) {
    }

    initListeners() {
        if (!this.elm)
            return;

        this.elm.addEventListener("click", this.onElmClick.bind(this))
    }

    onElmClick(e) {
        console.log(this.elm);
    }

    /**
     * render component according to template and attributes
     */
    render() {
        this.findMainElement(".chat-list-item");

        // check the required attributes
        if (!("id" in this.attributes)) {
            this.removeMainElement();
        }

        // put first char of title when avatar not passed
        const title = this.getAttribute("title").toUpperCase() || "";

        // fetch first char of title to show if avatar not passed
        let nonAvatarSpan = document.createTextNode(title.substr(0, 1));

        // check the existence of avatar
        if (!("avatar" in this.attributes) || !this.getAttribute("avatar")) {
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
                        this.elm && this.elm.classList.add("online");
                    else
                        this.elm && this.elm.classList.remove("online");
                    break;

                case "unreadcount":
                    if (parseInt(attr.value) > 0)
                        this.elm && this.elm.classList.add("unread");
                    else
                        this.elm && this.elm.classList.remove("unread");
                    break;

            }

        }
    }

}

customElements.define(ChatListItem.tagName, ChatListItem);
