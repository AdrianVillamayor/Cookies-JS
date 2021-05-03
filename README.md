# cookie_alert.js
## How to use
#### Include the JavaScript after the html markup
#### Include the JavaScript after the html markup

<script src="cookies.js"></script>
```

### Accept event
If you need to, you can listen for the `cookieAlertAccept` event to get notified when the user accepts the cookies.

```js
window.addEventListener("cookieAlertAccept", function() {
    alert("cookies accepted")
})
```
https://cdn.jsdelivr.net/gh/AdrianVillamayor/Cookies-JS/cookie_alert.js