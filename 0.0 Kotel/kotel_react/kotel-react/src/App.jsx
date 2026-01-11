import './App.css';
import Logs from './components/logs/Logs';
import Countdown from './components/countdown/Countdown';
import Settings from './components/settings/Settings';

function App() {
  return (
    <>
      <h1>Boiler management</h1>
      <div className="container">
        <Logs />
        <div className="indicators">
          <Countdown />
          <Settings />
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
