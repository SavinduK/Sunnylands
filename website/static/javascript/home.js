let sound = new Audio("/static/assets/music.wav")
window.addEventListener("load", e => {
    window.setInterval(function() {
        sound.play()
    }, 4500)
    sound.play()
})