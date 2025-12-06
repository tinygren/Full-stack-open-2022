import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

 useEffect(() => {
  console.log('effect')
  noteService
      .getAll()
      .then(initialNotes  => {
        setNotes(initialNotes)
      })
}, [])
  console.log('render', notes.length, 'notes')


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: String(notes.length + 1),
    }
    noteService
        .create(noteObject)
        .then(returnedNote  => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
      })  
}

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
  const note = notes.find(n => n.id === id)
  console.log('Toggling importance for note:', id)
  console.log('Current note data:', note)
  const changedNote = { ...note, important: !note.important }
  console.log('Changed note data:', changedNote)
  noteService
      .update(id, changedNote)
      .then(returnedNote  => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote)) //Takaisinkutsufunktiossa asetetaan komponentin App tilaan notes kaikki vanhat muistiinpanot paitsi muuttunut, josta tilaan asetetaan palvelimen palauttama versio:
  })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)        
        setNotes(notes.filter(n => n.id !== id)) //Ota mukaan kaikki n (note-objektit), joiden id ei ole sama kuin annettu id.
      })
}

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div> 
      <ul>
        {notesToShow.map(note =>
          <Note 
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} 
          onChange={handleNoteChange}        
        />
        <button type="submit">save</button>
      </form> 
      <Footer />  
    </div>
  )
}

export default App 
/*
Esim
const notes = [
  { id: 1, text: "Hello" },
  { id: 2, text: "React" }
]

const id = 1;

const result = notes.filter(n => n.id !== id);
// result = [{ id: 2, text: "React" }]
*/


