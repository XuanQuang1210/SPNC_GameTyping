class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    console.log('preload');
  }

  create() {
    this.game.events.on('start', () => {});
  }

  update() {
    console.log('update');
  }
}
