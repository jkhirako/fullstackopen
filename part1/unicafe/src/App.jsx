import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ bad, neutral, good }) => {
  const total = bad + neutral + good;
  const average = (good - bad) / total;
  const positive = (good / total) * 100;

  if (total === 0) {
    return <div>No feedback given</div>;
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={total} />
        <StatisticsLine text="average" value={average} />
        <StatisticsLine text="positive" value={positive + "%"} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
