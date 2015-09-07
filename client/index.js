var _ = require('lodash')
var earstream = require('earstream')
var websocket = require('websocket-stream')
var ws = websocket('ws://'+window.location.host)

var testbed = require('canvas-testbed')
var onAnimation = require('./animations')

var nBalls = 17
var animations = []
var patterns = {}

var curPlaying = null

testbed(tick)
onAnimation(playAnimation)

var es = earstream(3)
var soundState = []
es.on('data', function(data) {
  soundState = data.norm
})

ws.on('data', function (pStr) {
  console.log('loading patterns', pStr.length)

  patterns = {}

  var pats = JSON.parse(pStr)
  pats.forEach(function (pattern) {
    var img = document.createElement('img')
    img.src = 'data:image/png;base64,' + pattern.data
    pattern.img = img

    patterns[pattern.file] = pattern
  })
})

function tick(ctx, width, height) {
  ctx.clearRect(0, 0, width, height)

  var yStrip = height/5
  var padStrip = width/10

  var ballWidth = (width - padStrip)/nBalls
  var ballHeight = ballWidth
  var ballSpacing = ballWidth/5

  var balls = []

  for (var i = 0; i < nBalls; i++) {
    balls.push(soundState.map(function(v) {
      // var str = 1 - Math.abs((nBalls/2) - i)/(nBalls/2)
      v = Math.pow(v, 4)
      return Math.round(128*v)
    }))
  }

  if (!(animations.length >= 1)) playAnimation(_.sample(patterns))

  var finished = []

  animations.forEach(function(anim, idx) {
    var frame = anim.frames[anim.curFrame]
    if (!frame) {
      if (curPlaying === anim.file) curPlaying = null
      return finished.push(idx)
    }

    frame.forEach(function(color, i) {
      balls[i] = balls[i] || []
      color.forEach(function(c, j) {
        balls[i][j] = (balls[i][j] || 0) + c
        if (balls[i][j] > 255) balls[i][j] = 255
      })
    })
    anim.curFrame += 1
  })

  finished.reverse().forEach(function (idx) {
    animations.splice(idx, 1)
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

function playAnimation (pattern) {
  if (!pattern) return

  console.log('playing', pattern)

  var img = pattern.img || pattern
  if (pattern.file) curPlaying = pattern.file

  var canvas = document.createElement('canvas')
  canvas.width = nBalls
  canvas.height = img.height
  var ctx = canvas.getContext('2d')

  ctx.drawImage(img, 0, 0, nBalls, img.height)
  var frames = getColorFrames(ctx, nBalls, img.height)

  var animation = {
    file: pattern.file,
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

      red = Math.round(data[i * 4]/2)
      green = Math.round(data[i * 4 + 1]/2)
      blue = Math.round(data[i * 4 + 2]/2)
      alpha = data[i * 4 + 3]

      frame.push([red, green, blue])
    }
    frames.push(frame)
    frames.push(frame)
  }

  return frames
}
