var through = require('through2')
var SerialPort = require('serialport').SerialPort

var port = '/dev/cu.usbmodem1411'

var serial = new SerialPort(port, {baudrate:115200})

var nLEDs = 17
var nColors = nLEDs * 3

var leds = []
for (var i = 0; i < nColors; i++) {
  leds.push(0)
}

serial.on('open',function() {
  console.log('Port open')
})

serial.on('data', function(data) {
  console.log(data.toString())
})

serial.on('error', function() {})

module.exports = through.obj(function(chunk, enc, cb) {
  var flat = flatten(chunk)
  for (var i = 0; i < nColors; i++) { leds[i] = flat[i] || 0 }
  cb()
})

setInterval(function() {
  var buf = new Buffer(leds)
  // console.log('leds', JSON.stringify(leds))
  serial.write(buf)
}, 20)

function flatten (arr) {
  var flattened = []
  arr.forEach(function(col) {
    fix(col)
    col.forEach(function(c) {
      flattened.push(c)
    })
  })
  return flattened
}

function fix (col) {
  col.unshift(col.pop())
  return col
}
