const socketController = new SocketController('ws://localhost:3000');
const statusElement = document.getElementById("status");

socketController.open((s, c) => {
    s.send("STATUS");

    c.onMessage((e) => {
        handleStatus(e.data);
        console.log('Message from server ', e.data);
    });
    
    c.click("open-button", "OPEN");
    c.click("close-button", "CLOSE");
    c.click("on-button", 1);
    c.click("off-button", 0);
    c.hold("hold-button", 1, 0);
    c.click("test1-button", 2);
    c.click("test2-button", 3);
    c.click("test3-button", "a");
})

function handleStatus(data, notStatusCallback = () => {}) {
    const code = parseInt(data);

    switch (code) {
        case 100:
            statusElement.innerHTML = "Ready to connect";
            break;
        case 200:
            statusElement.innerHTML = "Connected";
            break;
        case 400:
            statusElement.innerHTML = "Not connecting";
            break;
        default: 
            notStatusCallback(data);
            break;
    }
}
