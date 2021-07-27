function start() {

    //Vai esconder o bloco de início com instruções
    $("#inicio").hide();

    //Vai trazer o jogadores, inimigos e amigo pro fundo da tela
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>")
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>")
    $("#fundoGame").append("<div id='inimigo2'></div>")
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
    $("#fundoGame").append("<div id='placar'></div>")    
    $("#fundoGame").append("<div id='energia'></div>")    


    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somperdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    musica.addEventListener("ended", function() { musica.currentTime = 0; musica.play();}, false);
    musica.play();

    var jogo = {};

    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var fimDeJogo = false;

    //Variável pra saber se pode atirar
    var podeAtirar = true;

    //Velocidade com que os inimigos vão aparecer
    var velocidade = 5;

    //Qual posição podem aparecer (do chão até o topo)
    var posicaoY = parseInt(Math.random() * 334);

    //Posição das teclas
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    };

    //Se o jogador pressionou a tecla
    jogo.pressionou = [];

    //Verificar se pressionou alguma tecla usando o keydown e vai mostrar qual tecla e.which
    $(document).keydown(function(e) {
        jogo.pressionou[e.which] = true;
    })

    //Se não tiver tecla pressionada, vai aparecer pelo keyup e vai dar como falso
    $(document).keyup(function(e) {
        jogo.pressionou[e.which] = false;
    })

    jogo.timer = setInterval(loop,30);

    //Função pro jogo começar com as animações
    function loop() {
        moveFundo();
        moveJogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }

    //Função para animar o fundo para a esquerda
    function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda-1); 
    }

    //Função pra identificar qual tecla está sendo pressionada
    function moveJogador() {

        //Caso pressione a tecla W, vai subir o jogador
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);

            //Evitar que o jogador suba demais e saia da tela
            if (topo <= 10) {
                $("#jogador").css("top", topo);
            }
        }

        //Caso pressione a tecla S, vai descer o jogador
        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);

            //Evitar que o jogador desça demais, ele vai ficar só até o chão
            if (topo >= 430) {
                $("#jogador").css("top", topo);
            }
        }

        //Caso pressione a tecla D, vai atirar
        if (jogo.pressionou[TECLA.D]) {
            
            disparo();
        }
    }

     //Função pra mover os inimigos1, que são os aviões
     function moveinimigo1() {

        //Inimigo 1 vai voar para a esquerda em qualquer valor randômico da posicaoY
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        //Quando o inimigo1 sair da tela, vai voltar
        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    }

    //Função pra mover os inimigos2, que são os caminhões
    function moveinimigo2() {

        //Inimigo 2 vai dirigir para a esquerda em qualquer valor randômico da posicaoY
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);

        //Quando o inimigo2 sair da tela, vai voltar
        if (posicaoX <= 0) {
            $("#inimigo2").css("left", 775);
        }
    }

    //Função pra animar o amigo
    function moveamigo() {
        
        //O amigo vai andar para a direita
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        //Se sair da tela, vai voltar para a esquerda
        if(posicaoX > 906) {
            $("#amigo").css("left", 0);
        }
    }

    //Função pro jogador disparar contra os inimigos
    function disparo() {
        
        if (podeAtirar == true) {

            somDisparo.play();
            //Assim que o jogador puder atirar, não vai mais poder
            podeAtirar = false;

            //Vai pegar o topo e a posição X do jogador pra saber de onde vai sair o tiro
            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            
            //Vai adicionar pro tiro sair mais pra baixo emais pra a direita
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            //variável de quantot empo vai demorar pra poder disparar novamente
            var tempoDisparo = window.setInterval(executaDisparo, 30);
        }


        //função pra executar o disparo, tirar a imagem do disparo e permitir atirar novamente
        function executaDisparo() {

            posicaoX = parseInt($("#disparo").css("left"));
            //Vai andar 15 unidades
            $("#disparo").css("left", posicaoX + 15);

            if (posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    //função pra saber se alguma div colidiu
    function colisao() {

        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        //Jogador com o inimigo 1
        if (colisao1.length > 0) {
            energiaAtual --;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            //Caso tenha colisão entre os 2 helicópteros, vai reposicionar o inimigo1
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //Jogador com o inimigo 2
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();
        }

        //Disparo contra o inimigo1
        if (colisao3.length > 0) {
        
            velocidade = velocidade + 0.3;
            pontos = pontos + 100;

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

         //Disparo contra o inimigo2
         if (colisao4.length > 0) {

            pontos = pontos + 50;

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();
        }

        //jogador com amigo
        if (colisao5.length > 0) {
            
            somResgate.play();
            salvos++;
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //Amigo com caminhão / inimigo2
        if (colisao6.length > 0) {

            somperdido.play();
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();

            reposicionaAmigo();
        }
    }

    // Explosão 1
    function explosao1(inimigo1X, inimigo1Y) {

        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(dist/imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao,1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }

    // Explosão 2
    function explosao2(inimigo2X, inimigo2Y) {

        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(dist/imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2,1000);

        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    // Explosão 3
    function explosao3(amigoX, amigoY) {

        somPerdido.play();

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("background-image", "url(dist/imgs/amigo_morte.png)");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);

        var tempoExplosao3 = window.setInterval(resetaExplosao3,1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }

    //Vai repoisicionar o inimigo 2 após 5 segundos
    function reposicionaInimigo2() {
        
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimDeJogo == false) {
                $("#fundoGame").append("<div id='inimigo2'></div>")
            }
        }
    }

    //Vai reposicionar o amigo correndo
    function reposicionaAmigo(){
        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimDeJogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
            }
        }
    }

    function placar() {
        
        $("#placar").html("<h2>Pontos: " + pontos +"</h2><h2> Salvos: " + salvos + "</h2><h2> Perdidos: " + perdidos + "</h2>" )
    }

    function energia() {

        if (energiaAtual == 3) {
            $("#energia").css("background-image", "url(dist/imgs/energia3.png)");
        }

        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(dist/imgs/energia2.png)");
        }

        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(dist/imgs/energia1.png)");
        }

        //Game Over
        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(dist/imgs/energia0.png)");
            gameOver();
        }
    }



    function gameOver() {
        
        fimDeJogo = true;
        musica.pause();
        somGameover.play()

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#inicio").remove();

        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html(
        "<h1>Game Over</h1>" +
        "<p>Sua pontuação foi de " + pontos + "</p>" +
        "<button type='button' id='reinicia' onClick=reiniciarJogo();>Jogar Novamente</button>");
    }

}

function reiniciarJogo() {

    somGameover.pause();
    $("#fim").remove();
    start();
}