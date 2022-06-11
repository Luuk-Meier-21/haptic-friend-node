function SocketController(url) {
    if (typeof url === !"string") throw Error("SocketProxy: Given url is not a string.");

    this.url = url;
    let socket = new WebSocket(url); 

    this.open = (callback) => socket.addEventListener('open', (e) => callback(socket, this));
    this.send = (message) => socket.send(message);
    this.onMessage = (callback) => socket.addEventListener('message', (e) => callback(e));

    this.click = (id, message) => {
        // if (typeof message === !"string") throw Error(`Message is not a string (${id}),(${message})`);
        onClick(id, () => {
            console.log("Sending: "+ message)
            socket.send(message)
        })
    }

    this.hold = (id, holdMessage, releaseMessage) => {
        onEvent(id, "mousedown", () => {
            console.log("Sending: "+ holdMessage)
            socket.send(holdMessage)
        })
        onEvent(id, "mouseup", () => {
            console.log("Sending: "+ releaseMessage)
            socket.send(releaseMessage)
        })
    }
}

/**
 * Simple to use click event listener function for HTML elements.
 * 
 * @param {*} id id of a HTML element
 * @param {*} callback callback for click events on given element
 */
function onClick(id, callback) {
    onEvent(id, "click", callback);
}

/**
 * Simple to use event listener function for HTML elements.
 * 
 * @param {*} id id of a HTML element
 * @param {*} event event to listen for
 * @param {*} callback callback for click events on given element
 */
 function onEvent(id, event, callback) {
    const element = document.getElementById(id);

    element.removeEventListener(event, callback);
    element.addEventListener(event, callback);
}