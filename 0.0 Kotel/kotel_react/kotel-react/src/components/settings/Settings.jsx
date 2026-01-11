import './Settings.css';
import { useEffect, useState } from 'react';
import { getParams, setParam } from './../../boilerApi';

function Settings() {
  const [checkInterval, setCheckInterval] = useState(5);
  const [openInterval, setOpenInterval] = useState(2);

  useEffect(() => {
    async function loadParams() {
      const data = await getParams();
      data.forEach(param => {
        if (param.id === 'check_interval') {
          setCheckInterval(Number(param.value));
        }
        if (param.id === 'open_interval') {
          setOpenInterval(Number(param.value));
        }
      });
    }

    loadParams();
  }, []);

  async function handleIntervalChange(id, nextValue) {
    if (id === 'check_interval') {
      setCheckInterval(nextValue);
    }
    if (id === 'open_interval') {
      setOpenInterval(nextValue);
    }

    try {
      await setParam(id, nextValue);
    } catch (err) {
      // fallback: revert or show error
      console.error(err);
    }
  }

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
        <div id="check-interval" className="item">
          <p>
            Check interval: <span>{checkInterval}</span> min
          </p>
          <div className="arrow-buttons">
            <button
              className="btn-up"
              onClick={() =>
                handleIntervalChange(
                  'check_interval',
                  Math.min(9, checkInterval + 1)
                )
              }
            >
              ▲
            </button>
            <button
              className="btn-down"
              onClick={() =>
                handleIntervalChange(
                  'check_interval',
                  Math.max(1, checkInterval - 1)
                )
              }
            >
              ▼
            </button>
          </div>
        </div>
        <div id="open-interval" className="item">
          <p>
            Open interval: <span>{openInterval}</span> min
          </p>
          <div className="arrow-buttons">
            <button
              className="btn-up"
              onClick={() =>
                handleIntervalChange(
                  'open_interval',
                  Math.min(9, openInterval + 1)
                )
              }
            >
              ▲
            </button>
            <button
              className="btn-down"
              onClick={() =>
                handleIntervalChange(
                  'open_interval',
                  Math.max(1, openInterval - 1)
                )
              }
            >
              ▼
            </button>
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
