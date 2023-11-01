let game;

const setupGame = () => {
  // define scene
  class GameScene extends Phaser.Scene {
    values = [];
    value = null;
    bars = [];
    valueText = null;
    resultText = null;

    constructor() {
      super('GameScene');
    }

    preload() {
      console.log('preload');
    }

    create() {
      this.game.events.on('start', ({ values, value }) =>
        this.start({ values, value })
      );
    }

    update() {
      console.log('update');
    }

    start({ values, value }) {
      // clear
      this.bars.map((bar) => {
        bar.rect.destroy(true);
        bar.valueText.destroy(true);
        bar.indexText.destroy(true);
        bar.barNoteText?.destroy(true);
      });
      this.bars = [];

      this.valueText?.destroy(true);
      this.valueText = null;

      this.resultText?.destroy(true);
      this.resultText = null;

      // assign new values
      this.values = values.sort((value1, value2) => value1 - value2);
      this.value = value;

      this.draw();
      this.run();
    }

    draw() {
      this.valueText = this.add.text(50, 50, `Searching value: ${this.value}`, {
        color: '#fff',
        fontSize: 12,
      });

      this.values.map((value, index) => {
        const rect = this.add.rectangle(
          50 + index * 30,
          400,
          25,
          value * 3,
          0xffffff,
          1
        );
        rect.setOrigin(0, 1);

        const valueText = this.add.text(
          50 + index * 30 + 12,
          400 - value * 3 - 10,
          `${value}`,
          { color: '#fff', fontSize: 12 }
        );
        valueText.setOrigin(0.5, 0.5);

        const indexText = this.add.text(50 + index * 30 + 12, 410, `${index}`, {
          color: '#fff',
          fontSize: 12,
        });
        indexText.setOrigin(0.5, 0.5);

        this.bars[index] = {
          rect,
          valueText,
          indexText,
          x: 50 + index * 30,
          y: 400,
        };
      });
    }

    clearBarNote() {
      this.bars.map((bar) => {
        console.log(bar.barNoteText);
        bar.barNoteText?.destroy(true);
      });
    }

    drawBarNote(index, text, color) {
      const bar = this.bars[index];
      const { x, y, rect, indexText, valueText } = bar;
      // rect.setFillStyle(color, 1);
      // indexText.setTint(hexColor);
      // valueText.setTint(hexColor);
      const barNoteText = this.add.text(x + 13, y + 40, text, {
        color,
        fontSize: 12,
      });
      barNoteText.setOrigin(0.5, 0.5);
      if (bar.barNoteText) {
        bar.barNoteText.destroy(true);
      }
      bar.barNoteText = barNoteText;
    }

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async findIndex() {
      let start = 0;
      let end = this.values.length - 1;
      while (start <= end) {
        this.clearBarNote();
        this.drawBarNote(start, 'Start', '#fff');
        this.drawBarNote(end, 'End', '#fff');

        let middle = Math.floor((start + end) / 2);
        this.drawBarNote(middle, 'Middle', '#fff');

        if (this.values[middle] === this.value) {
          this.clearBarNote();
          this.drawBarNote(middle, 'Result', '#fff');
          return middle;
        } else if (this.values[middle] < this.value) {
          start = middle + 1;
        } else {
          end = middle - 1;
        }

        await this.delay(2000);
      }

      this.clearBarNote();
      return -1;
    }

    async run() {
      const index = await this.findIndex();
      if (index === -1) {
        this.resultText = this.add.text(350, 470, `Not found!`, {
          color: '#fff',
          fontSize: 14,
        });
      } else {
        this.resultText = this.add.text(350, 470, `Index found: ${index}`, {
          color: '#fff',
          fontSize: 14,
        });
      }
      this.resultText.setOrigin(0.5, 0.5);
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 700,
    height: 500,
    backgroundColor: '#000',
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
  const inputValues = control.querySelector('input:nth-child(1)');
  const inputValue = control.querySelector('input:nth-child(2)');
  const button = control.querySelector('button');

  const getInputValues = () => {
    if (!inputValues.value.trim()) throw new Error('Please fill in numbers');
    const values = inputValues.value
      .split(',')
      .map((value) => Number(value.trim()));
    if (values.some((value) => isNaN(value)))
      throw new Error('Invalid numbers');

    if (values.some((value) => value < 1 || value > 100))
      throw new Error('Min is 1, max is 100');

    return values;
  };

  const getInputValue = () => {
    if (!inputValue.value.trim()) throw new Error('Please fill in value');
    const value = Number(inputValue.value.trim());
    if (isNaN(value)) throw new Error('Invalid value');

    return value;
  };

  const start = () => {
    try {
      const values = getInputValues();
      const value = getInputValue();

      game.events.emit('start', { values, value });
    } catch (err) {
      alert(err.message);
    }
  };

  button.addEventListener('click', start);
};

const main = () => {
  setupGame();
  setupControl();
};

window.addEventListener('DOMContentLoaded', main);
