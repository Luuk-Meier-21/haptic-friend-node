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
    c.click("start-button", "START");
    c.click("on-button", 1);
    c.click("off-button", 0);
    c.hold("hold-button", 1, 0);
})

function handleStatus(data, notStatusCallback = () => {}) {
    const code = parseInt(data);

    switch (code) {
        case 100:
            document.location.reload(true);
            break;
        case 200:
            statusElement.innerHTML = "Connected";
            break;
        case 300:
            statusElement.innerHTML = "Not connected";
            break;
        default: 
            notStatusCallback(data);
            break;
    }
}
