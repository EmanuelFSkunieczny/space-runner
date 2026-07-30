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

## Tecnologias

- HTML5 + CSS3 (Glassmorphism, animações CSS, design responsivo)
- JavaScript ES6+ (orientação a objetos, Game Loop com requestAnimationFrame, colisão AABB, Web Audio API para sons sintetizados)
