const questions = [
  {
    id: 1,
    texts: [
      'Con gì chân ngắn',
      'Mà lại có màng',
      'Mỏ bẹt màu vàng',
      'Hay kêu cạp cạp',
    ],
    answer: 'Con vịt',
  },
  {
    id: 2,
    texts: [
      'Con gì mào đỏ',
      'Gáy ò ó o...',
      'Từ sáng tinh mơ',
      'Gọi người thức giấc',
    ],
    answer: 'Con gà trống',
  },
  {
    id: 3,
    texts: [
      'Ruột trắng như bột',
      'Rắc hột vừng đen',
      'Mặc áo đỏ hồng',
      'Tóc xanh ngăn ngắt',
    ],
    answer: 'Quả thanh long',
  },
  {
    id: 4,
    texts: [
      'Chỉ ăn cỏ non',
      'Uống nguồn nước sạch',
      'Mà tôi tặng bạn',
      'Rất nhiều sữa tươi',
    ],
    answer: 'Con bò sữa',
  },
  {
    id: 5,
    texts: ['Quê em ở chốn đảo xa', 'An Tiêm thuở ấy làm quà tặng vua'],
    answer: 'Quả dưa hấu',
  },
];

const toLowerCaseNonAccentVietnamese = (str) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
};

const level3ReduceStep = 0.5;

class Level3Scene extends Phaser.Scene {
  questionIndex = 0;
  characterIndex = 0;
  correct = 0;
  wrong = 0;
  texts = {};
  ended = false;
  score = 0;
  answerInputs = [];

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
            `Hoàn thành cấp độ khó`,
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
        text: `Xem kết quả`,
        x: width / 2,
        y: height / 2 + 80,
        textColor: '#fff',
        btnColor: 0x6666ff,
        onClick: () => {
          this.scene.start('ResultScene');
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

  drawQuestion() {
    if (this.questionText) {
      this.questionText.destroy(true);
      this.questionText = null;
    }

    if (this.questionContainer) {
      this.questionContainer.destroy(true);
      this.questionContainer = null;
    }

    this.questionText = this.add
      .text(width / 2, height / 2 - 50, this.question.texts, {
        fontSize: 32,
        fontWeight: 700,
        color: '#000',
      })
      .setOrigin(0.5, 0.5)
      .setDepth(1);

    this.questionContainer = this.add
      .rectangle(
        width / 2,
        height / 2 - 50,
        this.questionText.width + 100,
        this.questionText.height + 50,
        0xffffff
      )
      .setOrigin(0.5, 0.5);
  }

  drawAnswer() {
    if (this.answerTexts) {
      this.answerTexts.map((answerText) => {
        answerText.destroy(true);
      });
      this.answerTexts = [];
    }

    if (this.answerContainer) {
      this.answerContainer.destroy(true);
      this.answerContainer = null;
    }

    const answerCharacters = this.question.answer.split('');
    let x = width / 2 - Math.floor(answerCharacters.length / 2) * 20;
    this.answerTexts = answerCharacters.map((character) => {
      const answerCharacter = this.add
        .text(x, height - 100, character, {
          fontSize: 32,
          fontWeight: 700,
          color: '#ddd',
        })
        .setOrigin(0.5, 0.5)
        .setDepth(1);

      x += 20;
      return answerCharacter;
    });

    this.answerContainer = this.add
      .rectangle(
        width / 2,
        height - 100,
        this.answerTexts.at(-1).x -
          this.answerTexts[0].x +
          this.answerTexts[0].width / 2 +
          this.answerTexts.at(-1).width / 2 +
          100,
        this.answerTexts[0].height + 50,
        0xffffff
      )
      .setOrigin(0.5, 0.5);
  }

  generateQuestion() {
    this.question = questions[this.questionIndex];
    this.characterIndex = 0;
    this.answerInputs = [];
    this.progressBar && (this.progressBar.width = 400);

    this.drawQuestion();
    this.drawAnswer();
    this.drawTexts();
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
      if (this.questionIndex < questions.length - 1) {
        this.progressBar.width = 400;
        this.questionIndex++;
        this.generateQuestion();
      } else {
        this.drawTexts();
        this.gameOver();
      }
    } else {
      this.progressBar.width -= level3ReduceStep;
    }
  }

  highlight() {
    this.answerTexts = this.answerTexts.map((item, index) => {
      const text = item.text;
      const x = item.x;
      const y = item.y;

      item.destroy(true);

      const answerInputCharacter = this.answerInputs[index];
      let color = '#ddd';
      if (answerInputCharacter) {
        if (
          toLowerCaseNonAccentVietnamese(answerInputCharacter) ===
          toLowerCaseNonAccentVietnamese(text)
        ) {
          color = '#0f0';
        } else {
          color = '#f00';
        }
      }

      return this.add
        .text(x, y, text, {
          fontSize: 32,
          fontWeight: 700,
          color,
        })
        .setOrigin(0.5, 0.5)
        .setDepth(2);
    });
  }

  checkAnswer() {
    const valid = this.answerTexts.every((item, index) => {
      return (
        toLowerCaseNonAccentVietnamese(item.text) ===
        toLowerCaseNonAccentVietnamese(this.answerInputs[index] || '')
      );
    });

    if (valid) {
      this.correct++;
      this.score += Math.floor(this.progressBar.width);
    } else {
      this.wrong++;
    }

    this.drawTexts();
    if (this.questionIndex < questions.length - 1) {
      this.questionIndex++;
      this.generateQuestion();
    } else {
      this.gameOver();
    }
  }

  addKeyboardListener() {
    this.input.keyboard.on('keydown', (event) => {
      if (this.ended) return;
      if (
        ![...characters, 'BACKSPACE', ' ', 'ENTER'].includes(
          event.key?.toUpperCase()
        )
      )
        return;

      if (event.key === 'Backspace') {
        this.answerInputs.pop();
      } else if (event.key === 'Enter') {
        this.checkAnswer();
      } else {
        this.answerInputs.push(event.key);
      }

      this.highlight();
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

    // this.drawBoard();
    this.updateProgressBar();
    this.generateQuestion();
    this.addKeyboardListener();
  }

  update() {
    this.updateProgressBar();
  }
}
