class GuideScene extends Phaser.Scene {
  constructor() {
    super('GuideScene');
  }

  preload() {}

  create() {
    // add bg
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.background.depth = -1;

    // add text
    this.guideText = this.add
      .text(
        width / 2,
        200,
        [
          '1. Xác định điểm đến đầu tiên đó là cánh đồng lúa.',
          '2. Người nông dân bắt đầu tìm đến Cánh đồng ký tự',
          '3. Bắt đầu hành trình thu hoạch vụ mùa của mình.',
          '4. Trong lúc đang thu hoạch, không may người nông dân đã \n bị lạc giữa cánh đồng lúa bao la và không thể tìm được đường trở về.',
        ],
        {
          fontSize: 24,
          fontFamily: 'Arial',
          color: '#000',
        }
      )
      .setOrigin(0.5, 0.5);

    this.guideText.setStroke('#fff', 20);

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
