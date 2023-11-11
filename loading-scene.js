const { width, height } = configs;

class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene');
  }

  preload() {
    this.load.image('background', './images/bg.jpeg');
    this.load.image('bg1', './images/bg1.jpeg');
    this.load.image('bg2', './images/bg2.jpeg');
    this.load.image('bg3', './images/bg3.jpeg');
    this.load.image('clock', './images/clock.png');
    this.load.image('hands', '/images/hands.png');
    this.load.image('hands_0', '/images/hands_0.png');
    this.load.image('hands_1', '/images/hands_1.png');
    this.load.image('hands_2', '/images/hands_2.png');
    this.load.image('hands_3', '/images/hands_3.png');
    this.load.image('hands_4', '/images/hands_4.png');
    this.load.image('hands_5', '/images/hands_5.png');
    this.load.image('hands_6', '/images/hands_6.png');
    this.load.image('hands_7', '/images/hands_7.png');
    this.load.audio('bg-music', '/sounds/bg-music.mp3');
    this.load.audio('correct-sound', '/sounds/correct.mp3');
    this.load.audio('wrong-sound', '/sounds/wrong.mp3');
    this.load.audio('keyboard-sound', '/sounds/keyboard.mp3');
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
      color: '#E1BC3A',
      fontSize: 64,
      fontWeight: 'bold',
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
        this.scene.start('PreLevel1Scene');
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
        this.scene.start('GuideScene');
      },
      width: 250,
    });

    // sound
    if (!window.soundOn) {
      this.sound.pauseOnBlur = false;
      const bgMusic = this.sound.add('bg-music');
      bgMusic.loop = true;
      bgMusic.play();
      window.soundOn = true;
    }
  }

  update() {
    console.log('update');
  }
}
