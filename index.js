var drop = require('./lib/drop')
var testbed = require('canvas-testbed')

function tick(ctx, width, height) {
  ctx.clearRect(0, 0, width, height)

  var nBalls = 40

  var yStrip = height/5
  var padStrip = width/10

  var ballWidth = (width - padStrip)/nBalls
  var ballHeight = ballWidth
  var ballSpacing = ballWidth/5

  for (var i = 0; i < nBalls; i++) {
    var x0 = padStrip/2 + (i * ballWidth)
    var x = x0 + ballSpacing/2
    var y = yStrip
    var w = ballWidth - ballSpacing
    ctx.fillRect(x, y, w, ballHeight)
  }

}

var animations = document.createElement('div')
animations.style.position = 'absolute'
animations.style.zIndex = 1000
animations.style.bottom = 0
animations.style.left = 0
animations.style.width = '100%'
animations.style.height = '50%'
animations.style.borderTop = '1px solid gray'
animations.style.padding = 10 + 'px'
document.body.appendChild(animations)

drop(animations, function(err, url) {
  // console.log('url', url)
  var img = makeImg(url)
  animations.appendChild(img)
})
testbed(tick)

function makeImg (url) {
  var img = document.createElement('img')
  img.src = url
  return img
}
