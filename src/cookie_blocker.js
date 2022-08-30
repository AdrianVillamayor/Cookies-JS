
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
    constructor(args = null) {
        this.regulationRegions = {
            gdpr: ["at", "be", "bg", "cy", "cz", "de", "dk", "es", "ee", "fi", "fr", "gb", "gr", "hr", "hu", "ie", "it", "lt", "lu", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "si", "se", "li", "no", "is"],
            ccpa: ["us-06"],
            lgpd: ["br"],
        };
        this.domains = [
            { d: "google-analytics.com", c: [3] },
            { d: "googletagmanager.com", c: [3] },
            { d: "googlesyndication.com", c: [4] },
            { d: "googleadservices.com", c: [4] },
            { d: "youtube.com", c: [4] },
            { d: "youtube-nocookie.com", c: [4] },
            { d: "doubleclick.net", c: [4] },
            { d: "facebook.*", c: [4] },
            { d: "linkedin.com", c: [4] },
            { d: "twitter.com", c: [4] },
            { d: "addthis.com", c: [4] },
            { d: "bing.com", c: [4] },
            { d: "sharethis.com", c: [4] },
            { d: "yahoo.com", c: [4] },
            { d: "addtoany.com", c: [4] },
            { d: "dailymotion.com", c: [4] },
            { d: "amazon-adsystem.com", c: [4] },
            { d: "snap.licdn.com", c: [4] },
            { d: "zdassets.com", c: [3] },
        ]

        this.browser = this.browserDetect();
    }

    cookieCategoriesFromNumberArray(catNumberArray) {
        for (var categoryString = "", i = 0; i < catNumberArray.length; i++)
            switch (("" !== categoryString && (categoryString += ","), Number(catNumberArray[i]))) {
                case 2:
                    categoryString += "preferences";
                    break;
                case 3:
                    categoryString += "statistics";
                    break;
                case 4:
                    categoryString += "marketing";
            }
        return "" !== categoryString && "," === categoryString.slice(-1) && (categoryString = categoryString.substring(0, categoryString.length - 1)), categoryString;
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
        let $cookie = Cookies.decode_consent_cookies();
        var src = node.src || '';

        if (src === "") {
            let src_block = node.getAttribute("data-cookie-block") || '';
            src = (src_block !== "") ? src_block : ''
        }

        if (src.includes("zendesk")) {
            node.setAttribute('data-categories', "preferences, statistics, marketing");

            if ($_.isEmpty($cookie)) {
                if ($cookie.preference && $cookie.statistics && $cookie.marketing) {
                    checkStatus(node, true)
                } else {
                    checkStatus(node)
                }

            } else {
                checkStatus(node)
            }
        }

        if (src.includes("google")) {
            node.setAttribute('data-categories', "statistics, marketing");

            if ($_.isEmpty($cookie)) {
                if ($cookie.statistics && $cookie.marketing) {
                    checkStatus(node, true)
                } else {
                    checkStatus(node)
                }
            } else {
                checkStatus(node)
            }
        }
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