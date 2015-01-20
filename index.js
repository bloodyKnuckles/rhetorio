var http = require('http');
var websocket = require('websocket').server;
var fs = require('fs');
var path = require('path');

var count = 0;
var clients = {};

var audienceSync = http.createServer(function(req, res) {});
audienceSync.listen(2723);

ws = new websocket({
    httpServer: audienceSync 
});

var presenter = http.createServer(function(req, res) {
    console.log(req.url + ' = url');
    var page = parseInt(req.url.substr(1));
    if ( typeof page == 'number' ) {
        console.log('request for page ' + page + ' received');
        
        // SEND PAGE TO PRESENTER
        res.writeHead(200, {"Content-Type": "text/html"});
        //res.end('' + page + '\n'); 
    var filePath = path.join(__dirname, '' + page + '.html');
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
        if ( !err ) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
        }
        else { console.log(err); }
    });
 
        // SEND CURRENT PAGE TO AUDIENCE
        for ( ii in clients ) {
            clients[ii].sendUTF('' + page); 
        }
    }
});
presenter.listen(9147);

var audienceNotes = http.createServer(function(req, res) {
    var filePath = path.join(__dirname, 'audienceNotes.html');
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
        if ( !err ) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
        }
        else { console.log(err); }
    });
    
});
audienceNotes.listen(2000);

ws.on('request', function(request) {
    var conn = request.accept('echo-protocol', request.origin);
    var id = count++;
    clients[id] = conn;
});

