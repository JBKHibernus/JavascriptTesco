import './Countdown.css';

function Countdown() {
  return (
    <>
      <div className="countdown">
        <p className="refilling-container">
          Next refill in <span id="countdown-value">2 day 3 hours</span>
        </p>
        <div className="feeding-amount">
          <p>
            Amount: <span className="editable-amount">5</span> bags
          </p>
          <div className="arrow-buttons">
            <button className="btn-up">▲</button>
            <button className="btn-down">▼</button>
          </div>
        </div>
        <button id="btn-renew">Renew</button>
      </div>
    </>
  );
}

export default Countdown;

/*
function Component() {
  // 1. hooks
  const [state, setState] = useState();

  // 2. derived values
  const total = state * 2;

  // 3. event handlers
  const increase = () => { ... };

  // 4. effects
  useEffect(() => { ... }, []);

  // 5. JSX
  return ( ... );
}*/
