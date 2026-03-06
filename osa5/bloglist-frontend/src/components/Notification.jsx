const Notification = ({ message }) => {
  console.log('Notification message: ', message)
  if (message === null) {
    return null
  } else if (message.includes('added') || message.includes('successful')) {
    return <div className="success">{message}</div>
  }

  return <div className="error">{message}</div>
}

export default Notification
