import { useEffect, useState } from 'react';
import './App.css';
import Logs from './components/logs/Logs';
import Countdown from './components/countdown/Countdown';
import Settings from './components/settings/Settings';

import { getParams, setParam } from './boilerApi';

function App() {
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
      <h1>Boiler management</h1>
      <div className="container">
        <Logs />
        <div className="indicators">
          <Countdown />
          <Settings
            checkInterval={checkInterval}
            openInterval={openInterval}
            onIntervalChange={handleIntervalChange}
          />
        </div>
      </div>
    </>
  );
}

{
  /* <ul>
        {[1, 4, 7, 9].map(num => (
          <li>{num}</li>
        ))}
      </ul> */
}

export default App;
