window.addEventListener('load', function() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext('2d')
        //const playerRun = document.getElementById("playerRun")

    //console.log(window.innerWidth, window.innerHeight)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let playerImgs = []
    let coinImgs = []
    let enemyImgs = []
    let enemyDeath = []
    let gemImgs = []
    let largeTile = new Image()
    let smallTile = new Image()
    const jumpSound = new Audio("static/assets/jump.wav")
    const scoreSound = new Audio("static/assets/score.wav")
    const deathSound = new Audio("static/assets/death.wav")
    const explodeSound = new Audio("static/assets/explosion.wav")
    largeTile.src = "static/assets/tile-large.png"
    smallTile.src = "static/assets/tile-small.png"
    for (i = 0; i <= 5; i++) {
        let newImg = new Image()
        newImg.src = `static/assets/player-run-${i+1}.png`
        playerImgs.push(newImg)
    }
    for (i = 0; i <= 4; i++) {
        let newImg = new Image()
        newImg.src = `static/assets/enemy-death-${i+1}.png`
        enemyDeath.push(newImg)
    }
    for (i = 0; i <= 4; i++) {
        let newImg = new Image()
        newImg.src = `static/assets/gem-${i+1}.png`
        gemImgs.push(newImg)
    }
    for (i = 0; i <= 3; i++) {
        let newImg = new Image()
        newImg.src = `static/assets/eagle-attack-${i+1}.png`
        enemyImgs.push(newImg)
    }
    for (i = 0; i <= 6; i++) {
        let newImg = new Image()
        newImg.src = `static/assets/cherry-${i+1}.png`
        coinImgs.push(newImg)
    }

    let background1 = new Image()
    let background2 = new Image()
    background1.src = "static/assets/back.png"
    background2.src = "static/assets/middle.png"

    let playerDeath = [new Image(), new Image()]
    playerDeath[0].src = "static/assets/player-hurt-1.png"
    playerDeath[1].src = "static/assets/player-hurt-2.png"


    class Player {
        constructor() {
            this.x = 100
            this.y = 300
            this.height = 75
            this.width = 75
            this.yVel = 0
            this.runImgs = playerImgs
            this.animTimer = 0
            this.animInterval = 100
            this.animIndex = 0
            this.deathIndex = 0
            this.alive = true
            this.gameoverCounter = 0
        }

        jump() {

        }
        draw(ctx, deltaTime) {
            ctx.fillStyle = "black";
            if (debug) { ctx.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2) }
            // console.log(this.alive)

            if (this.alive) {
                ctx.drawImage(this.runImgs[this.animIndex], this.x, this.y, this.width, this.height)
                if (this.animTimer > this.animInterval) {
                    this.animIndex += 1
                    if (this.animIndex >= 5) {
                        this.animIndex = 0
                    }
                    this.animTimer = 0
                } else {
                    this.animTimer += deltaTime
                }
            } else {
                ctx.drawImage(playerDeath[this.deathIndex], this.x, this.y, this.width, this.height)
                if (this.animTimer > this.animInterval * 3) {
                    this.deathIndex += 1
                    if (this.deathIndex >= 2) {
                        this.deathIndex = 0
                        this.gameoverCounter += 1
                    }
                    this.animTimer = 0
                } else {
                    this.animTimer += deltaTime
                }
            }

        }
    }
    class Platform {
        constructor(x, y, type) {
            this.x = x
            this.y = y
            this.height = 50
            this.type = type
            this.width = 200 + 150 * type
            this.alive = true
        }
        update() {
            this.x -= speed
            if (this.x + this.width <= 0) {
                this.alive = false
            }
        }

        draw(ctx) {
            ctx.fillStyle = "red";
            if (debug) { ctx.strokeRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1) }
            // console.log(this.type)
            if (this.type <= 0.5) {
                ctx.drawImage(smallTile, this.x, this.y, this.width, this.height)
            }
            if (this.type > 0.5) {
                ctx.drawImage(largeTile, this.x, this.y, this.width, this.height)
            }
        }
    }
    let coinWidth = 40
    let coinHeight = 40
    class Coins {
        constructor(x, y, type) {
            this.x = x
            this.y = y
            this.type = type
            this.height = coinHeight
            this.width = coinWidth
            this.alive = true
            this.animTimer = 0
            this.animInterval = 200
            this.imgs = coinImgs
            this.gemimgs = gemImgs
            this.animIndex = 0
        }
        draw(ctx, deltaTime) {
            ctx.fillStyle = "red";
            if (debug) { ctx.strokeRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1) }
            if (this.type == 0) {
                ctx.drawImage(this.imgs[this.animIndex], this.x, this.y, this.width, this.height)
            }
            if (this.type == 1) {
                ctx.drawImage(this.gemimgs[this.animIndex], this.x, this.y, this.width, this.height)
            }
            if (this.animTimer > this.animInterval) {
                this.animIndex += 1
                if (this.animIndex >= 5) {
                    this.animIndex = 0
                }
                this.animTimer = 0
            } else {
                this.animTimer += deltaTime
            }
        }
        update() {
            this.x -= speed
            if (this.x + this.width <= 0) {
                this.alive = false
            }
        }
    }



    class Enemy {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.width = 100
            this.height = 80
            this.animTimer = 0
            this.animInterval = 100
            this.animIndex = 0
            this.imgs = enemyImgs
            this.alive = true
        }
        draw(ctx, deltaTime) {
            ctx.fillStyle = "red";
            if (debug) { ctx.strokeRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1) }
            ctx.drawImage(this.imgs[this.animIndex], this.x, this.y, this.width, this.height)
            if (this.animTimer > this.animInterval) {
                this.animIndex += 1
                if (this.animIndex >= 4) {
                    this.animIndex = 0
                }
                this.animTimer = 0
            } else {
                this.animTimer += deltaTime
            }
        }
        update() {
            this.x -= speed * 1.5
            if (this.x + this.width <= 0) {
                this.alive = false
            }
        }

    }


    let scrollX1 = 0
    let scrollX2 = 0

    function scroll(ctx) {
        ctx.drawImage(background1, scrollX2, 0, canvas.width + 5, canvas.height)
        ctx.drawImage(background1, scrollX2 + canvas.width, 0, canvas.width, canvas.height)
        ctx.drawImage(background2, scrollX1, 0, canvas.width + 5, canvas.height)
        ctx.drawImage(background2, scrollX1 + canvas.width, 0, canvas.width, canvas.height)
        scrollX1 -= 3
        scrollX2 -= 2
        if (scrollX1 * -1 > canvas.width) {
            scrollX1 = 0
        }
        if (scrollX2 * -1 > canvas.width) {
            scrollX2 = 0
        }
    }

    function restartGame() {
        console.log(totalScore)
        totalScore = totalScore + score
        console.log(score, totalScore)
        localStorage.setItem("score", JSON.stringify(totalScore))
        player = new Player()
        platforms = [new Platform(100, 400, Math.random())]
        coins = []
        onPlatform = false
        jump = false
        enemies = []
        animations = []
        score = 0
        gameOver = false
        scoreMultiplier = 1
        hitPoints = 2
        winDistance = 2000 + 500 * level
        win = false

        if (JSON.parse(localStorage.getItem("lives"))) {
            hitPoints = JSON.parse(localStorage.getItem("lives"))
        }
        if (JSON.parse(localStorage.getItem("level"))) {
            level = JSON.parse(localStorage.getItem("level"))
        }
        winDistance = 2000 + level * 500

    }
    window.addEventListener("keydown", e => {
        if (e.key == " ") {
            // console.log("space pressed")
            jump = true
        }
    })

    window.addEventListener("keydown", e => {
        if (e.key == "Enter" && gameOver) {
            restartGame()
        }
    })
    window.addEventListener("keypress", e => {
        if (e.key == "d") {
            if (debug) { debug = false } else {
                debug = true
            }
        }
    })

    let player = new Player()
    let platforms = [new Platform(100, 400, Math.random())]
    let coins = []
    let onPlatform = false
    let jump = false
    let enemies = []
    let animations = []
    let score = 0
    let highscore = 0
    let speed = 5
    let gameOver = false
    let scoreMultiplier = 1
    let hitPoints = 2
    let totalScore = 0
    let debug = true
    let win = false
    let level = 1
    let winDistance = 2000 + level * 500

    if (JSON.parse(localStorage.getItem("key"))) {
        highscore = JSON.parse(localStorage.getItem("key"))
    }
    if (JSON.parse(localStorage.getItem("score"))) {
        totalScore = JSON.parse(localStorage.getItem("score"))
    }

    if (JSON.parse(localStorage.getItem("lives"))) {
        hitPoints = JSON.parse(localStorage.getItem("lives"))
    }
    if (JSON.parse(localStorage.getItem("level"))) {
        level = JSON.parse(localStorage.getItem("level"))
    }
    winDistance = 2000 + level * 500

    class Animation {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.width = 100
            this.height = 100
            this.alive = true
            this.imgs = enemyDeath
            this.deathTimer = 0
            this.deathIndex = 0
            this.deathInterval = 300
        }

        draw(ctx, deltaTime) {
            ctx.drawImage(this.imgs[this.deathIndex], this.x, this.y, this.width, this.height)
            if (this.deathTimer > this.deathInterval) {
                this.deathIndex += 1
                if (this.deathIndex >= 3) {
                    this.deathIndex = 0
                    this.alive = false
                }
                this.deathTimer = 0
            } else {
                this.deathTimer += deltaTime
            }
        }



    }

    function addPlatforms() {
        // Math.floor(Math.random()*100)
        while (platforms.length <= 5) {
            let lastPlatform = platforms[platforms.length - 1]
            let newY = lastPlatform.y + lastPlatform.height + (Math.floor(Math.random() * 110) - 80)
            let newX = lastPlatform.x + lastPlatform.width + 100 + Math.floor(Math.random() * 150)
            let newType = Math.random()
            if (newY > 400) { newY = 400 }
            if (newY < 100) { newY = 100 }
            let newPlatform = new Platform(newX, newY, newType)
                //if (newY > 300 && newY < 450) { platforms.push(newPlatform)}
            platforms.push(newPlatform)
            let maxCoins = Math.round(newPlatform.width / (coinWidth + 50))
            lastX = newX
            for (i = 0; i < maxCoins; i++) {
                coinX = lastX + i * coinWidth + 50 * i
                lastX = coinX
                coinY = newY - coinHeight - 20 - Math.floor(Math.random() * 100)
                coinType = 0
                if (Math.random() <= 0.15) {
                    coinType = 1
                }
                newCoin = new Coins(coinX, coinY, coinType)
                coins.push(newCoin)
            }

        }
    }

    let enemyTimer = 0
    let enemyInterval = 4000 - (score / 10)

    function addEnemy(deltaTime) {
        if (score > 10) {
            if (enemyTimer > enemyInterval) {
                let newX = canvas.width + 50
                let newY = 100 + Math.floor(Math.random() * 400)
                let newEnemy = new Enemy(newX, newY)
                    // console.log(newEnemy)
                enemies.push(newEnemy)
                    // console.log(enemies.length)
                enemyTimer = 0
            } else {
                enemyTimer += deltaTime
            }
        }
    }


    let scoreTimer = 0
    let scoreInterval = 3000



    function game(deltaTime) {
        //console.log(enemies)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        scroll(ctx)
        player.draw(ctx, deltaTime)

        ctx.font = "40px serif"
        ctx.fillStyle = "red"
        ctx.fillText(`${score}`, 150, 50)
        ctx.drawImage(coinImgs[0], 100, 25, 40, 40)
        ctx.fillText(`X${scoreMultiplier}`, 150, 100)
        ctx.drawImage(gemImgs[0], 100, 75, 40, 40)
        ctx.fillText(`X${hitPoints}`, 1150, 50)
        ctx.drawImage(playerImgs[0], 1100, 25, 40, 40)
        ctx.fillStyle = "black"
        ctx.font = "35px serif"
        ctx.fillText(`Distance To Win:- ${winDistance}`, 900, 100)
        ctx.fillText(`Level:- ${level}`, 100, 150)

        if (player.yVel > 0) {
            player.yVel -= 1
        }
        player.y -= player.yVel
        addPlatforms()
        addEnemy(deltaTime)
        platforms.forEach(platform => {
            platform.draw(ctx)
            platform.update()
            if (!onPlatform) {
                // onPlatform = checkCollision(player, platform)
                onPlatform = checkCollisionX(player, platform) && checkCollisionY(player, platform)
            }
            //console.log(checkCollision(player, platform))
        })


        if (jump) {
            if (onPlatform) {
                player.yVel += 20
                jumpSound.play()
            }
            jump = false
        }


        if (!onPlatform && player.alive) {
            player.y += 3
        }

        onPlatform = false
        platforms = platforms.filter(platform => platform.alive)

        if (player.y + player.height > canvas.height) {
            player.alive = false
            hitPoints = 0
            deathSound.play()
        }


        coins.forEach(coin => {
            coin.draw(ctx, deltaTime)
            coin.update()
            if (checkCollision(player, coin) && player.alive) {
                if (coin.type == 0) {
                    dScore = 1 * scoreMultiplier
                    score = score + dScore
                        //console.log(score)
                }
                if (coin.type == 1) {
                    scoreMultiplier += 1
                }
                coin.alive = false
                scoreSound.play()
                    // console.log(score)
            }
        })

        coins = coins.filter(coin => coin.alive)

        enemies.forEach(enemy => {
            enemy.draw(ctx, deltaTime)
            enemy.update()

            if (checkCollision(player, enemy)) {
                hitPoints -= 1
                enemy.alive = false
                if (hitPoints <= 0) {
                    player.alive = false
                }
                explodeSound.play()
                animations.push(new Animation(enemy.x, enemy.y))
                    // console.log(score)
            }

        })
        enemies = enemies.filter(enemy => enemy.alive)

        animations.forEach(animation => {
            animation.draw(ctx, deltaTime)
        })

        animations = animations.filter(animation => animation.alive)

        if (player.gameoverCounter >= 3) { gameOver = true }

        if (scoreTimer > scoreInterval) {
            scoreTimer = 0
            if (scoreMultiplier > 1) {
                scoreMultiplier -= 1
            }
        } else {
            scoreTimer += deltaTime
        }

        winDistance -= 1

        if (winDistance <= -1) {
            gameOver = true
            win = true
            score = score + 200 * level
            level += 1
            localStorage.setItem("level", JSON.stringify(level))
        }
    }

    function gameoverloop(deltaTime) {
        if (score > highscore) {
            highscore = score
            localStorage.setItem("key", JSON.stringify(highscore))
        }
        ctx.font = "35px helvetica"
        ctx.fillStyle = "black"
        if (!win) {
            ctx.fillText("GameOver! Try Again", 400, 50)
            ctx.fillText(`Your Score is ${score}`, 430, 100)
            ctx.fillText(`HighScore is ${highscore}`, 430, 150)
            ctx.fillText("Press Enter To Restart", 400, 200)
        }
        if (win) {
            ctx.fillText("You Won", 440, 50)
            ctx.fillText(`Your Score is ${score}`, 430, 100)
            ctx.fillText(`HighScore is ${highscore}`, 430, 150)
            ctx.fillText("Press Enter To Restart", 400, 200)
        }

    }

    let lastTime = 0

    function render(timeStamp) {
        let deltaTime = timeStamp - lastTime
        lastTime = timeStamp
            //console.log(deltaTime)
        if (!gameOver) { game(deltaTime) }
        if (gameOver) { gameoverloop(deltaTime) }
        requestAnimationFrame(render)
    }
    render(0)
        // collision function
    function checkCollision(rect1, rect2) {
        let valX = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
        let valY = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
        return (valX && valY)
    }

    function checkCollisionY(player, tile) {
        if (tile.y - (player.y + player.height) > 0 && tile.y - (player.y + player.height) < 5) {
            return true
        }
    }

    function checkCollisionX(player, tile) {
        if ((player.x > tile.x && player.x < tile.x + tile.width) || (player.x + player.width > tile.x && player.x + player.width < tile.x + tile.width)) {
            return true
        }
    }

})