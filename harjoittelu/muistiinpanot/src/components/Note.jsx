const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'
  console.log('Rendering note', note.id)
  console.log('Note content:', note.content)
  console.log('Note importance:', note.important)
  console.log('Toggle importance function:', toggleImportance)
  console.log('Button label:', label)
  return (
    <li className='note'>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
