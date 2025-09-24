"use strict"

const btnRenew = document.querySelector("#btn-renew");
const amountElement = document.querySelector("span.editable-amount");
const countdownValue = document.querySelector('#countdown-value');
const averageAmount = document.querySelector('#avg-amount > p > span');
const countdownButtonsUp = document.querySelectorAll(".countdown .btn-up");
const countdownButtonsDown = document.querySelectorAll(".countdown .btn-down");
const settingsButtonsUp = document.querySelectorAll(".settings .btn-up");
const settingsButtonsDown = document.querySelectorAll(".settings .btn-down");



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


class Countdown {
  lastFeed; 

  constructor() {
    const amountInput = new ArrowActions(countdownButtonsUp, countdownButtonsDown);

    btnRenew.addEventListener("click", (event) => {
      this.saveAmount();
    });

    this.loadLastFeed();

    setInterval(() => this.setCountdownValue(this.lastFeed), 1000); 
  }

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

  //set new value to countdown
  setCountdownValue(lastFeed) {
    if (this.lastFeed) {
      countdownValue.textContent = this.getTimeDifference(lastFeed);
    }
  };

  //READ FROM DB LAST FEED AND TIME
  loadLastFeed() {
    //let lastAmount = '';
    // fetch('/feed/last', {method: 'GET'})
    //   .then(response => {
    //     if (!response.ok) throw new Error("Error durrig reading last record");
    //     return response.json();
    //   })
    //   .then(data => {
    //     this.lastFeed = data.feeded_at;
    //     lastAmount = data.amount;
    //     this.setCountdownValue(this.lastFeed);
    //     console.log('ted cteno z DB');
    //   })
    //   .catch(err => {
    //     console.error("Error:", err.message);
    //   });

      const loadLastFeedAsync = async () => {
        //let lastAmount;
        try {
          const res = await fetch('/feed/last');

          if(!res.ok) throw new Error('Error durrig reading last record');

          const data = await res.json();

          //this.lastFeed = data.feeded_at;
          //lastAmount = data.amount;
          this.setCountdownValue(data.feeded_at);

          return data.feeded_at;
        } catch(err) {
          console.error(err);

          throw err;
        }
      }
        
      loadLastFeedAsync().then(lastFeed => this.lastFeed = lastFeed);
  };

  //write actual date and amount of bags to DB
  saveAmount() {
    const amount = Number(amountElement.textContent);

    fetch('/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error duriing writting.");
      }
      return response.json();
    })
    .then(data => {
      //renew countdown
      console.log("Record added succesfully");
      this.loadLastFeed();
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
  };
}

class Setting{
  constructor() {
    const intervalInput = new ArrowActions(settingsButtonsUp, settingsButtonsDown);

    this.setAverage();
  }

  setAverage() {    //ja zavolat average po stisku tlacitka renew? nemel bych to radeji vse j jednoduchych funkcich?
    fetch('/feed/avg', {method: 'GET'})
      .then(response => {
        if (!response.ok) throw new Error("Error durrig reading last record");
        return response.json();
      })
      .then(data => {
        console.log('avg',data);
        averageAmount.textContent = data;
      })
      .catch(err => {
        console.error("Error:", err.message);
      });
  }

  loadStatus() {}
  setCheckInterval() {}
  setOpenInterval() {}
}




class App {
  constructor() {
    const renew = new Countdown();
    const average = new Setting();
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



