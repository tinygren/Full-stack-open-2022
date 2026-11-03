import { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLoginSubmit}>
        <Stack spacing={1} alignItems="flex-start">
          <TextField
            label="username"
            variant="standard"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="username"
            sx={{ width: 200 }}
          />
          <TextField
            label="password"
            type="password"
            variant="standard"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
            sx={{ width: 200 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: 'flex-start', width: 'fit-content' }}
          >
            Login
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default LoginForm
