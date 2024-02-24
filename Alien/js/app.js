    // Define as dimensões do jogo
    const larguraJogo = 700; // Largura do jogo
    const alturaJogo = 850; // Altura do jogo

    // Configuração do jogo usando o framework Phaser
    const config = {
    type: Phaser.AUTO, // Define o tipo de renderização (automático)
    width: larguraJogo, // Define a largura do jogo
    height: alturaJogo, // Define a altura do jogo

    // Ativando a física no jogo
    physics: {
        default: 'arcade', // Define o tipo de física como arcade
        arcade: {
            gravity: { y: 300 }, // Define a gravidade do mundo
            debug: true // Modo de depuração para mostrar colisões
        }
    },

    // Define as funções de cena do jogo
    scene: {
        preload: preload, // Função para pré-carregar recursos do jogo
        create: create, // Função para criar os elementos do jogo
        update: update // Função para atualizar o jogo 
    }
};

// Inicializa o jogo com a configuração fornecida
const game = new Phaser.Game(config);

// Declaração das variáveis globais
let alien; // Variável para guardar o alienígena 
let teclado; // Variável para armazenar o estado do teclado
let fogo; // Variável para guardar o sprite do fogo (nave turbo) 
let plataforma; // Variável para guardar a plataforma 
let moeda; // Variável para guardar a moeda 
let moedasColetadas = []; // Lista para armazenar as moedas coletadas
let pontuacao = 0; // Variável para guardar a pontuação, inicializada com 0.
let placar; // Variável para guardar o texto do placar

// Função para pré-carregar recursos do jogo
function preload() {
    this.load.image('background', 'assets/bg.png'); // Carrega uma imagem de fundo
    this.load.image('player', 'assets/alienigena.png'); // Carrega a imagem do alienígena
    this.load.image('turbo_nave', 'assets/turbo.png'); // Carrega a imagem da nave turbo
    this.load.image('plataforma_tijolo', 'assets/tijolos.png'); // Carrega a imagem da plataforma de tijolos
    this.load.image('moeda', 'assets/moeda.png'); // Carrega a imagem da moeda
}

// Função para criar os elementos do jogo
function create() {
    this.add.image(larguraJogo / 2, alturaJogo / 2, 'background'); // Adiciona a imagem de fundo ao centro da tela do jogo
    fogo = this.add.sprite(0, 0, 'turbo_nave').setVisible(false); // Adiciona a imagem do turbo

    alien = this.physics.add.sprite(larguraJogo / 2, 0, 'player'); // Adiciona a imagem do alienígena
    alien.setCollideWorldBounds(true); // Define que o alienígena colide com os limites do mundo
    alien.body.setSize(120, 100, true); // Define o tamanho do corpo de colisão do alienígena
    teclado = this.input.keyboard.createCursorKeys(); // Cria a entrada do teclado

    // Adiciona a plataforma
    plataforma = this.physics.add.staticImage(larguraJogo / 2, alturaJogo / 2, 'plataforma_tijolo'); // Adiciona a imagem da plataforma

    // Adiciona as plataformas adicionais
    plataformaEsquerda = this.physics.add.staticImage(larguraJogo / 4, alturaJogo / 1.3, 'plataforma_tijolo'); // Adiciona a imagem da plataforma
    plataformaDireita = this.physics.add.staticImage((larguraJogo / 4) * 3, alturaJogo / 1.4, 'plataforma_tijolo'); // Adiciona a imagem da plataforma

    // Configura a colisão entre o alienígena e as plataformas de tijolos
    this.physics.add.collider(alien, plataforma);
    this.physics.add.collider(alien, plataformaEsquerda);
    this.physics.add.collider(alien, plataformaDireita);

    // Adicionando a moeda
    moeda = this.physics.add.sprite(larguraJogo / 2, 0, 'moeda'); // Adiciona a imagem da moeda
    moeda.setCollideWorldBounds(true); // Define que a moeda colide com os limites do mundo
    moeda.setBounce(0.7); // Define o coeficiente de restituição da moeda
    this.physics.add.collider(moeda, plataforma); // Configura a colisão da moeda com a plataforma
    this.physics.add.collider(moeda, plataformaEsquerda); // Configura a colisão da moeda com a plataforma esquerda
    this.physics.add.collider(moeda, plataformaDireita); // Configura a colisão da moeda com a plataforma direita


    // Adicionando placar (?)
    placar = this.add.text(50, 50, 'Moedas:' + pontuacao, {fontSize: '45px', fill: '#495613'});

    // Quando o Alien encostar na moeda...
    this.physics.add.overlap(alien, moeda, function () {
    moeda.setVisible(false); // Oculta a moeda
    var posicaoMoeda_Y = Phaser.Math.Between(50, 650); // Gera uma posição Y aleatória para a próxima moeda
    moeda.setPosition(posicaoMoeda_Y, 100); // Define a nova posição da moeda
    pontuacao += 1; // Incrementa a pontuação
    placar.setText('Moedas: ' + pontuacao); // Atualiza o texto do placar com a nova pontuação
    moeda.setVisible(true); // Torna a moeda visível novamente para a próxima interação

    // Adiciona a moeda coletada à lista de moedas
    moedasColetadas.push(moeda);
    });

}

// Função para atualizar o jogo
function update() {
    // Movimento horizontal do alienígena
    if (teclado.left.isDown) {
        alien.setVelocityX(-150); // Move para a esquerda
    } else if (teclado.right.isDown) {
        alien.setVelocityX(150); // Move para a direita
    } else {
        alien.setVelocityX(0); // Sem movimento horizontal
    }

    // Movimento vertical do alienígena e ativação do turbo
    if (teclado.up.isDown) {
        alien.setVelocityY(-150); // Move para cima
        ativarTurbo(); // Ativa o turbo
    } else {
        semTurbo(); // Desativa o turbo
    }

    // Atualiza a posição do fogo para aparecer logo abaixo do alienígena
    fogo.setPosition(alien.x, alien.y + alien.height / 2);
}

// Função para ativar o turbo
function ativarTurbo() {
    fogo.setVisible(true); // Torna o fogo visível
}

// Função para desativar o turbo
function semTurbo() {
    fogo.setVisible(false); // Oculta o fogo
}
