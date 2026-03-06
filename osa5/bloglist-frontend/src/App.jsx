import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import loginService from './services/login'
import Toggable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    //Kirjautumislomakkeen lähettämisestä vastaava metodi handleLogin on määritetty lomakkeen onSubmit-tapahtuman käsittelijäksi.
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password }) //Login-komponentti kutsuu loginService.login-metodia, joka lähettää HTTP POST -pyynnön palvelimelle ja palauttaa vastauksena käyttäjään liittyviä tietoja, kuten tokenin.
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) //Jos login-komponentti saa onnistuneen vastauksen, se tallentaa käyttäjään liittyviä tietoja selaimen localStorageen, jotta käyttäjään liittyviä tietoja voidaan käyttää myöhemmin uudelleen ilman, että käyttäjän tarvitsee kirjautua uudestaan.
      //Kirjautuneen käyttäjän tiedot tallentuvat nyt local storageen ja niitä voidaan tarkastella konsolista (kirjoittamalla konsoliin window.localStorage):
      blogService.setToken(user.token)
      console.log('token set in blogService', user.token)
      console.log('user in handleLogin: ', user.name)
      setUser(user) //Jos login-komponentti saa onnistuneen vastauksen, se asettaa user-tilan saatuun käyttäjään, ja tyhjentää lomakkeen kentät.
      setErrorMessage('Login successful')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      console.log('blogObject in addBlog: ', blogObject.url)

      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setErrorMessage(
          `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        )
      })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    console.log(
      'updateBlog called with id:',
      id,
      'and updatedBlog:',
      updatedBlog,
    )
    // 4. updateBlog-funktio, joka ottaa parametrina blogin id:n ja päivitetyt tiedot (updatedBlog).
    // Se kutsuu blogService.update-metodia, joka lähettää PUT-pyynnön backendiin, ja palauttaa päivitetyn blogin datan. Jos päivitys onnistuu,
    //  päivitetään blogs-tilaa siten, että vanhan blogin tilalle asetetaan päivitetty blogi.
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
      setErrorMessage(`Blog ${updatedBlog.title} Likes updated successfully`)
    } catch (error) {
      setErrorMessage('Failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlogId = async (id) => {
    console.log('removeBlogId called with id:', id)
    await blogService.remove(id)
    setBlogs(blogs.filter((blog) => blog.id !== id))
  }

  const blogForm = () => (
    <div>
      {user.name} logged in
      <button
        type="submit"
        onClick={() => {
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
        }}
      >
        logout
      </button>
    </div>
  )

  return (
    <div>
      <Notification message={errorMessage} />
      {user && blogForm()}
      {/* {!user && loginForm()} */}
      {/*<Toggable buttonLabel="new blog">{addNewBlogForm()}</Toggable> */}
      <Toggable buttonLabel="log in">
        <LoginForm handleLogin={handleLogin} />
      </Toggable>
      <Toggable buttonLabel="new blog">
        <BlogForm addBlog={addBlog} />
      </Toggable>
      {/*user && addNewBlogForm()*/}
      {user && (
        <div>
          <h2>Blogs:</h2>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              user={user.name}
              removeBlogId={removeBlogId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
