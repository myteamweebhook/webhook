'use strict';
var port = process.env.PORT || 1337;
var app = require('express')();
var express = require('express');
var bodyParser = require("body-parser");
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs')
var m = require('moment')

server.listen(port, undefined, () => {
    console.log("listening");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// GET method route
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// POST method route
app.post('/', function (req, res) {
    if (req.query && req.query.validationtoken) {
        // Validating the webhooks subscription
        console.log('Found validation token: ', req.query.validationtoken);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(req.query.validationtoken);
    }
    else {
        if (typeof req.body.value !== "undefined" && req.body.value !== null) {
            // Getting the webhook and broadcasting it across Socket.IO to the client
            var data = JSON.stringify(req.body.value);
            console.log(JSON.stringify(req.body.value))
            //io.emit('list:changes', data);
            const fileName = __dirname + '/webhooksLog.txt';
            // Keeping track of every webhooks
            // Write changes in a file
            fs.exists(fileName, (exists) => {
                let fileData = "";
                if (exists) {
                    fileData = fs.readFileSync(fileName, 'utf8');
                }
                let txtFile = "";
                txtFile += `<b>Retrieved</b>: ${m().toISOString()}</br>`;
                txtFile += JSON.stringify(data);
                fileData = txtFile + '</br></br>' + fileData;
                fs.writeFileSync(fileName, fileData, { encoding: 'utf8' });
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("Inserido")
            });
        }
        else{
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("Not Found")
        }
    }
});
