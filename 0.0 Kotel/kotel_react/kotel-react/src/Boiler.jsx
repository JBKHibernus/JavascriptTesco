import { useEffect, useState } from 'react';
import './Boiler.css';
import Header from './components/header/Header';
import Logs from './components/logs/Logs';
import Countdown from './components/countdown/Countdown';
import Settings from './components/settings/Settings';

import { getParams, setParam } from './boilerApi';

function App() {
  const [checkInterval, setCheckInterval] = useState(5);

  useEffect(() => {
    let isMounted = true;

    async function loadParams() {
      const data = await getParams();
      const check = data.find(p => p.id === 'check_interval');
      if (check && isMounted) setCheckInterval(Number(check.value));
    }

    loadParams();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCheckIntervalChange(nextValue) {
    setCheckInterval(nextValue); // optimistic UI
    try {
      await setParam('check_interval', nextValue);
    } catch (err) {
      // fallback: revert or show error
      console.error(err);
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <Logs />
        <div className="indicators">
          <Countdown />
          <Settings
            checkInterval={checkInterval}
            onCheckIntervalChange={handleCheckIntervalChange}
          />
        </div>
      </div>
    </>
  );
}

export default App;
