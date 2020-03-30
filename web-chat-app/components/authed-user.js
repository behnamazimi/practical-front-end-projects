class AuthedUser extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            id: {
                type: "string",
                observe: true
            },
            name: {
                type: "string",
                observe: true
            },
            avatar: {
                type: "string",
                observe: true
            },
            hidden: {
                type: "boolean",
                observe: true
            },
        };
    }

    /**
     * generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(AuthedUser.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(AuthedUser.name);
    }

    /**
     * styles of component
     * @returns {string}
     */
    static get style() {
        return (`<style>
                :host {
                    --primaryColor:  #3AD07A;
                    --hoverColor: #edfbf3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 1.5em .75em;
                    position: relative;
                    transition: max-height 1s, all .3s;
                    max-height: 500px;
                    transform-origin: top;
                    background-color: #fff;
                }
                :host([hidden]) {
                    transition: max-height 0.5s, all .3s;
                    padding: 0;
                    max-height: 0;
                    visibility: hidden;
                    opacity: 0;
                    transform: scale(.8);
                }
                * {
                    box-sizing: border-box;
                    user-select: none;                        
                }
                .avatar-container {
                    flex: 0 1 3.5em;
                    width: 3.5em;
                    height: 3.5em;
                    margin-bottom: .75em;
                    border-radius: 50%;
                    overflow: hidden;   
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #efefef;
                    font-weight: bold;
                    font-size: 1em;
                    position: relative;
                    border: 2px solid var(--primaryColor);
                    box-shadow: 0 0 8px 2px rgba(0,0,0,0.16);
                }
                .avatar-container img {
                    max-width: 100%;
                    position: relative;
                    z-index: 1;
                }
                .avatar-container .char-avatar {
                    position: absolute;
                    z-index: 0;
                }
                .details {
                    flex: 0 1 100%;
                    text-align: center;

                }
                #name {
                    flex: 0 1 100%;
                    position: relative;
                    margin: 0 0 .3em 0;
                    font-size: .9em;
                    font-weight: 900;
                }
                #username {
                    flex: 0 1 100%;
                    position: relative;
                    margin: 0 0 .3em 0;
                    font-size: .85em;
                    opacity: .6;
                }
                .actions {
                    margin-top: .5em;
                    display: flex;
                }
                .actions button {
                    background: transparent;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    color: var(--primaryColor);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 32px;
                    height: 28px;
                    border-radius: 5px;
                    margin: 0 .3em ;
                }             
                .actions button:hover {
                    background-color: #f2f2f2;
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
                ${AuthedUser.style}
                <div class="avatar-container">
                    <img src="" id="avatar">
                    <span class="char-avatar"></span>
                </div>
                <div class="details">
                    <div id="name"></div>
                    <p id="username"></p>
                </div>
                <div class="actions">
                    <button id="settings" title="Settings">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </button>
                    <button id="edit-profile" title="Profile Edit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button id="logout" title="Logout">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                            <line x1="12" y1="2" x2="12" y2="12"></line>
                        </svg>    
                    </button>
                </div>                
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: AuthedUser.attrTypes,
            template: AuthedUser.template
        });

        // render component
        this.render();
    }

    // call on attributes changed
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        // re-render component
        this.render();
    }

    setUser(user) {
        this._user = user;

        this.setAttribute("id", user.id);
        this.setAttribute("name", user.name);
        this.setAttribute("username", user.username);
        this.setAttribute("avatar", user.avatar);
    }

    /**
     * reflect the hidden attr on HTML tag
     * @param value
     */
    set hidden(value) {
        if (value)
            this.setAttribute("hidden", '');
        else
            this.removeAttribute("hidden")
    }

    get hidden() {
        return this.hasAttribute("hidden")
    }

    /**
     * render component according to template and attributes
     */
    render() {

        // check the existence of avatar
        // fetch first char of title to show if avatar not passed
        if (!this.getAttribute("avatar")) {
            // put first char of title when avatar not passed
            const name = (this.getAttribute("name") || "").toUpperCase();
            this.shadowRoot.querySelector(".char-avatar").innerText = name.substr(0, 1);
        }

        // loop over attributes and set all
        for (let attr of this.attributes) {
            const target = this.shadowRoot.getElementById(attr.name);
            if (!target)
                continue;

            switch (attr.name) {
                case "username":
                case "name":
                    target.innerText = attr.value;
                    break;
                case "avatar":
                    target.src = attr.value;
                    break;
            }

        }
    }
}

// define auth-user tag name
customElements.define(AuthedUser.tagName, AuthedUser);
