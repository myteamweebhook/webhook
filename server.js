'use strict';
var port = process.env.PORT || 1337;
var app = require('express')();
var express = require('express');
var bodyParser = require("body-parser");
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs')
var m = require('moment')

let Subscriptions = {
    Solicitacao: {
        Id: "b9e9e532-c8c3-42c2-a179-b3efac1aa0a5"
    },
    Criacao: {
        Id: "b76d35d3-758b-4626-a7b3-52252b008b52"
    }
}

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
app.get('/consumer.js', function (req, res) {
    res.sendfile(__dirname + '/consumer.js');
});
app.get('/terminal', function (req, res) {
    res.sendfile(__dirname + '/terminal.txt');
});
app.get('/terminal.html', function (req, res) {
    res.sendfile(__dirname + '/terminal.html');
});
app.get('/webhooksLog', function (req, res) {
    res.sendfile(__dirname + "/webhooksLog.txt");
});

// POST method route
app.post('/', function (req, res) {
    const wblog = __dirname + '/webhooksLog.txt';
    fs.exists(wblog, (exists) => {
        let fileData = "";
        if (exists) {
            fileData = fs.readFileSync(wblog, 'utf8');
        }
        let txtFile = "";
        txtFile += `<b>Retrieved</b>: ${m().toISOString()}</br>`;
        txtFile += JSON.stringify(req.body);
        fileData = txtFile + '</br></br>' + fileData;
        fs.writeFileSync(wblog, fileData, { encoding: 'utf8' });
    });
    if (req.query && req.query.validationtoken) {
        // Validating the webhooks subscription
        console.log('Found validation token: ', req.query.validationtoken);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(req.query.validationtoken);
    }
    else {
        if (typeof req.body.value !== "undefined" && req.body.value !== null) {
            // Getting the webhook and broadcasting it across Socket.IO to the client
            var data = req.body.value;
            var dataString = JSON.stringify(req.body.value);
            console.log(JSON.stringify(req.body.value))
            if (data[0]){
                if (data[0].subscriptionId == Subscriptions.Criacao.Id)
                    io.emit('new_team', dataString);
                if (data[0].subscriptionId == Subscriptions.Solicitacao.Id)
                    io.emit('team_request', dataString);
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("Recebido");
        }
    }
});

var addToFile = (fileName, text) => {
    
    fileName = __dirname + '/terminal.txt';
    fs.exists(fileName, (exists) => {
        let fileData = "";
        if (exists) {
            fileData = fs.readFileSync(fileName, 'utf8');
        }
        let txtFile = text || "";
        fileData = txtFile + '</br></br>' + fileData;
        fs.writeFileSync(fileName, fileData, { encoding: 'utf8' });
        return true;
    });
    return false;
}