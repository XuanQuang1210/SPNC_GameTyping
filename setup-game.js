const setupGame = () => {
  const config = {
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#000',
    parent: 'game',
    fps: {
      target: 60,
    },
    scene: [LoadingScene, GameScene],
  };

  const game = new Phaser.Game(config);

  // add event listeners
  game.events.on('start', () => {});

  window.game = game;
};
