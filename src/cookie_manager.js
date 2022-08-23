/**
* 
* A lightweight Cookie Manager & Consent Banner in Vanilla JavaScript
*
* @link   https://github.com/AdrianVillamayor/Cookies-JS
* @author Adrii[https://github.com/AdrianVillamayor]
* 
* @class  Cookie_Manager
*/

class Cookie_Manager {

    constructor(args) {

        var opts = {
            cookie: "CookieConsent",
            cookie_attributes: {
                path: '/',
                expires: 365,
                secure: true,
                domain: '',
                maxAge: null,
                httpOnly: false,
                dateTime: new Date(),
            },

            hideOnScroll: false,
            scrollDelay: 3000,
            aplication_storage: 'cookie', // localStorage
            manager: "modal", //all, banner

            banner: {
                class: "cookie_banner",
                target: "cookieBanner", // ID

                buttonGroupClass: "btn-group",
                buttonClass: "btn",
                acceptBtn: true,
                acceptClass: 'acceptCookies',

                rejectBtn: false,
                rejectClass: 'rejectCookies',

                configBtn: true,
                configClass: 'configCookies',
                configType: 'modal', //link

                configLink: '#',
                configTarget: '_blank',
                configRel: 'noopener noreferrer',

                moreinfoBtn: true,
                moreinfoClass: 'moreinfoCookies',
                moreinfoLink: 'http://aboutcookies.org',
                moreinfoTarget: '_blank',
                moreinfoRel: 'noopener noreferrer',
            },

            modal: {
                class: "cookie_modal",
                target: "cookieModal",  // ID
                checkbox: "checkConsent",
                choiceClass: 'choiceClass',
                forceOpen: true,
                categories: [
                    {
                        title: "Necessary",
                        description: "Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.",
                        disabled: true,
                        checked: true
                    },
                    {
                        title: "Preference",
                        description: "Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in."
                    },
                    {
                        title: "Statistics",
                        description: "Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously."
                    },
                    {
                        title: "Marketing",
                        description: "Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers."
                    },
                    {
                        title: "Unclassified",
                        description: "Unclassified cookies are cookies that we are in the process of classifying, together with the providers of individual cookies."
                    }
                ]
            },

            i18n: {
                accept: 'Allow all',
                reject: 'Reject all non-essential cookies',
                config: 'Cookies Settings',
                moreinfo: 'Learn more',
                choice: 'Allow My Selection',
                banner: {
                    message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.'
                },
                modal: {
                    title: "This website uses cookies ",
                    intro: "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.",
                    manage_preferences: "Manage Consent Preferences"
                }
            }
        };

        this.prefabOpts(opts, args);

        this.cookie = this.options.cookie;
        this.cookie_attributes = this.options.cookie_attributes;
        this.aplication_storage = this.options.aplication_storage;
        this.consent_user = this.decode_consent_cookies();

        this.banner = this.options.banner;
        this.modal = this.options.modal;

        this.i18n = this.options.i18n;
        this.prepareCategories()
    };

    /**
    * Initializes the wizard
    * 
    * @throws random        => There has been a problem check the configuration and use of the wizard.
    * 
    * @return {void}
    */

    init() {
        try {
            this.decode_consent_cookies();

            switch (this.aplication_storage) {
                case "localStorage":
                    if ($_.str2bool(localStorage.getItem(this.cookie)) !== true) {
                        this.create()
                    }
                    break;

                default:
                    if ($_.str2bool(this.get(this.cookie)) !== true) {
                        this.create()
                    }
                    break;
            }

        } catch (error) {
            throw error;
        }
    }

    /**
    * Set options of wizard
    * 
    * @return {void}
    */

    set(key, value, attributes = null) {
        this.checkDOM();

        var elem;

        switch (this.aplication_storage) {
            case "localStorage":
                elem = localStorage.setItem(key, value);
                break;

            default:
                attributes = $_.extend(this.cookie_attributes, attributes)

                key = encodeURIComponent(key)
                    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
                    .replace(/[()]/g, encodeURIComponent)

                var stringifiedAttributes = this.prepareAttributes(attributes);

                elem = (document.cookie = key + '=' + value + stringifiedAttributes)
                break;
        }

        return elem;
    }

    get(key) {
        this.checkDOM();

        var elem;

        switch (this.aplication_storage) {
            case "localStorage":
                elem = localStorage.getItem(key);
                break;

            default:

                var cookies = document.cookie ? document.cookie.split('; ') : [];

                var cookie_value = cookies.map(x => {
                    let parts = x.split('=');
                    let cookie_name = $_.decode(parts[0]);
                    let cookie_value = $_.decode(parts[1]);

                    if (cookie_name == key) {
                        return cookie_value;
                    }
                }).filter(item => item !== undefined);

                elem = cookie_value ? cookie_value[0] : null;

                break;
        }

        return elem;
    }

    has(key) {
        this.checkDOM();

        var elem;
        switch (this.aplication_storage) {
            case "localStorage":
                elem = localStorage.getItem(key) !== null;
                break;

            default:
                elem = (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
                break;
        }

        return elem;
    }

    remove(key) {
        switch (this.aplication_storage) {
            case "localStorage":
                localStorage.removeItem(key);
                break;

            default:
                this.set(key, '', { expires: -1 });
                break;
        }
    }

    clear() {
        this.checkDOM();

        switch (this.aplication_storage) {
            case "localStorage":
                this.remove(cookie);
                break;

            default:
                var cookies = document.cookie.split("; ");

                for (let i = 0; i < cookies.length; i++) {
                    var parts = cookies[i].split('=');
                    var name = $_.decode(parts[0]);

                    this.remove(name);
                }
                break;
        }
    }

    create() {
        this.decode_consent_cookies();

        switch (this.options.manager) {
            case "banner":
                this.banner.configType = "link";
                this.createBanner();
                break;
            case "modal":
                this.createModal();
                break;

            default:
                this.banner.configType = "m";

                this.createBanner();
                this.createModal();
                break;
        }
    }

    createBanner() {
        $_.cleanEvents($_.getSelector(`#${this.banner.target}`), true);
        $_.cleanRepeats(`#${this.banner.target}`);

        var cookie_banner = `<div class="${this.banner.class} ${this.banner.target}" id="${this.banner.target}" role="alert">`;

        cookie_banner += this.i18n.banner.message;
        cookie_banner += (this.banner.moreinfoBtn) ? `<a href="${this.banner.moreinfoLink}" type="button" class="${this.banner.moreinfoClass}" target="${this.banner.moreinfoTarget}" rel="${this.banner.moreinfoRel}"> ${this.i18n.moreinfo} </a>` : '';

        if ($_.str2bool(this.banner.acceptBtn) || $_.str2bool(this.banner.rejectBtn) || $_.str2bool(this.banner.configBtn)) {
            cookie_banner += `<div class="${this.banner.buttonGroupClass}">`;
            if ($_.str2bool(this.banner.acceptBtn)) {
                cookie_banner += `<button type="button" class="${this.banner.buttonClass} ${this.banner.acceptClass}"> ${this.i18n.accept} </button>`;
            }

            if ($_.str2bool(this.banner.rejectBtn)) {
                cookie_banner += `<button type="button" class="${this.banner.buttonClass} ${this.banner.rejectClass}"> ${this.i18n.reject} </button>`;
            }

            if ($_.str2bool(this.banner.configBtn)) {
                switch (this.banner.configType) {
                    case "link":
                        cookie_banner += `<a href="${this.banner.configLink}" type="button" class="${this.banner.buttonClass} ${this.banner.configClass}" target="${this.banner.configTarget}" rel="${this.banner.configRel}"> ${this.i18n.config} </a>`;
                        break;

                    default:
                        cookie_banner += `<button type="button" class="${this.banner.buttonClass} ${this.banner.configClass}"> ${this.i18n.config} </button>`;
                        break;
                }
            }

            cookie_banner += '</div>';
        }

        cookie_banner += `</div>`;

        document.body.innerHTML += cookie_banner;

        let cookieAlert = $_.getSelector(`.${this.banner.target}`);
        cookieAlert.offsetHeight;

        this.events();
    }

    createModal() {
        $_.cleanEvents($_.getSelector(`#${this.modal.target}`), true);
        $_.cleanRepeats(`#${this.modal.target}`);

        var cookie_modal = `<div class="${this.modal.class} hide" id="${this.modal.target}">`;

        cookie_modal += `<div class="${this.modal.class}-dialog">`;
        cookie_modal += `<div class="${this.modal.class}-content">`;
        cookie_modal += `  <section class="${this.modal.class}-header">
                                <h2>${this.i18n.modal.title}</h2>
                                <p>${this.i18n.modal.intro}</p>
                                <button type="button" class="${this.banner.buttonClass} ${this.banner.acceptClass}">${this.i18n.accept}</button>
                            </section>`;
        cookie_modal += `   <div class="${this.modal.class}-body">`;
        cookie_modal += `       <section>
                                    <h2>${this.i18n.modal.manage_preferences}</h2> `;

        cookie_modal += `<ul class="list">`;

        let consent_user = this.consent_user;

        for (let category of this.modal.categories) {
            let disabled = ($_.isEmpty(category.disabled) && category.disabled) ? true : false;
            var checked = ($_.isEmpty(category.checked) && category.checked) ? true : false;

            cookie_modal += `<li class="list-item">
                <div class="consentHeader">
                    <h3>${category.title}</h3>`;

            if (disabled && checked) {
                cookie_modal += `
                    <label class="switchConsent" for="${category.title.toLowerCase()}">
                        <div class="slider force-active round"></div>
                    </label>`;
            } else {

                if ($_.isEmpty(consent_user) === true) {
                    checked = consent_user[category.title.toLowerCase()];
                }

                checked = (checked) ? "checked" : "";
                disabled = (disabled) ? "disabled" : "";

                cookie_modal += `
                    <label class="switchConsent" for="${category.title.toLowerCase()}">
                        <input value="1" class="${this.modal.checkbox}" type="checkbox" id="${category.title.toLowerCase()}" ${disabled} ${checked}>
                        <div class="slider round"></div>
                    </label>`;
            }


            cookie_modal += `</div>
                <div class="consentDescription">${category.description}</div>
            </li>`;
        }

        cookie_modal += `</div>`;
        cookie_modal += `</section>`;
        cookie_modal += `  <section class="${this.modal.class}-footer ${this.banner.buttonGroupClass}">
                                <button type="button" class="${this.banner.buttonClass} ${this.banner.rejectClass}">${this.i18n.reject}</button>
                                <button type="button" class="${this.banner.buttonClass} ${this.modal.choiceClass}">${this.i18n.choice}</button>
                            </section>`;

        cookie_modal += `</div> </div> </div>`;


        document.body.innerHTML += cookie_modal;

        this.events();

        if (this.modal.forceOpen === true) this.show("modal");
    }

    events() {
        const _self = this;
        
        if (this.options.manager !== "banner") {
            let configCookies = $_.getSelectorAll(`.${this.banner.configClass}`);
            if (configCookies.length > 0 && this.banner.configType != "link") {
                for (let btn of configCookies) {
                    btn.addEventListener("click", function () {
                        _self.show("modal")
                    });
                }
            }
        }

        let acceptCookies = $_.getSelectorAll(`.${this.banner.acceptClass}`);

        if (acceptCookies.length > 0) {
            for (let btn of acceptCookies) {
                btn.addEventListener("click", function () {
                    let parent =  $_.getSelector(`#${_self.modal.target}`)
                    let checkboxes = $_.getSelectorAll(`.${_self.modal.checkbox}`, parent);

                    for (let box of checkboxes) {
                        box.checked = true;
                    }
                    _self.agree()
                });
            }
        }

        let rejectCookies = $_.getSelectorAll(`.${this.banner.rejectClass}`);

        if (rejectCookies.length > 0) {
            for (let btn of rejectCookies) {
                btn.addEventListener("click", function () {
                    let checkboxes = document.querySelectorAll(`.${_self.modal.checkbox}`)

                    for (let box of checkboxes) {
                        box.checked = false;
                    }
                    _self.reject()
                });
            }
        }

        let choiceCookies = $_.getSelectorAll(`.${this.modal.choiceClass}`);

        if (choiceCookies.length > 0) {
            for (let btn of choiceCookies) {
                btn.addEventListener("click", function () {
                    _self.agree()
                });
            }
        }

        if ($_.str2bool(this.options.hideOnScroll)) {
            document.getElementsByTagName('body')[0].onscroll = () => {
                setTimeout(function () {
                    _self.agree()
                }, this.options.scrollDelay);
            };
        }

        this.decode_consent_cookies();
    }

    show(manager) {
        switch (manager) {
            case "banner":
                let banner = document.querySelector(`.${this.banner.target}`);

                if ($_.isEmpty(banner)) {
                    banner.style.display = "block";
                }

                break;
            case "modal":
                let modal = document.getElementById(this.modal.target);

                if ($_.isEmpty(modal)) {

                    let show_effect = new Promise((resolve, reject) => {
                        modal.classList.remove("hide");
                        modal.classList.add("show");
                        resolve(true);
                    });

                    show_effect.then((val) => modal.style.display = "block");
                }
                break;
        }
    }

    hide(manager) {
        switch (manager) {
            case "banner":
                let banner = document.querySelector(`.${this.banner.target}`);

                if ($_.isEmpty(banner)) {
                    banner.style.display = "none";
                }

                break;
            case "modal":
                let modal = document.getElementById(this.modal.target);
                if ($_.isEmpty(modal)) {

                    let hide_effect = new Promise((resolve, reject) => {
                        modal.classList.remove("show");
                        modal.classList.add("hide");
                        setTimeout(() => {
                            resolve(true);
                        }, 405);
                    });

                    hide_effect.then((val) => modal.style.display = "none");
                }
                break;
        }
    }

    cleanView() {
        switch (this.options.manager) {
            case "banner":
                this.hide("banner")
                break;

            case "modal":
                this.hide("modal")
                break;

            default:
                this.hide("banner")
                this.hide("modal")
                break;
        }
    }


    agree() {
        let checkboxes = document.querySelectorAll(`.${this.modal.checkbox}`);

        var cookies = $_.extend(this.consent_cookies);
        cookies['utc'] = Date.now();

        for (let box of checkboxes) {
            let id = box.getAttribute("id");

            cookies[id] = box.checked;
        }

        cookies = JSON.stringify(cookies);

        switch (this.aplication_storage) {
            case 'localStorage':
                localStorage.setItem(this.cookie, cookies)
                break;

            default:
                this.set(this.cookie, cookies, {
                    expires: this.cookie_attributes.expires
                });
                break;
        }

        this.cleanView();

        document.dispatchEvent(new Event("CookieConsentAccepted"))
    }

    reject() {
        var cookies = $_.extend(this.consent_cookies);
        cookies['utc'] = Date.now();

        cookies = JSON.stringify(cookies);

        switch (this.aplication_storage) {
            case 'localStorage':
                localStorage.removeItem(this.cookie);
                localStorage.setItem(this.cookie, cookies)
                break;

            default:
                this.remove(this.cookie);
                this.set(this.cookie, cookies, {
                    expires: this.cookie_attributes.expires
                });
                break;
        }

        this.cleanView();

        document.dispatchEvent(new Event("CookieConsentRejected"))
    }

    /**
    * Set options of wizard
    * 
    * @return {void}
    */

    set_options(options) {
        this.options = options;
    }

    /**
    * Set options of wizard
    * 
    * @return {void}
    */

    set_consent_cookies(consent_cookies) {
        this.consent_cookies = consent_cookies;
    }

    decode_consent_cookies() {
        var cookies = undefined;

        switch (this.aplication_storage) {
            case "localStorage":
                if ($_.str2bool(localStorage.getItem(this.cookie)) === true) {
                    cookies = localStorage.getItem(this.cookie)
                }
                break;

            default:
                if ($_.str2bool(this.get(this.cookie)) === true) {
                    cookies = this.get(this.cookie);
                }
                break;
        }

        if ($_.isEmpty(cookies)) {
            cookies = JSON.parse(cookies);
            this.set_consent_user(cookies);
        }

        return this.consent_user;
    }

    /**
    * Set options of wizard
    * 
    * @return {void}
    */

    set_consent_user(consent_user) {
        this.consent_user = consent_user;
    }


    /**
    * Check and match the options of the wizard with args definieds
    * 
    * @return {void}
    */

    prefabOpts(options, args) {
        Object.entries(args).forEach(([key, value]) => {
            if (typeof value === 'object') {
                Object.entries(value).forEach(([key_1, value_1]) => {
                    options[key][key_1] = value_1;
                });
            } else {
                options[key] = value;
            }
        });

        this.set_options(options);
    }

    prepareExpires(expires) {
        if (typeof expires === 'number') {
            expires = new Date(Date.now() + expires * 864e5)
        }

        if (expires) {
            expires = expires.toUTCString()
        }

        return expires;
    }

    prepareCategories() {
        let consent_cookies = {};
        if (this.modal.categories.length > 0) {
            for (let category of this.modal.categories) {
                consent_cookies[category.title.toLowerCase()] = ($_.isEmpty(category.checked)) ? category.checked : false;
            }

            this.set_consent_cookies(consent_cookies);
        } else {
            $_.throwException("Error categories");
        }
    }

    prepareAttributes(attributes) {
        var attributeValue;
        var stringifiedAttributes = "";

        for (var attributeName in attributes) {

            switch (attributeName) {
                case "path":
                    attributeValue = (typeof attributes[attributeName] === "string" && $_.isEmpty(attributes[attributeName])) ? String(attributes[attributeName]) : "/";
                    break;

                case "expires":
                    attributeValue = ($_.isEmpty(attributes[attributeName])) ? this.prepareExpires(attributes[attributeName]) : undefined;
                    break;

                case "secure":
                    attributeValue = ($_.str2bool(attributes[attributeName]) === true) ? "" : undefined;
                    break;

                case "domain":
                    attributeValue = (typeof attributes[attributeName] === "string" && $_.isEmpty(attributes[attributeName])) ? String(attributes[attributeName]) : undefined;
                    break;

                case "maxAge":
                    attributeValue = ($_.isEmpty(attributes[attributeName])) ? attributes[attributeName] : undefined;
                    break;

                case "httpOnly":
                    attributeValue = ($_.str2bool(attributes[attributeName]) === true) ? "" : undefined;
                    break;

                default:
                    attributeValue = undefined;
                    break;
            }

            if (attributeValue != undefined) {
                stringifiedAttributes += '; ' + attributeName;
                stringifiedAttributes += (attributeValue != "") ? '=' + attributeValue : "";
            }
        }

        return stringifiedAttributes;
    }

    checkDOM() {
        try {
            if ($_.isEmpty(document) !== true) {
                $_.throwException(this.options.i18n.emptyDoc);
            }
        } catch (error) {
            throw error;
        }
    }
};



var $_ = {
    getID: function (e, n = document) {
        return n.getElementById(e);
    },

    getClass: function (e, n = document) {
        return n.getElementsByClassName(e);
    },

    getTag: function (e, n = document) {
        return n.getElementsByTagName(e);
    },

    getSelector: function (e, n = document) {
        return n.querySelector(e);
    },

    getSelectorAll: function (e, n = document) {
        return n.querySelectorAll(e);
    },

    hasClass: function (e, className) {
        className = className.replace(".", "");
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(e.className);
    },

    getParent: function (elem, selector) {
        var parent = undefined;

        while (elem.parentNode.tagName !== "BODY" && parent === undefined) {
            elem = elem.parentNode;

            if (elem.matches(selector)) {
                parent = elem;
            }
        }

        return parent;
    },

    delegate: function (el, evt, sel, handler) {
        el.addEventListener(evt, function (event) {
            var t = event.target;
            while (t && t !== this) {
                if (t.matches(sel)) {
                    handler.call(t, event);
                }
                t = t.parentNode;
            }
        });
    },

    removeClassList: function (e, className) {
        for (let element of e) {
            element.classList.remove(className);
        };
    },

    objToString: function (obj, delimiter = ";") {
        var str = '';
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + ':' + obj[p] + delimiter;
            }
        }
        return str;
    },

    isHidden: function (el) {
        var style = window.getComputedStyle(el);
        return (style.display === 'none')
    },

    str2bool: function (str) {
        str = String(str);
        switch (str.toLowerCase()) {
            case 'false':
            case 'no':
            case 'n':
            case '':
            case 'null':
            case 'undefined':
                return false;
            default:
                return true;
        }
    },

    exists: function (element) {
        return (typeof (element) != 'undefined' && element != null);
    },

    throwException: function (message) {
        var err;
        try {
            throw new Error('myError');
        } catch (e) {
            err = e;
        }
        if (!err) return;

        var aux = err.stack.split("\n");
        aux.splice(0, 2); //removing the line that we force to generate the error (var err = new Error();) from the message
        aux = aux.join('\n"');
        throw message + ' \n' + aux;
    },

    isEmpty: function (val) {
        return (val != undefined && val != null && String(val).length > 0);
    },

    isValidURL: function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        return !!pattern.test(str);
    },

    extend: function () {
        var result = {};
        for (let i = 0; i < arguments.length; i++) {
            var attributes = arguments[i];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    },

    decode: function (value) {
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },

    encode: function (value) {
        return encodeURIComponent(value).replace(
            /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
            decodeURIComponent
        )
    },

    cleanEvents: function (el, withChildren = false) {
        if ($_.exists(el)) {
            if (withChildren) {
                el.parentNode.replaceChild(el.cloneNode(true), el);
            } else {
                var newEl = el.cloneNode(false);
                while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
                el.parentNode.replaceChild(newEl, el);
            }
        }
    },

    cleanRepeats: function (el) {
        const elements = document.querySelectorAll(`${el}`);

        elements.forEach(element => {
            element.remove();
        });
    }
}