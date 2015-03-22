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
  var img = makeImg(url)
  animations.appendChild(img)
})

function makeImg (url) {
  var img = document.createElement('img')
  img.src = url
  return img
}

