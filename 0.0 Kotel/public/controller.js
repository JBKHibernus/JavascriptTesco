'use strict';
import model from './model.js';
import view from './view.js';

class App {
  //model = new Model();

  constructor() {
    model
      .loadAverageAsync()
      .then(avg => {
        console.log('avg', avg);
        view.averageAmount.textContent = avg;
      })
      .catch(err => console.error(err));

    model
      .loadLastFeedAsync()
      .then(lastFeed => {
        model.state.lastFeed = lastFeed;
        //this.setCountdownValue(model.lastFeed); test casovych pasem
      })
      .catch(err => console.error(err));

    setInterval(() => this.setCountdownValue(model.state.lastFeed), 1000);

    view.addHandler(this.updateAmount);

    // this.updateBoilerStatusLog()
    //   .then(status => {
    //     console.log(status);
    //   })
    //   .catch(err => console.error(err));

    //   model
    //     .loadBoilerStatusLogs()
    //     .then(() => {
    //       console.log(model.state.statusLog);
    //     })
    //     .catch(err => console.error(err));
    //
    this.updateBoilerStatusLog();
    setInterval(() => this.updateBoilerStatusLog(), 60000);

    model.loadBoilerParams().then(() => {
      view.renderBoilerParams(
        model.state.checkInterval,
        model.state.openInterval
      );
    });

    model.saveBoilerParams('check_interval', 7); //jen test, ale zapisuje, dodelej volani pri stisku tlacitka
  }

  //set new value to countdown
  setCountdownValue() {
    if (model.state.lastFeed) {
      view.countdownValue.textContent = model.getTimeDifference(
        model.state.lastFeed
      );
    }
  }

  updateAmount = async () => {
    const amount = Number(view.amountElement.textContent);
    await model.saveAmountAsync(amount);
    console.log('Record added succesfully');

    //renew countdown
    model
      .loadLastFeedAsync()
      .then(lastFeed => {
        model.state.lastFeed = lastFeed;
      })
      .catch(err => console.error(err));

    //load average
    model
      .loadAverageAsync()
      .then(avg => {
        console.log('avg', avg);
        view.averageAmount.textContent = avg;
      })
      .catch(err => console.error(err));
  };

  updateBoilerStatusLog = () => {
    model
      .loadBoilerStatusLogs()
      .then(() => {
        if (!model.state.statusLog) return;

        console.log(model.state.statusLog);

        view.renderStatusLog(model.state.statusLog);
      })
      .catch(err => console.error(err));
  };
}

const app = new App();
