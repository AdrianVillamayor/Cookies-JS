var Utils = {
    merge: function () {
        var obj = {},
            al = arguments.length,
            key;
        if (0 === al) {
            return obj;
        }
        for (let i = 0; i < al; i++) {
            for (key in arguments[i]) {

                if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
                    if (typeof arguments[i][key] === 'object') {
                        for (x in arguments[i][key]) {
                            if (obj[key] !== undefined) {
                                obj[key][x] = arguments[i][key][x]
                            } else {
                                obj[key] = arguments[i][key]
                            }
                        }
                    } else {
                        obj[key] = arguments[i][key];
                    }
                }
            }
        }
        return obj;
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

    str2bool: function (str) {
        str = String(str);
        switch (str.toLowerCase()) {
            case 'false':
            case false:
            case 'no':
            case '0':
            case 'n':
            case '':
                return false;
            default:
                return true;
        }
    },

    extend: function () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[i];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    },

    decode: function (s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }
}

var Cookies = {
    api: function () {},

    set: function (key, value, attributes) {
        if (typeof document === 'undefined') {
            return;
        }

        attributes = Utils.extend({
            path: '/'
        }, this.api.defaults, attributes);

        if (typeof attributes.expires === 'number') {
            attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
        }

        // We're using "expires" because "max-age" is not supported by IE
        attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

        try {
            var result = JSON.stringify(value);
            if (/^[\{\[]/.test(result)) {
                value = result;
            }
        } catch (e) {}

        value = window.Cookies.write ?
            window.Cookies.write(value, key) :
            encodeURIComponent(String(value))
            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

        key = encodeURIComponent(String(key))
            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
            .replace(/[\(\)]/g, escape);

        var stringifiedAttributes = '';
        for (var attributeName in attributes) {
            if (!attributes[attributeName]) {
                continue;
            }
            stringifiedAttributes += '; ' + attributeName;
            if (attributes[attributeName] === true) {
                continue;
            }

            stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }

        return (document.cookie = key + '=' + value + stringifiedAttributes);
    },

    get: function (key, json) {
        if (typeof document === 'undefined') {
            return;
        }

        var jar = {};
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (let i = 0; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookie = parts.slice(1).join('=');

            if (!json && cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }

            try {
                var name = Utils.decode(parts[0]);
                cookie = Utils.decode(cookie);

                if (json) {
                    try {
                        cookie = JSON.parse(cookie);
                    } catch (e) {}
                }

                jar[name] = cookie;

                if (key === name) {
                    break;
                }
            } catch (e) {}
        }

        return key ? jar[key] : jar;
    },

    has: function (key) {
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
    },

    remove: function (key, path, domain) {
        if (!key || !this.has(key)) {
            return false;
        }
        document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT;path=' + (path ? path : '/');
        return true;
    },

    createBanner: function (cookie, opts) {
        const _self = this;

        var options = {
            hideOnScroll: false,
            scrollDelay: 3000,
            expiryDays: 365,
            type: 'cookie', // localStorage
            bannerClass: "alert",
            bannerTarget: "cookiealert",
            bannerStyle: {
                'left': 0,
                'right': 0,
                'width': 'auto',
                'text-align': 'center',
                'bottom': 0,
                'margin': 0,
                'opacity': 1,
                'padding': '1.5em',
                'align-items': 'center',
                'line-height': '1.5em',
                'transition': 'opacity 1s ease',
                '-webkit-transition': 'opacity 1s ease',
                '-moz-transition': 'opacity 1s ease',
                '-ms-transition': 'opacity 1s ease',
                '-o-transition': 'opacity 1s ease',
                'overflow': 'hidden',
                'position': 'fixed',
                'z-index': '9999',
                'background-color': "#FFF",
                'border': '3px solid tomato',
                'border-radius': 0
            },
            btnStyle: {
                'text-align': 'center',
                'border': '1px solid transparent',
                'padding': '.375rem .75rem',
                'line-height': '1.5',
                'cursor': 'pointer',
                'border-radius': '.25rem',
                'color': '#FFF',
                'margin-top': '10px',
                'transition': 'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out'
            },
            message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
            acceptBtn: true,
            accept: 'Accept',
            acceptStyle: {
                'color': '#FFF',
                'background-color': '#007bff',
                'margin-right': '10px'
            },
            rejectBtn: true,
            reject: 'Reject',
            rejectColor: "#dc3545",
            rejectStyle: {
                'color': '#FFF',
                'background-color': '#dc3545',
                'margin-right': '10px'
            },
            configBtn: true,
            config: 'Config',
            configStyle: {
                'color': '#FFF',
                'background-color': '#ffc107',
                'text-decoration': 'none'
            },
            configLink: '#',
            configTarget: '_blank',
            configRel: 'noopener noreferrer',
            moreinfoBtn: true,
            moreinfo: 'Learn more',
            moreinfoLink: 'http://aboutcookies.org',
            moreinfoTarget: '_blank',
            moreinfoRel: 'noopener noreferrer'
        };

        if (opts) {
            options = Utils.merge(options, opts);
        }

        bannerStyle = Utils.objToString(options.bannerStyle);
        btnStyle = Utils.objToString(options.btnStyle);

        cookie_alert = `<div class="${options.bannerClass} ${options.bannerTarget}" style="${bannerStyle}" role="alert">`;

        cookie_alert += options.message;
        cookie_alert += (options.moreinfoBtn) ? `<a href="${options.moreinfoLink}" type="button" class="btn btn-yellow btn-sm" target="${options.moreinfoTarget}" rel="${options.moreinfoRel}"> ${options.moreinfo} </a>` : '';

        if (Utils.str2bool(options.acceptBtn) || Utils.str2bool(options.rejectBtn) || Utils.str2bool(options.configBtn)) {
            cookie_alert += '<div>';
            if (Utils.str2bool(options.acceptBtn)) {
                acceptStyle = Utils.objToString(options.acceptStyle);
                cookie_alert += `<button type="button" style="${btnStyle} ${acceptStyle}" class="btn btn-yellow btn-sm acceptcookies"> ${options.accept} </button>`;

            }
            if (Utils.str2bool(options.rejectBtn)) {
                rejectStyle = Utils.objToString(options.rejectStyle);
                cookie_alert += `<button type="button" style="${btnStyle} ${rejectStyle}" class="btn btn-yellow btn-sm rejectcookies"> ${options.reject} </button>`;

            }
            if (Utils.str2bool(options.configBtn)) {
                configStyle = Utils.objToString(options.configStyle);
                cookie_alert += `<a href="${options.configLink}" type="button" style="${btnStyle} ${configStyle}" class="btn btn-yellow btn-sm" target="${options.configTarget}" rel="${options.configRel}"> ${options.config} </a>`;

            }
            cookie_alert += '</div>';
        }

        cookie_alert += `</div>`;

        document.body.innerHTML += cookie_alert;

        let cookieAlert = document.querySelector(`.${options.bannerTarget}`);

        cookieAlert.offsetHeight;

        opts_actions = {
            'cookie': cookie,
            'type': options.type,
            'expires': options.expiryDays
        }

        if (Utils.str2bool(options.acceptBtn)) {
            let acceptCookies = document.querySelector(".acceptcookies");

            acceptCookies.addEventListener("click", function () {
                _self.agree(opts_actions, cookieAlert)
            });
        }

        if (Utils.str2bool(options.rejectBtn)) {
            let rejectCookies = document.querySelector(".rejectcookies");

            rejectCookies.addEventListener("click", function () {
                _self.reject(opts_actions, cookieAlert)
            });
        }

        if (Utils.str2bool(options.hideOnScroll)) {
            document.getElementsByTagName('body')[0].onscroll = () => {
                setTimeout(function () {
                    _self.agree(opts_actions, cookieAlert)
                }, options.scrollDelay);
            };
        }
    },

    agree: function (opts, cookieAlert) {
        switch (opts.type) {
            case 'localStorage':
                localStorage.setItem(opts.cookie, true)
                break;

            default:
                this.set(opts.cookie, true, {
                    expires: opts.expires
                });
                break;
        }

        cookieAlert.style.display = "none";
        window.dispatchEvent(new Event("cookieAlertAccept"))
    },

    reject: function (opts, cookieAlert) {
        window.dispatchEvent(new Event("cookieAlertReject"))

        switch (opts.type) {
            case 'localStorage':
                localStorage.setItem(opts.cookie, false)
                break;

            default:
                this.remove(opts.cookie);
                break;
        }

        cookieAlert.style.display = "none";
        window.dispatchEvent(new Event("cookieAlertReject"))
    },

    clear: function (cookie) {
        localStorage.removeItem(cookie);
        this.remove(cookie);
    },

    init: function (cookie, opts) {
        if (this.has(cookie) === false && localStorage.getItem(cookie) === null) {
            this.createBanner(cookie, opts)
        }
    }
};