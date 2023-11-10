const hands = {
  0: ['Q', 'A', 'Z'],
  1: ['W', 'S', 'X'],
  2: ['E', 'D', 'C'],
  3: ['R', 'F', 'V', 'T', 'G', 'B'],
  4: ['Y', 'H', 'N', 'U', 'J', 'M'],
  5: ['I', 'K'],
  6: ['O', 'L'],
  7: ['P'],
};

const characters = Object.values(hands).reduce(
  (result, items) => [...result, ...items],
  []
);

const reduceStep = 2;
const numberOfQuestions = 20;

class Level3Scene extends Phaser.Scene {
  handIndex = null;
  character = null;
  correct = 0;
  wrong = 0;
  texts = {};
  ended = false;
  score = 0;

  constructor() {
    super('Level3Scene');
  }

  drawResultModal() {
    this.modalResult = {
      container: this.add
        .rectangle(width / 2, height / 2, 400, 250, 0xf2f494)
        .setOrigin(0.5, 0.5)
        .setDepth(2),
      text: this.add
        .text(
          width / 2,
          height / 2 - 30,
          [
            `Hoàn thành cấp độ dễ`,
            `Số câu đúng: ${this.correct}`,
            `Số câu sai: ${this.wrong}`,
            `Điểm: ${this.score}`,
          ],
          {
            fontFamily: 'Arial',
            color: '#000',
            fontSize: 30,
            fontWeight: 'bold',
          }
        )
        .setOrigin(0.5, 0.5)
        .setDepth(2),
      nextButton: new Button(this, {
        text: `Cấp độ tiếp theo`,
        x: width / 2,
        y: height / 2 + 80,
        textColor: '#fff',
        btnColor: 0x6666ff,
        onClick: () => {
          this.scene.start('PreLevel2Scene');
        },
        width: 250,
      }),
    };

    this.modalResult.text.align = 'center';
  }

  drawBoard() {
    this.board = this.add
      .rectangle(width / 2, height / 2, 200, 200, 0xffffff)
      .setOrigin(0.5, 0.5);
  }

  drawTexts() {
    if (!Object.keys(this.texts).length) {
      this.texts.correctLabel = this.add.text(width - 150, 20, 'Đúng:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#0f0',
      });

      this.texts.correctValue = this.add.text(
        width - 75,
        20,
        `${this.correct}`,
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#0f0',
        }
      );

      this.texts.wrongLabel = this.add.text(width - 150, 45, 'Sai:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#f00',
      });

      this.texts.wrongValue = this.add.text(width - 85, 45, `${this.wrong}`, {
        fontSize: 24,
        fontWeight: 700,
        color: '#f00',
      });

      this.texts.score = this.add.text(
        width - 150,
        70,
        `Score: ${this.score}`,
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#000',
        }
      );

      return;
    }

    this.texts.correctValue.text = `${this.correct}`;
    this.texts.wrongValue.text = `${this.wrong}`;
    this.texts.score.text = `Score: ${this.score}`;
  }

  drawCharacter() {
    const characterList = hands[this.handIndex];
    const index = Math.floor(Math.random() * characterList.length);
    this.character = characterList[index];

    if (this.characterText) {
      this.characterText.destroy(true);
      this.characterText = null;
    }

    this.characterText = this.add
      .text(width / 2, height / 2, this.character, {
        fontSize: 100,
        fontWeight: 700,
        fontFamily: 'Itim',
        color: '#000',
      })
      .setOrigin(0.5, 0.5);
  }

  generateCharacter() {
    const newIndex = Math.floor(Math.random() * 8);
    this.handIndex = newIndex;
    this.drawHandImage();
    this.drawCharacter();
    this.drawTexts();
    this.progressBar && (this.progressBar.width = 400);
  }

  drawHandImage() {
    if (this.handImage) {
      this.handImage.destroy(true);
      this.handImage = null;
    }
    const url = this.handIndex ? `hands_${this.handIndex}` : `hands`;
    this.handImage = this.add.image(width / 2, height, url).setOrigin(0.5, 1);
  }

  updateProgressBar() {
    if (this.ended) return;

    if (!this.progressBar) {
      this.clock = this.add.image(20, 20, 'clock').setOrigin(0, 0);
      this.progressBar = this.add
        .rectangle(100, 40, 400, 30, 0x6666ff)
        .setOrigin(0, 0);

      return;
    }

    if (this.progressBar.width === 0) {
      this.progressBar.width = 400;
      this.wrong++;
      this.generateCharacter();
    } else {
      this.progressBar.width -= reduceStep;
    }
  }

  addKeyboardListener() {
    this.input.keyboard.on('keydown', (event) => {
      if (this.ended) return;

      if (event.key?.toUpperCase() === this.character) {
        this.correct++;
        this.score += this.progressBar?.width
          ? Math.round(this.progressBar?.width / 10)
          : 0;
      } else {
        this.wrong++;
      }

      this.generateCharacter();
      if (this.correct + this.wrong === numberOfQuestions) {
        this.ended = true;
        this.drawResultModal();
      }
    });
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

    this.drawBoard();
    this.updateProgressBar();
    this.generateCharacter();
    this.addKeyboardListener();
  }

  update() {
    this.updateProgressBar();
  }
}
