const Course = ( props ) => {
  console.log(props)
  const course = props.course
  const id = props.id
  const excercices = course.parts.map(part => part.exercises)
  console.log('excercices:',excercices)
  console.log('course:',course)
  console.log('id:',id) 
  return (
    <div>  
      
        <h1>{course.name}</h1> 
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {course.parts.map(part => 
            <li key={part.id}>{part.name} {part.exercises}</li> 
            )}
          <p>total of {excercices.reduce((accumulator, currentValue) => accumulator + currentValue, 0)} excercices</p>
          
        </ul>
        
    </div>
    
  )
}
export default Course


