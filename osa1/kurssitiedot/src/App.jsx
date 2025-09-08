const Header = (props) => {
    console.log('header:',props)
    return (
      <div>
        <p>{props.course}</p>
      </div>
    )
}

const Part = (props) => {
    console.log('part:',props)
    return (
      <div>
        <p>{props.part.name}  {props.part.exercises}</p>       
      </div>
    )
}


const Content = (props) => {
    console.log('contents:',props)
    return (
      <div>
      <Part part={props.parts[0]} />
      <Part part={props.parts[1]} />  
      <Part part={props.parts[2]} />        
      </div>
    )
}

const Total = (props) => {
    console.log('total',props)
    return (
      <div>
        <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises} </p>
      </div>
    )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/> 
      <Total parts={course.parts}/>      
    </div>
  )
}

export default App
