class ArrowActions {
  target;

  constructor(buttonUp, buttonDown) {
    buttonUp.forEach(pressedButton => {
      this.pressed(pressedButton);
    });

    buttonDown.forEach(pressedButton => {
      this.pressed(pressedButton);
    });
  }

  getUpdatedValue(currentValue, changeBy) {
    let updatedValue = currentValue + changeBy;

    updatedValue = Math.min(9, updatedValue);
    updatedValue = Math.max(1, updatedValue);

    return updatedValue;
  }

  changeValue(pressedButton) {
    const container = pressedButton.parentElement.parentElement;
    const valueElement = container.querySelector('span.editable-amount');
    let currentValue = Number(valueElement.innerHTML);

    const isLower = pressedButton.classList.contains('btn-down');
    const changeBy = isLower ? -1 : +1;

    valueElement.innerHTML = this.getUpdatedValue(currentValue, changeBy);
  }

  animateButton(pressedButton) {
    pressedButton.classList.add('pressed');

    setTimeout(function () {
      pressedButton.classList.remove('pressed');
    }, 100);
  }

  pressed(pressedButton) {
    pressedButton.addEventListener('click', event => {
      this.target = event.currentTarget;
      this.animateButton(this.target);
      this.changeValue(this.target);
    });
  }
}

class View {
  btnRenew = document.querySelector('#btn-renew');
  amountElement = document.querySelector('span.editable-amount');
  countdownValue = document.querySelector('#countdown-value');
  averageAmount = document.querySelector('#avg-amount > p > span');
  _buttonsUp = document.querySelectorAll('.btn-up');
  _buttonsDown = document.querySelectorAll('.btn-down');
  _logsContainer = document.querySelector('.logs ul');
  _checkIntervalValue = document.querySelector(
    '#check-interval .editable-amount'
  );
  _openIntervalValue = document.querySelector(
    '#open-interval .editable-amount'
  );

  arrowActions = new ArrowActions(this._buttonsUp, this._buttonsDown);

  constructor() {
    console.log(this._openIntervalValue);
  }

  addHandler(handler) {
    this.btnRenew.addEventListener('click', handler);
  }

  renderStatusLog(logs) {
    this._logsContainer.innerHTML = '';
    logs.forEach(log => {
      const markup = `
                 <li><strong>${log.logged_at}</strong> — ${log.status}</li>
                `;
      this._logsContainer.insertAdjacentHTML('afterbegin', markup);
    });
  }

  renderBoilerParams(checkInterval, openInterval) {
    this._checkIntervalValue.textContent = checkInterval;
    this._openIntervalValue.textContent = openInterval;
  }
}

export default new View();
