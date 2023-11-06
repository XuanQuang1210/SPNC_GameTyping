const setupControl = (game) => {
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
