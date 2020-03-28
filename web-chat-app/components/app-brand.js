import Component from "./component";


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
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: AppBrand.attrTypes,
            template: AppBrand.template
        });

    }
}

customElements.define(AppBrand.tagName, AppBrand);
