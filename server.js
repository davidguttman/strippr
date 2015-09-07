var fs = require('fs')
var eos = require('end-of-stream')
var http = require('http')
var async = require('async')
var ecstatic = require('ecstatic')
var websocket = require('websocket-stream')

var ledStream = require('./led-stream')
// var ledStream = {write: function () {}}

var RELOAD_INTERVAL = 600000

var server = http.createServer(function (req, res) {
  if (req.url === '/admin') return res.end('hi')

  ecstatic({
    root: __dirname + '/public'
  })(req, res)
})

var port = process.env.PORT || 3000

server.listen(port)

console.log("Server running on port " + port)

var wss = websocket.createServer({server: server}, handle)

function handle(stream) {
  var isAlive = true
  
  var interval = setInterval(function () {
    if (!isAlive) return clearInterval(interval)
    getPatterns(function (err, patterns) {
      stream.write(JSON.stringify(patterns))
    })
  }, RELOAD_INTERVAL)

  getPatterns(function (err, patterns) {
    stream.write(JSON.stringify(patterns))
  })

  eos(stream, function (err) { isAlive = false })

  stream.on('data', function(buf) {
    var data = JSON.parse(buf)
    ledStream.write(data)
  })
}

function getPatterns (cb) {
  fs.readdir(__dirname + '/patterns', function (err, files) {
    if (err) return cb(err)

    var filtered = []
    files.forEach(function (file) {
      if (!file.match(/^\./)) filtered.push(file)
    })

    async.map(filtered, function (file, _cb) {
      fs.readFile(__dirname + '/patterns/' + file, 'base64', function (err, data) {
        _cb(err, {file: file, data: data})
      })
    }, cb)
  })
}
