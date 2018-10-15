"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    li.classList.add('list-group-item');
    document.getElementById("messagesList").appendChild(li);
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

function sendMessage(event) {
    var user = sessionStorage.getItem("username");
    var message = document.getElementById("messageInput").value;
    if (message && message.length) {
        connection.invoke("SendMessage", user, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    document.getElementById("messageInput").value = null;
    event.preventDefault();
}

document.getElementById("sendButton").addEventListener("click", function (event) {
    sendMessage(event);
});

document.getElementById("messageInput").addEventListener("keypress", function (event) {
    var key = event.which || event.keyCode;
    if (key === 13) { // 13 is enter
        sendMessage(event)
    }
});

$(document).ready(function() {
    if (!sessionStorage.getItem("username")) {
        sessionStorage.setItem("username", prompt("Please enter your name"));
    }
})
