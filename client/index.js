var websocket = require('websocket-stream')
var ws = websocket('ws://'+window.location.host)

var testbed = require('canvas-testbed')
var onAnimation = require('./animations')

var nBalls = 40
var animations = []

testbed(tick)
onAnimation(playAnimation)

function tick(ctx, width, height) {
  ctx.clearRect(0, 0, width, height)

  var yStrip = height/5
  var padStrip = width/10

  var ballWidth = (width - padStrip)/nBalls
  var ballHeight = ballWidth
  var ballSpacing = ballWidth/5

  var balls = []

  animations.forEach(function(anim) {
    var frame = anim.frames[anim.curFrame]
    if (!frame) return

    frame.forEach(function(color, i) {
      balls[i] = balls[i] || []
      color.forEach(function(c, j) {
        balls[i][j] = (balls[i][j] || 0) + c
        if (balls[i][j] > 255) balls[i][j] = 255
      })
    })
    anim.curFrame += 1
  })

  ws.write(JSON.stringify(balls))

  balls.forEach(function(ball, i) {
    var x0 = padStrip/2 + (i * ballWidth)
    var x = x0 + ballSpacing/2
    var y = yStrip
    var w = ballWidth - ballSpacing
    ctx.fillStyle = 'rgb('+ball.join(',')+')'
    ctx.fillRect(x, y, w, ballHeight)
  })

}

function playAnimation (img) {
  var canvas = document.createElement('canvas')
  canvas.width = nBalls
  canvas.height = img.height
  var ctx = canvas.getContext('2d')

  ctx.drawImage(img, 0, 0, nBalls, img.height)
  var frames = getColorFrames(ctx, nBalls, img.height)

  var animation = {
    img: img,
    frames: frames,
    curFrame: 0
  }

  animations.push(animation)
}

function getColorFrames (ctx, width, height) {
  var imageData = ctx.getImageData(0, 0, width, height)
  var data = imageData.data
  var i, x, y, red, green, blue, alpha

  var frames = []

  for(y = 0; y < height; y++) {
    var frame = []

    for(x = 0; x < width; x++) {
      i = ((width * y) + x)

      red = data[i * 4]
      green = data[i * 4 + 1]
      blue = data[i * 4 + 2]
      alpha = data[i * 4 + 3]

      frame.push([red, green, blue])
    }
    frames.push(frame)
    frames.push(frame)
  }

  return frames
}
