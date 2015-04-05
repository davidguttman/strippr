var http = require('http')
var ecstatic = require('ecstatic')
var websocket = require('websocket-stream')

var ledStream = require('./led-stream')

var server = http.createServer(ecstatic({
  root: __dirname + '/public'
}))

var port = process.env.PORT || 3000

server.listen(port)

console.log("Server running on port " + port)

var wss = websocket.createServer({server: server}, handle)

function handle(stream) {
  stream.on('data', function(buf) {
    var data = JSON.parse(buf)
    ledStream.write(data)
  })
}
