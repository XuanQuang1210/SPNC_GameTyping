class PreLevel2Scene extends Phaser.Scene {
  constructor() {
    super('PreLevel2Scene');
  }

  preload() {}

  create() {
    // add bg
    this.background = this.add.image(0, 0, 'bg2').setOrigin(0, 0);
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.background.depth = -1;

    this.levelText = this.add
      .text(width / 2, 100, 'CẤP ĐỘ TRUNG BÌNH', {
        fontSize: 40,
        fontFamily: 'Arial',
        color: '#000',
      })
      .setOrigin(0.5, 0.5)
      .setStroke('#fff', 20);

    this.levelNameText = this.add
      .text(width / 2, 150, 'VƯỜN HOA QUẢ', {
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
          'Người chơi sẽ phải thực hiện đánh các cụm từ \n để diệt trừ sâu bọ đang phá huỷ hoa quả.',
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
        this.scene.start('Level2Scene');
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
