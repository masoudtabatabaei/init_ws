
const stopSendData = document.getElementById("stop");
const resumeSendData = document.getElementById("resume");
const contentSection = document.getElementById("content");
const statusText = document.getElementById("status_text");

document.addEventListener("DOMContentLoaded", function() {
    const ws = new WebSocket("ws://localhost:8082");
    
    ws.addEventListener("open", () => {
        console.log("I'm connected");
        statusText.innerText = "Receiving data...";
    });
    
    stopSendData.addEventListener("click", () => {
        ws.send("stop");
    })
    
    resumeSendData.addEventListener("click", () => {
        ws.send("resume");
    });
    
    ws.addEventListener("message", ({data}) => {
        const dataObj = JSON.parse(data);
    
        if(dataObj?.type === "close") {
            statusText.innerText = "⛔ Connection Closed!";
        } else {
            contentSection.innerHTML += `
                <div class="order_item">
                    <div style="font-weight:600"># ${dataObj.orderId}</div>
                    <div class="item_bg" style="background-color: ${dataObj.color}"></div>
                    <div>${dataObj.date.split(",")[1]}</div>
                </div>
            `;
        }
    });
})