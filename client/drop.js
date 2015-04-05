document.body.style.background = 'black'

module.exports = function(element, callback) {
  function onDrop (event) {
    var files = event.dataTransfer.files
    read(files[0], callback)
    return terminateEvent(event)
  }
  element.addEventListener('dragover', terminateEvent, false)
  element.addEventListener('drop', onDrop, false)
}

function read (file, callback) {
  var reader = new FileReader

  reader.onload = function(event) {
    callback(null, event.target.result)
  }

  reader.readAsDataURL(file)
}

function terminateEvent (event) {
  event.stopPropagation()
  event.preventDefault()
  return false
}
