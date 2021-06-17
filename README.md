
![Badge-glow](https://img.shields.io/badge/CookiesJS-v.1.4-blue?style=flat-square) ![jsDelivr hits (GitHub)](https://img.shields.io/jsdelivr/gh/hm/AdrianVillamayor/Cookies-JS?style=flat-square) ![GitHub repo size](https://img.shields.io/github/repo-size/AdrianVillamayor/Cookies-JS?style=flat-square)
# CookieJs - Cookie Manager & Consent Banner in Vanilla JavaScript

## How it works
Simply install the code in your project.

CookieJS adds its own cookie management system and localStorage, which allows you to manage everything quickly and cleanly.

In addition, it allows you to create a 100% customizable banner, with events and checks that will allow you to comply with GDPR Compliant easily.


## Demo
Try it 

[![Codepen](https://user-images.githubusercontent.com/29653964/116972608-8f6bca80-acbb-11eb-98c1-8a3b19705de1.png)](https://codepen.io/adrianvillamayor/pen/jOBNPJL)


## Installation
Add this code before the closing `<body>` tag. ([cdn](https://www.jsdelivr.com/package/gh/AdrianVillamayor/Cookies-JS))
```html
<script src="https://cdn.jsdelivr.net/gh/AdrianVillamayor/Cookies-JS@1.4/src/cookies.min.js"></script>
```


## Basic Usage

### Cookie Management

 - Create Cookie
	```javascript
	Cookies.set('name', 'value') //Create a Cookie for the entire site
	Cookies.set('name', 'value', { expires: 20 }) // Create a Cookie that expires in 20 days
- Get Cookie
	```javascript
	Cookies.get('name') // Get value of Cookie
	Cookies.get() // Get all Cookies
	``` 
- Check Cookie
	```javascript
	Cookies.has('name') // Check if Cookie exist (return bool)
	```
- Remove Cookie
	```javascript
	Cookies.remove('name') // Remove Cookie
	```

### Banner Management
With Cookies.init(), CookiesJS checks the existing cookies and localStorage creating the banner with their events in case they have not been accepted or are expired.
```javascript
var options = {
	message: "We use cookies to enhance your experience.",
	moreinfoLink: "cookies",
	hideOnScroll: false,
	type: "cookie",
	bannerStyle: {
		"border": "5px dashed tomato"
	}
};

Cookies.init('acceptCookies', options)
```

## Config Cookies
Actions to manage cookies
|Action  | Params |  Value / Definition | 
| ------------- | ------------- | ------------- |
| `set` | String `key`, String `value`, Object `attributes` | `attributes = {path: '', domain: 'example.com', expires: 20}` [Write a New Cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#write_a_new_cookie)
| `get` | String `key`  | If `key` is not empty, it collects the value of that cookie. Otherwise it returns all cookies |
| `has` | String `key`  | Check if the cookie exists (`true` or `false`) |
| `remove` | String `key`,  Object `attributes` | Delete the cookie you have set.  `attributes = {path: '', domain: 'example.com', expires: 20}` [Write a New Cookie]|
| `clear` |String `cookie`| If `cookie` is empty it deletes all cookies and matching localStorage . Otherwise only the one sent.  |
| `init` | String `cookie`, Object `opts`  | Name for the banner cookie and the configuration and customisation options |



## Config Banner
Options allowing to modify the behavior and actions of the banner
| Parameter | Type | Default |  Value / Definition |
| ------------- | ------------- | ------------- | ------------- |
| `type` | String  | `cookie` | `cookie` or `localStorage` / Allows to choose how to save the user's selection |
| `expiryDays` | Float  | `365` |  Expressed in days (`.5` for half day.)|
| `hideOnScroll` | Boolean  | `false` | `true` or `false` |
| `scrollDelay` | Int  | `3000` | Expressed in milliseconds |
| `bannerTarget` | String  | `cookiealert` | Class to be used for events and tracking |
| `customStyle` | Boolean  | `false` | If false, it automatically generates the style of the banner and buttons. Otherwise, it generates everything without styling to avoid conflicts and overwriting. |
| `message` | String  | `We use cookies to enhance your experience.` |  Main text of the banner |
| `acceptBtn` | Boolean  | `true` |  `true` or `false`   |
| `rejectBtn` | Boolean  | `true` |  `true` or `false`   |
| `configBtn` | Boolean  | `true` |  `true` or `false`   |
| `configLink` | String  | `#` | Link to configure cookies |
| `configTarget` | String  | `_blank` | [Target types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target)  |
| `configRel` | String  | `noopener noreferrer` | [Link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)  |
| `moreinfoBtn` | Boolean  | `true` |  `true` or `false`   |
| `moreinfoLink` | String  | `http://aboutcookies.org` |  Link for more related information |
| `moreinfoTarget` | String  | `_blank` | [Target types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target)  |
| `moreinfoRel` | String  | `noopener noreferrer` | [Link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)  |



## Customize Banner
Options for modifying the banner and button style
| Parameter | Type | Default | Value / Definition |
| ------------- | ------------- | ------------- | ------------- |
| `bannerClass` | String  | `alert` |  |
| `bannerStyle` | Object  | `{'opacity': 1,'padding': '1.5em'}` | You can add or overwrite any element, the banner will be updated automatically. |
| `buttonGroupClass` | String  | `row` | Class of the button group |
| `btnStyle` | Object  | `{'padding': '.375rem .75rem', 'line-height': '1.5'}` | General style of buttons. Works exactly like `bannerStyle`. |
| `accept` | String  | `Accept` | Button text |
| `acceptClass` | String  | `btn btn-sm acceptcookies` |  Class of accept button. Works exactly like  `bannerClass`.|
| `acceptStyle` | Object  | `{'background-color': '#007bff'},` |  Style of accept button. Works exactly like  `bannerStyle`.|
| `reject` | String  | `Reject` | Button text |
| `rejectClass` | String  | `btn btn-sm rejectcookies` |  Class of reject button. Works exactly like  `bannerClass`.|
| `rejectStyle` | Object  | `{'background-color': '#007bff'},` |  Style of reject button. Works exactly like  `bannerStyle`.|
| `config` | String  | `Reject` | Button text  |
| `configClass` | String  | `btn btn-sm configcookies` |  Class of reject config. Works exactly like  `bannerClass`.|
| `configStyle` | Object  | `{'background-color': '#007bff'},` | Style of config button. Works exactly like  `bannerStyle`. |
| `moreinfo` | String  | `Learn more` | Button text  |
| `moreinfoClass` | String  | `btn btn-sm moreinfocookies` | Class of moreinfo button. Works exactly like  `bannerClass`.  |


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://github.com/AdrianVillamayor/Cookies-JS/blob/main/LICENSE)

### Thanks for your help! 🎉
