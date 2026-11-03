import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  const isSuccess =
    message.includes('added') || message.includes('successful')

  return (
    <Alert severity={isSuccess ? 'success' : 'error'} sx={{ my: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification
