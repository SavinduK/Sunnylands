const playerHealth = document.getElementById("p1")
const priceLabal = document.getElementById("p2")
const button = document.getElementById("btn")
const coinsLabel = document.getElementById("p3")

console.log(button)

let prices = [250, 500, 1000, 5000, 10000]
let totalScore = JSON.parse(localStorage.getItem("score"))
let hitPoints = 2
if (JSON.parse(localStorage.getItem("lives"))) {
    hitPoints = JSON.parse(localStorage.getItem("lives"))
}

let price = prices[hitPoints - 2]




function buy() {
    if (totalScore > price && hitPoints <= 7) {
        hitPoints += 1
        totalScore = totalScore - price
        price = prices[hitPoints - 2]
        localStorage.setItem("score", JSON.stringify(totalScore))
        localStorage.setItem("lives", JSON.stringify(hitPoints))
    }
}

window.setInterval(function() {
    totalScore = JSON.parse(localStorage.getItem("score"))
    coinsLabel.innerHTML = totalScore
    if (JSON.parse(localStorage.getItem("lives"))) {
        hitPoints = JSON.parse(localStorage.getItem("lives"))
    }
    playerHealth.innerHTML = `X${hitPoints}`
    priceLabal.innerHTML = price
}, 1000)