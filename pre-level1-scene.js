class PreLevel1Scene extends Phaser.Scene {
  constructor() {
    super('PreLevel1Scene');
  }

  preload() {}

  create() {
    // add bg
    this.background = this.add.image(0, 0, 'bg1').setOrigin(0, 0);
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.background.depth = -1;

    this.levelText = this.add
      .text(width / 2, 100, 'CẤP ĐỘ DỄ', {
        fontSize: 40,
        fontFamily: 'Arial',
        color: '#000',
      })
      .setOrigin(0.5, 0.5)
      .setStroke('#fff', 20);

    this.levelNameText = this.add
      .text(width / 2, 150, 'CÁNH ĐỒNG LÚA', {
        fontSize: 40,
        fontFamily: 'Arial',
        color: '#000',
      })
      .setOrigin(0.5, 0.5)
      .setStroke('#fff', 20);

    // add text
    this.guideText = this.add
      .text(
        width / 2,
        300,
        [
          'Em hãy giúp người nông dân gõ đúng các kí tự xuất hiện \n trên đường đi để lần theo dấu vết để đưa người nông dân \n thoát khỏi cánh đồng nhé.',
        ],
        {
          fontSize: 24,
          fontFamily: 'Arial',
          color: '#000',
        }
      )
      .setOrigin(0.5, 0.5)
      .setStroke('#fff', 20);

    this.startBtn = new Button(this, {
      text: `Bắt đầu`,
      x: width / 2,
      y: height - 150,
      textColor: '#000',
      btnColor: 0xf2f494,
      onClick: () => {
        this.scene.start('Level1Scene');
      },
      width: 250,
    });

    this.backBtn = new Button(this, {
      text: `Quay lại`,
      x: width / 2,
      y: height - 80,
      textColor: '#000',
      btnColor: 0xf2f494,
      onClick: () => {
        this.scene.start('LoadingScene');
      },
      width: 250,
    });
  }

  update() {
    console.log('update');
  }
}
