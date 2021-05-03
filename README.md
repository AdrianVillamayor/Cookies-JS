# cookie_alert.js
## How to use
#### 1. In the `head` of your document, include `cookiealert.css` **after Bootstrap**.
```html
<link rel="stylesheet" href="cookie_alert.css">
```
#### 2. Include the JavaScript after the html markup
```html
<script src="cookie_alert.js"></script>
```

### Accept event
If you need to, you can listen for the `cookieAlertAccept` event to get notified when the user accepts the cookies.

```js
window.addEventListener("cookieAlertAccept", function() {
    alert("cookies accepted")
})
```
