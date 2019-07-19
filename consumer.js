

var socket = io();
socket.on("console:output", (data) => {
    console.log(data);
})
socket.on("console:error", (data) => {
    console.error(data);
})