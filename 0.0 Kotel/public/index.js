"use strict"


//ARROW BUTTONS
document.querySelectorAll(".btn-up").forEach((pressedButton) => {
    pressedButton.addEventListener("click", (event) => {
        const target = event.currentTarget;
        animateButton(target);
        changeValue(target);
    });
});

document.querySelectorAll(".btn-down").forEach((pressedButton) => {
    pressedButton.addEventListener("click", (event) => {
        const target = event.currentTarget;
        animateButton(target);
        changeValue(target);
    });
});

function changeValue(pressedButton) {
    const container = pressedButton.parentElement.parentElement;
    const valueElement = container.querySelector("span.editable-amount")
    let currentValue = Number(valueElement.innerHTML);

    const isLower = pressedButton.classList.contains("btn-down");
    const changeBy = isLower ? -1 : +1;

    valueElement.innerHTML = getUpdatedValue(currentValue, changeBy);
}

function getUpdatedValue(currentValue, changeBy) {
    let updatedValue = currentValue + changeBy;
    
    updatedValue = Math.min(9, updatedValue);
    updatedValue = Math.max(1, updatedValue);

    return updatedValue;
}

function animateButton(pressedButton) {
    pressedButton.classList.add("pressed");

    setTimeout(function() {
        pressedButton.classList.remove("pressed");
    }, 100, );
}

//FEEDING STATS
document.querySelector("#btn-renew").addEventListener("click", (event) => {
  renewCountdown();
});

//write actual date and amount of bags to DB
const renewCountdown = function() {
  const amountElement = document.querySelector("span.editable-amount");
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
    logLastFeed();
  })
  .catch(error => {
    alert("Error: " + error.message);
  });
};

//read from db last feed time and amount
function logLastFeed() {
  let lastFeed = '';
  let lastAmount = '';
  fetch('/last-feed')
    .then(response => {
      if (!response.ok) throw new Error("Error durrig reading last record");
      return response.json();
    })
    .then(data => {
      console.log("Last record:", data);
      lastFeed = data.feeded_at;
      lastAmount = data.amount;
      setCountdownValue(lastFeed);
      //console.log('last',lastFeed);
    })
    .catch(err => {
      console.error("Error:", err.message);
    });
};

logLastFeed()

//set new value to countdown
const setCountdownValue = function(lastFeed) {
  const now = new Date();
  console.log('actual time', now);
  console.log('last feed', lastFeed);

  const newCountdownValue = getTimeDifference(lastFeed)
  const oldCountdownValue = document.querySelector('#countdown-value').textContent;
  console.log(newCountdownValue);
  console.log(oldCountdownValue);

  document.querySelector('#countdown-value').textContent = newCountdownValue;
};

function getTimeDifference(datetimeStr) {
  // Převeď řetězec z DB na Date objekt
  const targetDate = new Date(datetimeStr.replace(' ', 'T'));
  const now = new Date();

  let diffMs = now - targetDate; // rozdíl v milisekundách

  // Pokud je v minulosti, vrať nulu
  if (diffMs < 0) diffMs = 0;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}







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



