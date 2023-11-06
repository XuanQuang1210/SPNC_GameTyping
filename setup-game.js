const setupGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: 700,
    height: 500,
    backgroundColor: '#000',
    parent: 'game',
    fps: {
      target: 60,
    },
    scene: [GameScene],
  };

  const game = new Phaser.Game(config);

  // add event listeners
  game.events.on('highlight', (code) => {
    const lines = document.querySelectorAll('.code');
    lines.forEach((line) => (line.style.backgroundColor = 'transparent'));

    const codeLines = document.querySelectorAll(`.code-${code}`);
    codeLines.forEach((line) => (line.style.backgroundColor = 'lightcoral'));
  });

  window.game = game;
};
