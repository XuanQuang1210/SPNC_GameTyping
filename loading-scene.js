const { width, height } = configs;

class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene');
  }

  preload() {
    console.log('preload loading scene');
    this.load.image('background', './images/bg.jpeg');
  }

  create() {
    // add bg
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.background.depth = -1;

    // add text
    this.gameName = this.add.text(width / 2, 200, 'Ong vàng dạo vườn hoa', {
      fontFamily: 'Arial',
      color: '#000',
      fontSize: 64,
      fontWeight: 700,
    });
    this.gameName.setOrigin(0.5, 0.5);
    this.gameName.align = 'center';
    this.gameName.setStroke('#fff', 20);

    // add buttons
    this.startBtn = new Button(this, {
      text: `Bắt đầu`,
      x: width / 2,
      y: height - 150,
      textColor: '#000',
      btnColor: 0xf2f494,
      onClick: () => {
        console.log('Start');
      },
      width: 250,
    });

    this.guideBtn = new Button(this, {
      text: `Hướng dẫn`,
      x: width / 2,
      y: height - 80,
      textColor: '#000',
      btnColor: 0xf2f494,
      onClick: () => {
        console.log('Guide');
      },
      width: 250,
    });

    this.game.events.on('start', () => {});
  }

  update() {
    console.log('update');
  }
}
