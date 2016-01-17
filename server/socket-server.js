var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var path = require('path');

app.use(express.static(path.join(__dirname, '../', 'sender')));
app.use(express.static(path.join(__dirname, '../', 'receiver')));

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({
    server: server
})
console.log("websocket server created")

wss.on("connection", function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(new Date()), function() {})
    }, 1000);

    ws.on('message', function(msg){
        console.log('=====================');
        console.log(msg);
        console.log('=====================');
    });

    ws.on("close", function() {
        console.log("websocket connection close")
        clearInterval(id)
    })
})
