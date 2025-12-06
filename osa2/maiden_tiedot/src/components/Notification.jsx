const Notification = ({ message, type }) => {
  const notificationStyle = {
    color: 'green',
    backgroundColor: '#ddffdd',
    // border: '2px solid green',
    // padding: '5px',  
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '0.9em',
    marginBottom: '1em'
  }
  if (!message) return null

  return (
    <div className={type} style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification