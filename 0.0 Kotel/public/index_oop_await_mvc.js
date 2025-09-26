"use strict"

// MVC design pattern for this application:
// Model: API + business logic
// Controller: connecting the Model and View
// View: HTML (UI)

class Model {
  lastFeed; 

  getTimeDifference(datetimeStr) {
    // Převeď řetězec z DB na Date objekt
    const targetDate = new Date(datetimeStr.replace(' ', 'T'));
    targetDate.setDate(targetDate.getDate() + 4);
  
    //millicesonds between target and now
    const now = new Date();
    let diffMs = targetDate - now; // rozdíl v milisekundách
  
    // Pokud je v minulosti, vrať nulu
    if (diffMs < 0) diffMs = 0;
  
    const diffSecondsTotal = Math.floor(diffMs / 1000);
    const days = Math.floor(diffSecondsTotal / (60 * 60 * 24));
    const hours = Math.floor((diffSecondsTotal % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diffSecondsTotal % (60 * 60)) / 60);
    const seconds = diffSecondsTotal % 60;
  
    //diff function in moments
  
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  //READ FROM DB LAST FEED AND TIME
  loadLastFeedAsync = async () => {
    const res = await fetch('/feed/last');

    if(!res.ok) throw new Error('Error durrig reading last record');

    const data = await res.json();

    return data.feeded_at;
  };

  //write actual date and amount of bags to DB
  saveAmountAsync = async (amount) => {

    const res = await fetch('/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    if(!res.ok) throw new Error('Error during writting.');

  };

  loadAverageAsync = async () => {  

    const res = await fetch('/feed/avg', {method: 'GET'})
    
    if (!res.ok) throw new Error('Error durrig reading last record');

    const data = await res.json();

    return data;
  }

  loadStatus() {}
  setCheckInterval() {}
  setOpenInterval() {}
}
  


class View {
  btnRenew = document.querySelector("#btn-renew");
  amountElement = document.querySelector("span.editable-amount");
  countdownValue = document.querySelector("#countdown-value");
  averageAmount = document.querySelector("#avg-amount > p > span");
  ButtonsUp = document.querySelectorAll(".btn-up");
  ButtonsDown = document.querySelectorAll(".btn-down");

  arrowActions = new ArrowActions(this.ButtonsUp, this.ButtonsDown);
}

class App {
  model = new Model();
  view = new View();

  constructor() {
    this.model.loadAverageAsync()
      .then(avg => {
        console.log('avg',avg);
        this.view.averageAmount.textContent = avg;
      })
      .catch(err => console.error(err));

    this.model.loadLastFeedAsync()
      .then(lastFeed => {
        this.model.lastFeed = lastFeed;
      })
      .catch(err => console.error(err));
    

    setInterval(() => this.setCountdownValue(this.model.lastFeed), 1000); 

    this.view.btnRenew.addEventListener("click", (event) => {
      this.updateAmount().catch(err => console.error(err));
    });
  }

  //set new value to countdown
  setCountdownValue() {
    if (this.model.lastFeed) {
      this.view.countdownValue.textContent = this.model.getTimeDifference(this.model.lastFeed);
    }
  }

  async updateAmount() {
    const amount = Number(this.view.amountElement.textContent);
    await this.model.saveAmountAsync(amount);
    console.log("Record added succesfully");

    //renew countdown
    this.model.loadLastFeedAsync()
      .then(lastFeed => {
        this.model.lastFeed = lastFeed;
      })
      .catch(err => console.error(err));
    
    //load average
    this.model.loadAverageAsync()
      .then(avg => {
        console.log('avg',avg);
        this.view.averageAmount.textContent = avg;
      })
      .catch(err => console.error(err));
   }
}


class ArrowActions {
  target;

  constructor(buttonUp, buttonDown) {
    buttonUp.forEach((pressedButton) => {
      this.pressed(pressedButton);
    });

    buttonDown.forEach((pressedButton) => {
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
    const valueElement = container.querySelector("span.editable-amount")
    let currentValue = Number(valueElement.innerHTML);

    const isLower = pressedButton.classList.contains("btn-down");
    const changeBy = isLower ? -1 : +1;

    valueElement.innerHTML = this.getUpdatedValue(currentValue, changeBy);
  }

  animateButton(pressedButton) {
    pressedButton.classList.add("pressed");

    setTimeout(function() {
        pressedButton.classList.remove("pressed");
    }, 100, );
  }

  pressed(pressedButton) {
    pressedButton.addEventListener("click", (event) => {
      this.target = event.currentTarget;
      this.animateButton(this.target);
      this.changeValue(this.target);
    });
  }
}


const app = new App();














////////////////////UNUSED FOR NOW//////////////////////////////////////////////
//GLOBAL LOGS
function deleteRows() {
  const li = document.querySelectorAll('.logs li');
    li.forEach((liItem) => {
      if (liItem) {
        console.log(liItem);
        liItem.remove();
      }
    });
};


function addRows(logData) {
  const logList = document.querySelector('.logs ul');
  const logArray = JSON.parse(logData);
    console.log(logArray);
    for (const row of logArray) {
      const newRow = document.createElement('li');
      newRow.textContent = row;
      logList.appendChild(newRow);
    };
};



function getLogs() {
  // call GET at endpoint /logs
  fetch('/logs')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network error');
    }
    return response.text();
  })
  .then(data => {
    addRows(data);
  })
  .catch(error => {
    alert('Error: ' + error.message);
  });
};


// setInterval(() => {
//   deleteRows();
//   getLogs();
// }, 6000);



