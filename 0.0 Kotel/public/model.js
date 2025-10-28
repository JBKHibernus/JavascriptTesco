class Model {
  state = {
    lastFeed: '',
    statusLog: [],
    checkInterval: 5,
    openInterval: 2,
  };

  //lastFeed;

  getTimeDifference(datetimeStr) {
    // Převeď řetězec z DB na Date objekt
    const targetDate = new Date(datetimeStr.replace(' ', 'T'));
    //console.log('targetDate puvodni ' + targetDate);
    targetDate.setUTCDate(targetDate.getUTCDate() + 4);

    //console.log('targetDate ' + targetDate);

    //millicesonds between target and now
    const now = new Date();
    //console.log('now ' + now);
    let diffMs = targetDate - now; // rozdíl v milisekundách

    // Pokud je v minulosti, vrať nulu
    if (diffMs < 0) diffMs = 0;

    const diffSecondsTotal = Math.floor(diffMs / 1000);
    const days = Math.floor(diffSecondsTotal / (60 * 60 * 24));
    const hours = Math.floor((diffSecondsTotal % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diffSecondsTotal % (60 * 60)) / 60);
    const seconds = diffSecondsTotal % 60;

    //diff function in moments

    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${
      hours !== 1 ? 's' : ''
    } ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${
      seconds !== 1 ? 's' : ''
    }`;
  }

  //READ FROM DB LAST FEED AND TIME
  loadLastFeedAsync = async () => {
    const res = await fetch('/feed/last');

    if (!res.ok) throw new Error('Error durrig reading last record');

    const data = await res.json();
    console.log(data);

    return data.feeded_at;
  };

  //write actual date and amount of bags to DB
  saveAmountAsync = async amount => {
    const res = await fetch('/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) throw new Error('Error during writting.');
  };

  loadAverageAsync = async () => {
    const res = await fetch('/feed/avg', { method: 'GET' });

    if (!res.ok) throw new Error('Error durrig reading last record');

    const data = await res.json();

    return data;
  };

  loadBoilerStatusLogs = async () => {
    const res = await fetch('/status_log');

    if (!res.ok) throw new Error('Error durrig reading boiler status log');

    const data = await res.json();

    this.state.statusLog = data;
  };

  loadBoilerParams = async () => {
    const res = await fetch('/params/read');

    if (!res.ok) throw new Error('Error durrig reading boiler_parameters log');

    const data = await res.json();

    data.forEach(param => {
      if (param.id === 'check_interval') {
        this.state['checkInterval'] = param.value; //switch
      }
      if (param.id === 'open_interval') {
        this.state['openInterval'] = param.value;
      }
    });
  };

  updateBoilerParamsState(checkIntervalValue, openIntervalValue) {
    this.state.checkInterval = +checkIntervalValue.textContent;
    this.state.openInterval = +openIntervalValue.textContent;

    console.log(this.state);
  }

  //write actual date and amount of bags to DB
  saveBoilerParams = async (id, value) => {
    const res = await fetch('/params/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, value }),
    });

    if (!res.ok) throw new Error('Error during writting.');
  };
}

export default new Model();
