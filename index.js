var http = require('http');
var websocket = require('websocket').server;

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
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end('' + page + '\n'); 
 
        // SEND CURRENT PAGE TO AUDIENCE
        for ( ii in clients ) {
            clients[ii].sendUTF(page); 
        }
    }
});
presenter.listen(2347);

var audienceNotes = http.createServer(function(req, res) {

});
audienceNotes.listen(2000);

ws.on('request', function(request) {
    var conn = request.accept('echo-protocol', request.origin);
    var id = count++;
    clients[id] = conn;
});

