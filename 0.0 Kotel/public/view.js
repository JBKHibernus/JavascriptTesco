class ArrowActions {
  target;
  buttonUp;
  buttonDown;

  constructor(buttonUp, buttonDown) {
    // buttonUp.forEach(pressedButton => {
    //   this.pressed(pressedButton);
    // });

    // buttonDown.forEach(pressedButton => {
    //   this.pressed(pressedButton);
    // });
    this.buttonUp = buttonUp;
    this.buttonDown = buttonDown;
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

  pressedUp(handler) {
    this.buttonUp.forEach(pressedButton => {
      pressedButton.addEventListener('click', event => {
        this.target = event.currentTarget;
        this.animateButton(this.target);
        this.changeValue(this.target);
        this.addHandlerUpdateParams();
        handler();
      });
    });
  }

  pressedDown(handler) {
    this.buttonDown.forEach(pressedButton => {
      pressedButton.addEventListener('click', event => {
        this.target = event.currentTarget;
        this.animateButton(this.target);
        this.changeValue(this.target);
        this.addHandlerUpdateParams();
        handler();
      });
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
  checkIntervalValue = document.querySelector(
    '#check-interval .editable-amount'
  );
  openIntervalValue = document.querySelector('#open-interval .editable-amount');

  arrowActions = new ArrowActions(this._buttonsUp, this._buttonsDown);

  addRenewButtonHandler(handler) {
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
    this.checkIntervalValue.textContent = checkInterval;
    this.openIntervalValue.textContent = openInterval;
  }
}

export default new View();

// //GETTERS a SETTERS
// const account = {
//   owner: 'jarda',
//   movements: [20, 300, 120, 500],

//   //z normalni funcke udelat getter jen slovem get
//   get latest() {
//       return this.movements.slice(-1).pop()
//   },

//   //kazdy setter musi mit prave 1 parametr
//   set latest(mov) {
//       this.movements.push(mov);
//   }
// }
