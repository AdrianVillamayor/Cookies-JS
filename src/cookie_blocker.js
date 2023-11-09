
/**
* 
* A lightweight Cookie Manager & Consent Banner in Vanilla JavaScript
*
* @link   https://github.com/AdrianVillamayor/Cookies-JS
* @author Adrii[https://github.com/AdrianVillamayor]
* 
* @class  Cookie_Bloker
*/

class Cookie_Bloker {
    constructor(Cookie_Maneger = undefined) {
        this.regulationRegions = {
            gdpr: ["at", "be", "bg", "cy", "cz", "de", "dk", "es", "ee", "fi", "fr", "gb", "gr", "hr", "hu", "ie", "it", "lt", "lu", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "si", "se", "li", "no", "is"],
            ccpa: ["us-06"],
            lgpd: ["br"],
        };

        //                              0           1             2             3           4
        this.cookie_categories = ["necessary", "preference", "statistics", "marketing", "unclassified"];

        this.domains = [
            { d: "google-analytics.com", c: [2] },
            { d: "googletagmanager.com", c: [2] },
            { d: "googlesyndication.com", c: [3] },
            { d: "googleadservices.com", c: [3] },
            { d: "youtube.com", c: [3] },
            { d: "youtube-nocookie.com", c: [3] },
            { d: "doubleclick.net", c: [3] },
            { d: "facebook.*", c: [3] },
            { d: "linkedin.com", c: [3] },
            { d: "twitter.com", c: [3] },
            { d: "addthis.com", c: [3] },
            { d: "bing.com", c: [3] },
            { d: "sharethis.com", c: [3] },
            { d: "yahoo.com", c: [3] },
            { d: "addtoany.com", c: [3] },
            { d: "dailymotion.com", c: [3] },
            { d: "amazon-adsystem.com", c: [3] },
            { d: "snap.licdn.com", c: [3] },
            { d: "zdassets.com", c: [1, 2] }
        ]

        this.browser = this.browserDetect();
        this.cookies_consent = null;

        if (Cookie_Maneger === "function") {
            this.cookies_consent = Cookie_Maneger.decode_consent_cookies();
        }
    }

    cookieCategoriesFromNumberArray(catNumberArray) {
        var categoryString = "";

        catNumberArray.forEach(function (x, i) {
            categoryString += this.cookie_categories[x];
            categoryString += ", ";
        });

        categoryString = categoryString.slice(0, categoryString.length - 2);

        return categoryString;
    }

    browserDetect() {
        let userAgent = navigator.userAgent;
        let browserName;

        if (userAgent.match(/chrome|chromium|crios/i)) {
            browserName = "chrome";
        } else if (userAgent.match(/firefox|fxios/i)) {
            browserName = "firefox";
        } else if (userAgent.match(/safari/i)) {
            browserName = "safari";
        } else if (userAgent.match(/opr\//i)) {
            browserName = "opera";
        } else if (userAgent.match(/edg/i)) {
            browserName = "edge";
        } else {
            browserName = undefined;
        }

        return browserName;
    }

    checkStatus(node, cross = false) {
        if (cross === true) {
            if (node.hasAttribute("data-cookie-block")) {
                node.type = "text/javascript";
                let src = node.getAttribute("data-cookie-block");
                node.setAttribute('src', src);
                node.removeAttribute("data-cookie-block")
            }
        } else {
            node.type = "text/plain";

            if (node.src != '') {
                node.setAttribute('data-cookie-block', node.src);
                node.removeAttribute("src")

                if (this.browser === "firefox") {
                    "beforescriptexecute".split(" ").forEach(function (e) {
                        node.addEventListener(e, function (e) {
                            e.preventDefault();
                        });
                    })
                }
            }
        }
    }

    checkThirdPartys(node) {
        let _self = this;
        let $cookie = this.cookies_consent;
        var src = node.src || '';

        if (src === "") {
            let src_block = node.getAttribute("data-cookie-block") || '';
            src = (src_block !== "") ? src_block : ''
        }

        this.domains.forEach(function (x, i) {
            let domain = x['d'];
            let category = x['c'];

            if (url.indexOf(domain) >= 0) {
                let data_categories = _self.cookieCategories(category)
                node.setAttribute('data-categories', data_categories);

                if ($cookie != undefined && $cookie != null && String($cookie).length > 0) {
                    if ($cookie.preference && $cookie.statistics && $cookie.marketing) {
                        _self.checkStatus(node, true)
                    } else {
                        _self.checkStatus(node)
                    }

                } else {
                    _self.checkStatus(node)
                }
            }
        })
    }

    initMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(({
                addedNodes
            }) => {
                addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        checkThirdPartys(node);
                    }
                })
            })
        })

        observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    init() {

    }

}