const audioExplosao = document.getElementById("audioExplosao")
const audioGameOver = document.getElementById("audioGameOver")
const audioMusica = document.getElementById("audioMusica")
const audioPerdido = document.getElementById("audioPerdido")
const audioResgate = document.getElementById("audioResgate")
const audioDisparo = document.getElementById("audioDisparo")

audioMusica.addEventListener("ended", () => { audioMusica.currentTime = 0, audioMusica.play() }, false)

let posicaoY = parseInt(Math.random() * 334)
let disparoLiberado = true
let fimDoJogo = false

let energiaDoJogador = 3

let salvos = 0
let pontos = 0
let perdidos = 0

let vel = 1

const JOGO = {}
const TECLA = {
    W: 87,
    S: 83,
    D: 68
}
JOGO.pressionou = []


function start() {
    audioMusica.play()

    $("#inicio").hide()

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>")
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>")
    $("#fundoGame").append("<div id='inimigo2'></div>")
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
    $("#fundoGame").append("<div id='placar'></div>")
    $("#fundoGame").append("<div id='energia'></div>")

    startLoop()

    $(document).keydown(function(e) {
        JOGO.pressionou[e.which] = true
    })

    $(document).keyup(function(e) {
        JOGO.pressionou[e.which] = false
    })
}


function startLoop() {
    JOGO.timer = setInterval(loop, 30)

    function loop() {
        mover()
        moveJogador()
        moveInimigo1()
        moveInimigo2()
        moveAmigo()
        colisaoDeDivs()
        placar()
        energia()
    }

    function mover() {
        const ESQUERDA = parseInt($("#fundoGame").css("background-position"))
        $("#fundoGame").css("background-position", ESQUERDA - 2)
    }
}


function moveJogador() {
    if (JOGO.pressionou[TECLA.W]) {
        const TOPO = parseInt($("#jogador").css("top"))
        $("#jogador").css("top", TOPO - 10)

        if (TOPO <= 10) {
            $("#jogador").css("top", TOPO + 0);
        }
    }

    if (JOGO.pressionou[TECLA.S]) {
        const TOPO = parseInt($("#jogador").css("top"))
        $("#jogador").css("top", TOPO + 10)

        if (TOPO >= 434) {
            $("#jogador").css("top", TOPO - 0);
        }
    }

    if (JOGO.pressionou[TECLA.D]) {
        disparo()
    }
}


function moveInimigo1() {
    const POSICAOX = parseInt($("#inimigo1").css("left"))
    $("#inimigo1").css("left", POSICAOX - vel)
    $("#inimigo1").css("top", posicaoY)

    if (POSICAOX <= 0) {
        posicaoY = parseInt(Math.random() * 334)
        $("#inimigo1").css("left", 689)
        $("#inimigo1").css("top", posicaoY)

    }
}


function moveInimigo2() {
    const POSICAOX = parseInt($("#inimigo2").css("left"))
    $("#inimigo2").css("left", POSICAOX - vel)

    if (POSICAOX <= 0) {
        $("#inimigo2").css("left", 775)
    }
}


function moveAmigo() {
    const POSICAOX = parseInt($("#amigo").css("left"))
    $("#amigo").css("left", POSICAOX + vel)

    if (POSICAOX >= 830) {
        $("#amigo").css("left", 10)
    }
}


function disparo() {
    audioDisparo.play()

    if (disparoLiberado === true) {
        disparoLiberado = false

        const TOPO = parseInt($("#jogador").css("top"))
        const POSICAOX = parseInt($("#jogador").css("left"))
        const TIROX = POSICAOX + 190
        const TOPOTIRO = TOPO + 40

        $("#fundoGame").append("<div id='disparo'></div>")
        $("#disparo").css("top", TOPOTIRO)
        $("#disparo").css("left", TIROX)

        var tempoDisparo = setInterval(executeDisparo, 30)

    }

    function executeDisparo() {
        const POSICAOX = parseInt($("#disparo").css("left"))

        $("#disparo").css("left", POSICAOX + 25)

        if (POSICAOX > 870) {
            clearInterval(tempoDisparo)
            $("#disparo").remove()
            disparoLiberado = true
        }
    }
}


function colisaoDeDivs() {
    const COLISAO1 = ($("#jogador").collision($("#inimigo1")))
    const COLISAO2 = ($("#disparo").collision($("#inimigo1")))

    const COLISAO3 = ($("#jogador").collision($("#inimigo2")))
    const COLISAO4 = ($("#disparo").collision($("#inimigo2")))

    const COLISAO5 = ($("#jogador").collision($("#amigo")))
    const COLISAO6 = ($("#inimigo2").collision($("#amigo")))

    const INIMIGOX = parseInt($("#inimigo1").css("left"))
    const INIMIGOY = parseInt($("#inimigo1").css("top"))


    if (COLISAO1.length > 0 || COLISAO2.length > 0) {
        if (COLISAO2.length > 0) {
            pontos = pontos + 100
        }

        if (COLISAO1.length > 0) {
            pontos = pontos - 50
            energiaDoJogador--
        }

        posicaoY = parseInt(Math.random() * 334)
        $("#inimigo1").css("left", 694)
        $("#inimigo1").css("top", posicaoY)
        explosao1(INIMIGOY, INIMIGOX)

    }

    if (COLISAO5.length > 0) {
        salvos++
        audioResgate.play()

        $("#amigo").remove()
        reposicionarAmigo()
    }

    if (COLISAO6.length > 0) {
        perdidos++
        audioPerdido.play()

        const AMIGOX = parseInt($("#amigo").css("left"))
        const AMIGOY = parseInt($("#amigo").css("top"))
        morteAmigo(AMIGOX, AMIGOY)
        $("#amigo").remove()
        reposicionarAmigo()
    }

    if (COLISAO2.length > 0 || COLISAO4.length > 0) {
        $("#disparo").css("left", 950)
        vel += 0.3
    }

    if (COLISAO3.length > 0 || COLISAO4.length > 0) {
        if (COLISAO4.length > 0) {
            pontos = pontos + 50
        }

        if (COLISAO3.length > 0) {
            pontos = pontos - 25
            energiaDoJogador--
        }
        const INIMIGO2X = parseInt($("#inimigo2").css("left"))
        const INIMIGO2Y = parseInt($("#inimigo2").css("top"))
        explosao1(INIMIGO2Y, INIMIGO2X)

        $("#inimigo2").remove()

        reposicionarInimigo2()
    }
}

function explosao1(i1, i2) {
    audioExplosao.play()

    $("#fundoGame").append("<div id='explosao1'></div>")
    $("#explosao1").css("background-image", "url(imgs/explosao.png)")
    let div = $("#explosao1")
    div.css("top", i1)
    div.css("left", i2)
    div.animate({ width: 200, opacity: 0 }, "slow")

    let tempoExplosao = setInterval(removeExplosao, 1000)

    function removeExplosao() {
        div.remove()
        clearInterval(tempoExplosao)
    }
}

function reposicionarInimigo2() {
    const collision = setInterval(reposiciona, 5000)

    function reposiciona() {
        clearInterval(collision)

        if (fimDoJogo === false) {
            $("#fundoGame").append("<div id='inimigo2'></div>")
        }
    }
}

function reposicionarAmigo() {
    const collision = setInterval(reposiciona, 6000)

    function reposiciona() {
        clearInterval(collision)

        if (fimDoJogo === false) {
            $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
        }
    }
}

function morteAmigo(i1, i2) {
    $("#fundoGame").append("<div id='morteAmigo' class='anima4'></div>")
    $("#morteAmigo").css("top", i2)
    $("#morteAmigo").css("left", i1)

    const morteA = setInterval(morte, 1000)

    function morte() {
        $("#morteAmigo").remove()
        clearInterval(morteA)
    }
}

function placar() {
    $("#placar").html(`<h2> Pontos: ${pontos} \n Salvos: ${salvos} \n Perdidos: ${perdidos} </h2>`)
}

function energia() {

    if (energiaDoJogador === 3) {
        return $("#energia").css("background-image", "url(imgs/energia3.png)")
    }
    if (energiaDoJogador === 2) {
        return $("#energia").css("background-image", "url(imgs/energia2.png)")
    }
    if (energiaDoJogador === 1) {
        return $("#energia").css("background-image", "url(imgs/energia1.png)")
    }
    if (energiaDoJogador === 0) {
        $("#energia").css("background-image", "url(imgs/energia0.png)")
        gameOver()
    }
}

function gameOver() {
    fimDoJogo = true
    audioMusica.pause()
    audioGameOver.play()

    clearInterval(JOGO.timer)

    $("#jogador").remove()
    $("#inimigo1").remove()
    $("#inimigo2").remove()
    $("#amigo").remove()

    $("#fundoGame").append("<div id='gameOver'></div>")

    $("#gameOver").html(`<h1>Game Over</h1> 
    <p id='p'>A sua pontuação foi: ${pontos}</p>
    <div id='reiniciar' onclick='reiniciarJogo()'><h3>Jogar novamente</h3></div>`)
}

function reiniciarJogo() {
    audioGameOver.pause()
    $("#gameOver").remove()
    start()
    energiaDoJogador = 3
}