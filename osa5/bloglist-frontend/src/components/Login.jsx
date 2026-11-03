import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
  width: 300px;
`

const Login = ({ handleLogin }) => {
  const [localUsername, setLocalUsername] = useState('')
  const [localPassword, setLocalPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('logging in with', localUsername, localPassword)
    const loginSucceeded = await handleLogin(localUsername, localPassword)
    if (loginSucceeded) {
      navigate('/')
      setLocalUsername('')
      setLocalPassword('')
    }

    //Kun käyttäjä kirjautuu onnistuneesti, handleLogin-metodi kutsuu navigate('/blogs')-metodia, joka on määritetty useNavigate-hookissa. Tämä metodi ohjaa käyttäjän /blogs-reitille, eli blogilistanäkymään.
  }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <Input
            type="text"
            value={localUsername}
            name="Username"
            onChange={({ target }) => setLocalUsername(target.value)}
          />
        </div>
        <div>
          password
          <Input
            type="password"
            value={localPassword}
            name="Password"
            onChange={({ target }) => setLocalPassword(target.value)}
          />
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}

export default Login
