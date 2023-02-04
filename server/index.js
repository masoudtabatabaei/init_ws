const WebSocket = require("ws");

let intervalId;
const wss = new WebSocket.Server({port: 8082});

let connect = () => wss.on("connection", ws => {
    console.log("New connection was established");

    ws.on("message", (message) => {
        try {
            let data = message.toString();
            if(data === "stop") {
                stop(ws);
            } else if(data === "resume") {
                connect();
                console.log("--- resume ---");
            }
        } catch(e) {
            console.log(`Something was wrong due to ${e.message}`);
        }
    });

    // Auto send data from server->client
    streamDataToClient(ws);

    ws.on("close", () => {
        console.log("Oops... connection was terminated!");
    });
});

connect();

function streamDataToClient(ws) {
    intervalId = setInterval(() => {
        ws.send(JSON.stringify({
            orderId: Math.floor(Math.random() * 100),
            color: getRandomColor(),
            date: new Date().toLocaleDateString("en-GB", {
                hour12: false,
                hour:"2-digit",
                minute:"2-digit",
                second: "2-digit"
            })
        }));
    }, 2000);
}

function stop(ws) {
    console.log("--- close ----");
    clearInterval(intervalId);
    ws.send(JSON.stringify({
        type: "close"
    })).close();
}


function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}