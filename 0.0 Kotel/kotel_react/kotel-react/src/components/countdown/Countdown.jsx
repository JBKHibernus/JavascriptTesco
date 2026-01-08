import './Countdown.css';

function Countdown() {
  return (
    <>
      <div className="countdown">
        <p class="refilling-container">
          Next refill in <span id="countdown-value">2 day 3 hours</span>
        </p>
        <div class="feeding-amount">
          <p>
            Amount: <span class="editable-amount">5</span> bags
          </p>
          <div class="arrow-buttons">
            <button class="btn-up">▲</button>
            <button class="btn-down">▼</button>
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
