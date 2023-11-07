const px = 10;
const py = 10;
const radius = 4;

class Button extends Phaser.GameObjects.Graphics {
  constructor(
    scene,
    {
      x,
      y,
      text,
      onClick,
      btnColor = 0xf2f494,
      textColor = '#000',
      fontSize = 24,
      fontFamily = 'Arial',
      paddingX = px,
      paddingY = py,
      borderRadius = radius,
      width = 0,
      height = 0,
      borderColor,
    }
  ) {
    super(scene, { x, y });
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(btnColor, 1);
    this.graphics.setDepth(3);

    this.text = scene.add
      .text(x, y, text, { fontFamily, color: textColor, fontSize })
      .setOrigin(0.5, 0.5);

    const rectWidth = width
      ? width + 2 * paddingX
      : this.text.width + 2 * paddingX;
    const rectHeight = this.text.height + 2 * paddingY;
    const rectX = width
      ? x - paddingX - width / 2
      : x - paddingX - this.text.width / 2;
    const rectY = y - paddingY - this.text.height / 2;

    this.graphics.fillRoundedRect(
      rectX,
      rectY,
      rectWidth,
      rectHeight,
      borderRadius
    );
    if (borderColor) {
      this.borderGraphics = scene.add.graphics();
      this.borderGraphics.lineStyle(2, borderColor, 1);
      this.borderGraphics.strokeRoundedRect(
        rectX,
        rectY,
        rectWidth,
        rectHeight,
        borderRadius
      );
      this.borderGraphics.setDepth(3);
    }
    // this.graphics.fillRoundedRect(8, 8, this.text.width + 20, this.text.height + 20, 16);
    // this.graphics.depth = 2;

    if (onClick) {
      const horizontalPadding = (rectWidth - this.text.width) / 2;
      const verticalPadding = (rectHeight - this.text.height) / 2;
      this.text.setPadding(horizontalPadding, verticalPadding);

      this.text.setInteractive({ useHandCursor: true });
      this.text.on('pointerdown', onClick);
    }
    this.text.setDepth(3);
  }

  setDepth(depth) {
    this.graphics.setDepth(depth);
    this.text.setDepth(depth);
    this.borderGraphics?.setDepth(depth);
    this.text.visible = depth > 0;
  }

  destroy() {
    this.graphics.destroy(true);
    this.text.destroy(true);
    this.borderGraphics?.destroy();
  }
}
