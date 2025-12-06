import React from 'react'


const Persons = ({ personsToShow, delPerson }) => {
   
  return (
    <ul>
      {personsToShow.map((p, id) => (
        <li key={id}>
          {p.name} {p.number}
          <button onClick={() => delPerson(p.id)}> Delete </button>
        </li>         
      ))}
       
    </ul>
  )
}



export default Persons