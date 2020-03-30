class AppBrand extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {};
    }

    /**
     * generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(AppBrand.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(AppBrand.name);
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
                        justify-content: flex-start;
                        align-items: center;
                        padding: .75em;
                        border-bottom: 1px solid #efefef;
                        height: 64px;
                        flex: 0 0 64px;
                    }
                    * {
                        box-sizing: border-box;
                        user-select: none;                        
                    }
                    .icon {
                        height: 32px;
                        width: 32px;
                        background-color: var(--primaryColor);
                        display: flex;
                        justify-content: center;    
                        align-items: center;
                        border-radius: 50%;
                        color: #fff;
                        margin-right: 1rem;
                    }
                    .title {
                        font-size: 14px;
                        font-weight: 900;
                        color: #666;
                    }
                    #profile-btn {
                        background: transparent;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        color: var(--primaryColor);
                        width: 36px;
                        height: 36px;
                        align-self: center;
                        margin-left: auto;
                        border-radius: 4px;
                    }
                    #profile-btn:hover {
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
                ${AppBrand.style}
                <span class="icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                </span>        
                <strong class="title">Chat Web App</strong>     
                <button id="profile-btn" tabindex="1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button> 
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: AppBrand.attrTypes,
            template: AppBrand.template
        });

        this._profileBtn = this.shadowRoot.getElementById("profile-btn");
    }

    // call on mounting
    onMount() {
        this.initListeners();
    }

    // call on un-mounting
    onUnmount() {
        this.removeListeners();
    }

    /**
     * Initialize required listeners
     */
    initListeners() {
        this._profileBtn.addEventListener("click", this._onProfileBtnCLick.bind(this))
    }

    /**
     * remove added listeners
     */
    removeListeners() {
        this._profileBtn.removeEventListener("click", this._onProfileBtnCLick.bind(this))
    }

    /**
     * handle profile button click
     * @param e
     * @private
     */
    _onProfileBtnCLick(e) {
        this.emit(APP_EVENTS.PROFILE_BTN_CLICK)
    }
}

// define app-brand tag name
customElements.define(AppBrand.tagName, AppBrand);
