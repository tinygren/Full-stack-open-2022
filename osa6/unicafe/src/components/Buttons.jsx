import { useCounterControls } from "./store";

const Buttons = () => {
  // const good_increment = useCounterControls().good_increment;
  // const neutral_increment = useCounterControls().neutral_increment;
  // const bad_increment = useCounterControls().bad_increment;

  const { good_increment, neutral_increment, bad_increment } =
    useCounterControls(); //destructuring the object returned by useCounterControls

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={good_increment}>good</button>
      <button onClick={neutral_increment}>neutral</button>
      <button onClick={bad_increment}>bad</button>
    </div>
  );
};

export default Buttons;
