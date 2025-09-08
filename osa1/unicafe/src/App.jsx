import { useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h3>{props.text}</h3>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
const Statistics = (props) => {
  if (props.allValue) {
    return (
      <table>
        <tbody>
          <StatisticLine text={props.textGood} value={props.goodValue} />
          <StatisticLine text={props.textNeutral} value={props.neutralValue} />
          <StatisticLine text={props.textBad} value={props.badValue} />
          <StatisticLine text={props.textAll} value={props.allValue} />
          <StatisticLine text={props.textAverage} value={props.averageValue} />
          <StatisticLine text={props.textPositive} value={props.positiveValue} />
        </tbody>
      </table>
    )
  } else {
    return (<div>No Feedback Given</div>)
  }
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
} 


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const sum = (good + neutral + bad)
  const average = sum / 3 
  

  return (
    <div>
      <Header text= "give feedback"/>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text= "statictics"/>
      <Statistics textGood="good"  textNeutral="neutral" textBad="bad" textAll="all" textAverage="average" 
      textPositive="positive" goodValue={good}  neutralValue={neutral} badValue={bad} allValue={sum}
      averageValue={average} positiveValue={good + ' %'} />
     
     </div>
  )
}

export default App

