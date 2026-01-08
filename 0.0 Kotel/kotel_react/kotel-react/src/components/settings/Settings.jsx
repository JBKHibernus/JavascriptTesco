import './Settings.css';

function Settings({ checkInterval, onCheckIntervalChange }) {
  return (
    <>
      <div className="settings">
        <div className="item">
          <p>
            Boiler status: <span>Running</span>
          </p>
        </div>
        <div className="item">
          <p>
            Boiler temperature: <span>63</span> °C
          </p>
        </div>
        {/* <div id="check-interval" className="item">
          <p>
            Check interval: <input value="5" /> min
          </p>
          <div className="arrow-buttons">
            <button className="btn-up">▲</button>
            <button className="btn-down">▼</button>
          </div>
        </div> */}
        <div id="check-interval" className="item">
          <p>
            Check interval: <span>{checkInterval}</span> min
          </p>
          <div className="arrow-buttons">
            <button
              onClick={() =>
                onCheckIntervalChange(Math.max(1, checkInterval - 1))
              }
            >
              ▼
            </button>
            <button
              onClick={() =>
                onCheckIntervalChange(Math.min(9, checkInterval + 1))
              }
            >
              ▲
            </button>
          </div>
        </div>
        <div id="open-interval" className="item">
          <p>
            Open interval: <input value="5" /> min
          </p>
          <div className="arrow-buttons">
            <button className="btn-up">▲</button>
            <button className="btn-down">▼</button>
          </div>
        </div>
        <div id="avg-amount" className="item">
          <p>
            Average daily consumption: <span>5</span> bags
          </p>
        </div>
      </div>
    </>
  );
}

export default Settings;

// Terminal 1: node server.js (Express)
// Terminal 2: npm run dev (React)
