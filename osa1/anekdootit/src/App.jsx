import { useState } from 'react'

const Header = (props) => {
    console.log('header:',props)
    return (
      <div>
        <h3>{props.text}</h3>
      </div>
    )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>vote {props.text}</button>
  )
}

const Display = (props) => {
  return (
    <div>
      <p>{props.anecdot}</p>
      <p>has votes {props.selectedVote}</p>
    </div>
  )
}

const DisplayMostVoted = (props) => {
  return (
    <div>
      <p>{props.anecdot}</p>
    </div>
  )
}
const votes = { 0: 0, 1: 0, 2: 0, 3: 0 , 4: 0, 5: 0, 6: 0, 7:0}



const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0) 
  console.log('votes:',votes)
  
  
  const calcMostVoted = () => {
    const maxVote = Math.max(...Object.values(votes))
    const maxKey = Object.keys(votes).find(key => votes[key] === maxVote)
    const result = anecdotes[maxKey] 
    console.log('result:',result)
    console.log('maxKey:',maxKey)
    console.log('maxVote:',maxVote) 

    if (maxVote === 0) {
      return (
        <div>
          <p>No votes yet</p>
        </div>
      )
    } else {
      return (
        <div>
          <DisplayMostVoted anecdot={result}/>
        </div>
      )
    }
  }

    
  const handelClick = () => {
    const value = Math.floor(Math.random() * anecdotes.length)
    setSelected(value)    
    votes[selected] += 1    
    
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Display anecdot={anecdotes[selected]} selectedVote={votes[selected]}/>     
      <Button handleClick={handelClick} text="next anecdote" />
      <Header text="Anecdote with most votes" />
      {calcMostVoted()}
    </div>
  )
}

export default App