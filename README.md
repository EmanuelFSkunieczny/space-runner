# Space Runner 🚀

Um jogo espacial feito com HTML5, CSS3 e JavaScript puro. Controle sua nave, desvie de meteoros e colete cristais de energia!

## Como Jogar

- **Desktop**: Setas `← →` ou `A D` para mover. `P` para pausar, `R` para reiniciar.
- **Mobile**: Botões virtuais na tela.

## Mecânicas

- **Dificuldade progressiva**: a velocidade aumenta com o tempo e com os pontos coletados.
- **Meteoros**: aparecem cada vez mais rápido e em maior quantidade conforme o tempo passa.
- **Cristais**: colete para ganhar 50 pontos. Cada cristal coletado também acelera o jogo.
- **Níveis**: ao atingir 100, 250 e 500 pontos, o nível aumenta, alterando as cores do cenário e intensificando a dificuldade.
- **Recorde**: a melhor pontuação é salva no navegador (localStorage).

## Como executar

```bash
python -m http.server 8080
```

Depois abra `http://localhost:8080` no navegador.

## Controle via Joystick (Arduino)

O jogo suporta controle por joystick via Web Serial API (Chrome/Edge).

### Hardware
- Arduino Uno (ou similar)
- Joystick Shield V1.A

### Pinagem (Joystick Shield V1.A)
| Componente | Pino |
|---|---|
| Eixo X | A0 |
| Eixo Y | A1 |
| Botão A | D2 |
| Botão B | D3 |
| Botão C | D4 |
| Botão D | D5 |
| Botão E | D6 |
| Botão F | D7 |
| Joystick Sel | D8 |

### Setup
1. Conecte o Joystick Shield ao Arduino
2. Abra `arduino/space_runner_joystick/space_runner_joystick.ino` na Arduino IDE
3. Faça upload para a placa
4. No jogo, clique em **"Conectar Joystick"** e selecione a porta serial

## Tecnologias

- HTML5 + CSS3 (Glassmorphism, animações CSS, design responsivo)
- JavaScript ES6+ (orientação a objetos, Game Loop com requestAnimationFrame, colisão AABB, Web Audio API para sons sintetizados, Web Serial API para joystick)
