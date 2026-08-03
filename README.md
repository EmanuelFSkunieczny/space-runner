# Space Runner 🚀

**Space Runner** é um jogo espacial estilo arcade acelerado, desenvolvido com **HTML5, CSS3 e JavaScript puro (ES6+)**. O projeto combina um visual moderno em *Glassmorphism*, sistema de partículas dinâmico, efeitos sonoros sintetizados via Web Audio API e suporte a controle físico com **Arduino** via Web Serial API.

---

## 📋 Sumário

- [Destaques e Recursos](#-destaques-e-recursos)
- [Como Jogar](#-como-jogar)
- [Mecânicas de Jogo](#-mecânicas-de-jogo)
- [Como Executar](#-como-executar)
- [Controle via Joystick (Arduino)](#-controle-via-joystick-arduino)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura & Tecnologias](#-arquitetura--tecnologias)

---

## ✨ Destaques e Recursos

- 🎮 **Múltiplos Métodos de Controle**: Suporte nativo a teclado, botões de toque responsivos para dispositivos móveis e Joystick analógico via Arduino.
- 🔊 **Áudio 100% Sintetizado**: Som retro gerado por osciladores nativos usando **Web Audio API** — sem necessidade de arquivos externos de áudio (`.mp3` / `.wav`).
- 🎆 **Sistema de Partículas e Efeitos Visuais**: Animações de explosão, efeitos de impacto/dano na tela, pontuação flutuante e estrelas animadas em camadas no fundo.
- 🎨 **Design Glassmorphism Moderno**: Interface futurista com fontes Orbitron/Inter, efeitos de transparência e transição dinâmica de cores a cada mudança de nível.
- 🏆 **Sistema de Recorde (High Score)**: Salvamento automático da melhor pontuação no navegador usando `localStorage`.
- ⚡ **Game Loop de Alta Performance**: Motor de física baseado em `requestAnimationFrame`, sincronização por *Delta Time* e contador de FPS.

---

## 🕹️ Como Jogar

| Plataforma | Controles | Ações |
| :--- | :--- | :--- |
| **Desktop** | Setas `←` `→` ou teclas `A` `D` | Mover a nave para Esquerda / Direita |
| **Desktop** | Tecla `P` | Pausar / Despausar o jogo |
| **Desktop** | Tecla `R` | Reiniciar partida |
| **Mobile** | Botões virtuais na tela (`◀` `▶`) | Mover a nave para Esquerda / Direita |
| **Arduino** | Analógico X (Joystick Shield) | Mover a nave para Esquerda / Direita |

---

## 🎯 Mecânicas de Jogo

- **❤️ Sistema de Vidas**: O jogador inicia com 3 vidas. Colidir com um meteoro consome 1 vida, gera uma explosão de dano e aplica um flash vermelho na tela.
- **☄️ Meteoros**: Obstáculos caindo continuamente. Conforme o tempo avança, a quantidade e a velocidade de queda dos meteoros aumentam progressivamente (até 5 meteoros simultâneos).
- **💎 Cristais de Energia**: Itens coletáveis que concedem **+50 pontos** cada, acompanhados de som sintetizado e animação de partículas azuis.
- **🎯 Progressão de Níveis**:
  - **Nível 1** (0–99 pts): Ritmo inicial do jogo.
  - **Nível 2** (100 pts): Incremento de velocidade e mudança na tonalidade da tela (tom dourado).
  - **Nível 3** (250 pts): Aumento no ritmo de spawn e transição temática verde/neon.
  - **Nível 4** (500 pts): Dificuldade máxima e transição temática para violeta/roxo.

---

## 🚀 Como Executar

Por utilizar a Web Serial API (opcional para o Joystick) e módulos web modernos, recomenda-se rodar o projeto através de um servidor local.

### Usando Python (Recomendado)
No terminal, dentro da pasta do projeto, execute:

```bash
python -m http.server 8080
```

Abra o navegador em: [http://localhost:8080](http://localhost:8080)

### Usando VS Code Live Server
1. Abra a pasta do projeto no VS Code.
2. Com a extensão **Live Server** instalada, clique em **Go Live** no canto inferior direito.

---

## 🕹️ Controle via Joystick (Arduino)

O jogo possui integração direta com a **Web Serial API**, permitindo conectar um Arduino com Joystick Shield para controlar a nave diretamente pelo hardware (compatível com Google Chrome e Microsoft Edge).

### 🛠️ Hardware Necessário
- **Arduino Uno** (ou placa compatível)
- **Joystick Shield V1.A**
- Cabo USB para conexão ao computador

### 📌 Mapeamento dos Pinos (Joystick Shield V1.A)

| Componente | Pino Arduino | Função |
| :--- | :--- | :--- |
| **Eixo X (Analógico)** | `A0` | Movimento Esquerda / Direita |
| **Eixo Y (Analógico)** | `A1` | Eixo Y (reservado) |
| **Botão A** | `D2` | Ação A |
| **Botão B** | `D3` | Ação B |
| **Botão C** | `D4` | Ação C |
| **Botão D** | `D5` | Ação D |
| **Botão E** | `D6` | Ação E |
| **Botão F** | `D7` | Ação F |
| **Joystick Sel** | `D8` | Botão central do analógico |

### ⚙️ Instruções de Setup do Arduino
1. Conecte o **Joystick Shield V1.A** no Arduino.
2. Conecte o Arduino ao computador via USB.
3. Abra a **Arduino IDE** e carregue o código localizado em:
   `arduino/space_runner_joystick/space_runner_joystick.ino`
4. Garanta que a taxa de transmissão esteja configurada em **115200 Baud**.
5. Faça o Upload do firmware para a placa.
6. Na tela inicial do jogo, clique no botão **"🎮 Conectar Joystick"** e selecione a porta COM correspondente ao seu Arduino.

---

## 📁 Estrutura do Projeto

```text
space-runner/
├── index.html              # Interface do jogo, telas, HUD e estrutura HTML5
├── style.css               # Estilos futuristas, glassmorphism, temas e animações CSS
├── script.js               # Motor principal do jogo, áudio, partículas, colisão e serial
├── spaceship.png           # Sprite da nave espacial
├── README.md               # Documentação do projeto
└── arduino/
    └── space_runner_joystick/
        └── space_runner_joystick.ino # Firmware C++ para o Arduino Joystick Shield
```

---

## 🧩 Arquitetura & Tecnologias

- **HTML5 Semantic**: Estruturação de telas via `<section>` e HUD acessível.
- **CSS3 / Modern Styling**: Flexbox, CSS Grid, Glassmorphism, variáveis CSS dinâmicas para troca de temas e fundo de estrelas animado com `box-shadow`.
- **JavaScript ES6+ (Orientado a Objetos)**:
  - `SpaceRunnerGame`: Gerenciador central do estado, fluxo de telas, loop de jogo e HUD.
  - `Ship`: Entidade da nave com limitação de bordas e renderização no DOM.
  - `Meteor` & `Crystal`: Entidades dinâmicas com spawn e remoção automática ao sair da viewport.
  - `Particle`: Sistema de partículas leve para explosões.
  - `SoundManager`: Sintetizador de áudio procedural com `AudioContext`, osciladores (`sine`, `sawtooth`, `triangle`) e rampas de frequência/ganho.
  - `JoystickManager`: Comunicação serial assíncrona (`ReadableStream`) com parse de protocolo CSV em tempo real.
- **Detecção de Colisão**: Algoritmo AABB (*Axis-Aligned Bounding Box*) ajustado com margens de tolerância para gameplay preciso.
