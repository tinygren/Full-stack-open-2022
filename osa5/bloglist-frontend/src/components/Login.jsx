import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
          <input
            type="text"
            value={localUsername}
            name="Username"
            onChange={({ target }) => setLocalUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={localPassword}
            name="Password"
            onChange={({ target }) => setLocalPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
