var SerialPort = require('serialport').SerialPort

var port = '/dev/cu.usbmodem1421'

var serial = new SerialPort(port, {baudrate:9600})

serial.on('open',function() {
  console.log('Port open')
})

serial.on('data', function(data) {
  console.log(data.toString())
})

var leds = []
for (var i = 0; i < 40; i++) {
  leds.push(ranColor())
  leds.push(ranColor())
  leds.push(ranColor())
}

setInterval(function() {
  var buf = new Buffer(leds)
  console.log('buf', buf)
  serial.write(buf)
  leds.push(leds.shift())
  leds.push(leds.shift())
  leds.push(leds.shift())
}, 20)

function ranColor () {
  return Math.floor(Math.random()*256)
}
