const words = ['bigbanghello', 'maga', 'justdoit'];

const repeatTimes = 4;
const progressBarSpeed = 0.5;

class Level2Scene extends Phaser.Scene {
  wordIndex = 0;
  word = null;
  characterIndex = 0;
  activeCharacters = [];
  correctCharacterIndexes = [];
  wrongCharacterIndexes = [];
  correct = 0;
  wrong = 0;
  texts = {};
  ended = false;
  score = 0;
  playTime = 0;

  constructor() {
    super('Level2Scene');
  }

  drawResultModal() {
    this.modalResult = {
      container: this.add
        .rectangle(width / 2, height / 2, 500, 250, 0xf2f494)
        .setOrigin(0.5, 0.5)
        .setDepth(2),
      text: this.add
        .text(
          width / 2,
          height / 2 - 30,
          [
            `Hoàn thành cấp độ trung bình`,
            `Số câu đúng: ${this.correct}`,
            `Số câu sai: ${this.wrong}`,
            `Điểm: ${this.score}`,
            `Thời gian: ${calculateTime(this.playTime)}`,
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
          this.scene.start('PreLevel3Scene');
        },
        width: 250,
      }),
    };

    this.modalResult.text.align = 'center';
  }

  drawTexts() {
    if (!Object.keys(this.texts).length) {
      this.texts.correctLabel = this.add.text(width - 200, 20, 'Đúng:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#0f0',
      });

      this.texts.correctValue = this.add.text(
        width - 125,
        20,
        `${this.correct}`,
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#0f0',
        }
      );

      this.texts.wrongLabel = this.add.text(width - 200, 45, 'Sai:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#f00',
      });

      this.texts.wrongValue = this.add.text(width - 135, 45, `${this.wrong}`, {
        fontSize: 24,
        fontWeight: 700,
        color: '#f00',
      });

      this.texts.score = this.add.text(
        width - 200,
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

  generateWord() {
    if (this.wordIndex >= words.length) return;

    this.word = words[this.wordIndex];
    this.characterIndex = 0;
    this.correctCharacterIndexes = [];
    this.wrongCharacterIndexes = [];
    this.progressBar.width = 400;

    // clear old word
    this.activeCharacters.map((character) => character.destroy(true));
    this.activeCharacters = [];

    const wordCharacters = this.word.split('');

    let y = height / 2 - Math.floor(repeatTimes / 2) * 40;
    let x = width / 2 - Math.floor(this.word.length / 2) * 35;
    for (let i = 0; i < repeatTimes; i++) {
      wordCharacters.map((character, index) => {
        const characterText = this.add
          .text(x, y, character, {
            fontSize: 48,
            fontWeight: 700,
            color: i === 0 && index === 0 ? '#000' : '#bbb',
          })
          .setOrigin(0.5, 0.5)
          .setDepth(2);
        this.activeCharacters.push(characterText);
        x += 40;
      });
      y += 45;
      x = width / 2 - Math.floor(this.word.length / 2) * 35;
    }

    if (this.board) {
      this.board.destroy(true);
      this.board = null;
    }

    this.board = this.add
      .rectangle(
        width / 2,
        height / 2,
        this.activeCharacters.at(-1).x -
          this.activeCharacters[0].x +
          this.activeCharacters[0].width / 2 +
          this.activeCharacters.at(-1).width / 2 +
          100,
        this.activeCharacters.at(-1).y -
          this.activeCharacters[0].y +
          this.activeCharacters[0].height / 2 +
          this.activeCharacters.at(-1).height / 2 +
          100,
        0xffffff
      )
      .setOrigin(0.5, 0.5);

    this.drawTexts();
  }

  highlight() {
    if (!this.word) return;

    this.activeCharacters = this.activeCharacters.map(
      (activeCharacter, index) => {
        const text = activeCharacter.text;
        const x = activeCharacter.x;
        const y = activeCharacter.y;

        activeCharacter.destroy(true);

        let color = '#bbb';
        if (index === this.characterIndex) {
          color = '#000';
        } else if (this.correctCharacterIndexes.includes(index)) {
          color = '#0f0';
        } else if (this.wrongCharacterIndexes.includes(index)) {
          color = '#f00';
        }

        return this.add
          .text(x, y, text, {
            fontSize: 48,
            fontWeight: 700,
            color,
          })
          .setOrigin(0.5, 0.5)
          .setDepth(2);
      }
    );

    this.drawTexts();
  }

  drawHandImage() {
    this.handImage = this.add
      .image(width / 2, height, 'hands')
      .setOrigin(0.5, 1);
  }

  gameOver() {
    this.ended = true;
    this.drawResultModal();
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
      this.wrong++;
      if (this.wordIndex < words.length - 1) {
        this.progressBar.width = 400;
        this.wordIndex++;
        this.generateWord();
      } else {
        this.drawTexts();
        this.gameOver();
      }
    } else {
      this.progressBar.width -= progressBarSpeed;
    }
  }

  addKeyboardListener() {
    this.input.keyboard.on('keydown', (event) => {
      if (this.ended) return;

      const now = Date.now();
      if (this.lastTimeKeyDown) {
        const diff = now - this.lastTimeKeyDown;
        if (diff < 50) return;
      }

      this.lastTimeKeyDown = now;

      if (event.key === this.activeCharacters[this.characterIndex]?.text) {
        this.correctCharacterIndexes.push(this.characterIndex);
      } else {
        this.wrongCharacterIndexes.push(this.characterIndex);
      }

      this.characterIndex++;

      if (
        this.correctCharacterIndexes.length +
          this.wrongCharacterIndexes.length ===
        this.word.length * repeatTimes
      ) {
        if (this.wrongCharacterIndexes.length > 0) {
          this.wrong++;
          this.score += this.correctCharacterIndexes.length;
        } else {
          this.correct++;
          this.score +=
            this.correctCharacterIndexes.length + this.progressBar?.width
              ? Math.round(this.progressBar?.width / 10)
              : 0;
        }

        this.wordIndex++;
        if (this.wordIndex < words.length) {
          this.generateWord();
        } else {
          this.drawTexts();
          this.gameOver();
        }
      } else {
        this.highlight();
      }
    });
  }

  updateTime(delta) {
    if (this.ended) return;
    this.playTime += delta;
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

    this.drawHandImage();
    this.updateProgressBar();
    this.generateWord();
    this.addKeyboardListener();
  }

  update(_, delta) {
    this.updateProgressBar();
    this.updateTime(delta);
  }
}
