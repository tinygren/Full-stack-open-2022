import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ filterName, handleFilterChange }) => (
  <div>
    filter shown with <input 
      value={filterName}
      onChange={handleFilterChange}
    />
  </div>
)

const PersonForm = ({ handleSubmit, newName, handleNameChange , newNumber, handleNumberChange }) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input 
              value={newName} 
              onChange={handleNameChange}
            />
    </div>
    <div>
      number: <input
              value={newNumber}
              onChange={handleNumberChange}
           />
    </div>
    <div>          
       <button type="submit">add</button>          
    </div>
  </form>   
)  


const App = () => {
  
  const [persons, setPersons] = useState([])   
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  useEffect(() => {
    console.log('effect')
    // Here you can fetch data from an API if needed
    personsService
        .getAll()
        .then(initialPersons => {
        console.log('promise fulfilled')
        console.log(initialPersons)
      setPersons(initialPersons)
    })
  }, [])
  const delPerson = (id) => {
    console.log("delete person id = ", id)
    const person = persons.find(p => p.id === id)
    console.log("person to delete:", person)
    const confirmDelete = window.confirm("Delete" + " " + person.name + " ?")
    if (confirmDelete) {
      console.log("Deleted person",person)
      personsService.delPerson(id)
      .then((deletedPerson) => {
        console.log("Person deleted from server", deletedPerson.id)
        // Update the local state or UI as needed
        setPersons(persons.filter(p => p.id !== id))  
        setSuccessMessage(`'Person ${person.name}' deleted successfully`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        console.log("Updated persons list after deletion:", persons, id)
        // Optionally, you might want to refresh the list of persons here
      })
      .catch( error => {
        console.log("Error deleting person:", error)
        setErrorMessage(`Error deleting person, '${person.name}' has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    } else {
      console.log("Cancelled deletion of person",person)
      setSuccessMessage(`'Person ${person.name}' deletion cancelled`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return
    } 
  }
  

  const handleNameChange = (event) => {
    console.log('handleNameChange event.target.value :=> ',event.target.value)
    if (event.target.value.length > 0) {
      setNewName(event.target.value)
  }
  }
  const handleNumberChange = (event) => {
    console.log('handleNumberChange event.target.value :=> ',event.target.value)
    if (event.target.value.length > 0) {
      setNewNumber(event.target.value)
    }
   
  }
  const handleFilterChange = (event) => {
    console.log('handleFilterChange event.target.value :=> ',event.target.value)
    setFilterName(event.target.value)
    setShowAll(false)
  }
  

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('showAll:',showAll)
    console.log('---event---',event)
    console.log('personsToShow:',personsToShow)
    console.log('Submitting Name and Number')
    console.log('---',event.target)
    console.log('Name:', newName)
    console.log('Number:', newNumber)
    const nameObject = {
      name: newName,
      number: newNumber
    }
    console.log('nameObject:',nameObject.name.length)
    console.log('numberObject:',nameObject.number.length)

    if (nameObject.name.length === 0 || nameObject.number.length === 0) {
      alert('Name or Number cannot be empty !')
      return
    }
    // Check for duplicate names
    if (persons.some(p => p.name === newName)) {
        const personToUpdate = persons.find(p => p.name === newName)
        if (window.confirm(`${newName} is already added, replace the old number?`)) {
          const updatedPerson = { ...personToUpdate, number: newNumber }
          personsService
            .update(personToUpdate.id, updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
              setNewName('')
              setNewNumber('')
              setSuccessMessage(`'Person ${returnedPerson.name}' number updated successfully`)
              setTimeout(() => {
                setSuccessMessage(null)
              }, 5000)
            })
            .catch(error => {
              setErrorMessage(
                `'Person ${p.name}' Error updating person`
              ) 
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
             
            })
       }
        setNewName('')
        setNewNumber('')
        return
    }
    // Check for duplicate names
    personsService
      .create(nameObject)
      .then(returnedPerson => {
        console.log('Added person:', returnedPerson)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`'Person ${returnedPerson.name}' added successfully`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
         setErrorMessage(`Error adding person '${returnedPerson}' `)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
       })
    

  }
  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      
        <h3>Add a new</h3>
          <PersonForm 
            handleSubmit={handleSubmit} 
            newName={newName} 
            handleNameChange={handleNameChange}
            newNumber={newNumber}
            handleNumberChange={handleNumberChange}
          />
       <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} delPerson={delPerson} />
    </div>
  )
  
  }


export default App
