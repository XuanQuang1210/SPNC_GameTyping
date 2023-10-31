let game;

const setupGame = () => {
  // define scene
  class GameScene extends Phaser.Scene {
    constructor() {
      super('GameScene');
    }

    preload() {
      console.log('preload');
    }

    create() {
      console.log('create');
    }

    update() {
      console.log('update');
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    backgroundColor: '#000',
    // transparent: true,
    parent: 'game',
    fps: {
      target: 60,
    },
    scene: [GameScene],
  };

  game = new Phaser.Game(config);

  // add event listeners
  game.events.on('start', () => {
    console.log('start');
  });
};

const setupControl = () => {
  const control = document.querySelector('#control');
  const input = control.querySelector('input');
  const button = control.querySelector('button');

  const start = () => {
    try {
      const values = input.value
        .split(',')
        .map((value) => Number(value.trim()));
      if (values.some((value) => isNaN(value)))
        throw new Error('Invalid numbers');
    } catch (err) {
      alert(err.message);
    }
  };

  input.addEventListener('keyup', (e) => {
    if (e.target.value.trim()) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  });

  button.addEventListener('click', start);
};

const main = () => {
  setupGame();
  setupControl();
};

window.addEventListener('DOMContentLoaded', main);
