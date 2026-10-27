import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Footer from './components/Footer'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import loginService from './services/login'
import Toggable from './components/Toggable'
import Blogs from './components/Blogs'
import Login from './components/Login'
import New_Blog from './components/New_Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes) // Sort the blogs in descending order based on likes
      setBlogs(blogs)
    })
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

    console.log('App.jsx: logging in with', username, password)
    try {
      console.log('App.jsx: this is the try block in handleLogin')
      const user = await loginService.login({ username, password }) //Login-komponentti kutsuu loginService.login-metodia, joka lähettää HTTP POST -pyynnön palvelimelle ja palauttaa vastauksena käyttäjään liittyviä tietoja, kuten tokenin.
      //Kun käyttäjä kirjautuu onnistuneesti, handleLogin-metodi kutsuu navigate('/blogs')-metodia, joka on määritetty useNavigate-hookissa. Tämä metodi ohjaa käyttäjän /blogs-reitille, eli blogilistanäkymään.
      console.log('App.jsx: user logged in', user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) //Jos login-komponentti saa onnistuneen vastauksen, se tallentaa käyttäjään liittyviä tietoja selaimen localStorageen, jotta käyttäjään liittyviä tietoja voidaan käyttää myöhemmin uudelleen ilman, että käyttäjän tarvitsee kirjautua uudestaan.
      //Kirjautuneen käyttäjän tiedot tallentuvat nyt local storageen ja niitä voidaan tarkastella konsolista (kirjoittamalla konsoliin window.localStorage):
      blogService.setToken(user.token) // user.token sisältää kirjautumisen yhteydessä palvelimelta palautuneen tokenin, joka on merkkijono, jota käytetään autentikointiin ja valtuutukseen. Tämä token asetetaan blogServiceen setToken-metodilla, jotta sitä voidaan käyttää myöhemmin blogien luomisessa, päivittämisessä ja poistamisessa, jotka vaativat autentikointia.
      console.log('user: ', user) // user-objekti = { name: 'Matti Luukkainen', username: 'mluukkai', token: '...' }
      console.log('token set in blogService', user.token)
      console.log('user in handleLogin: ', user.name)
      setUser(user) //Jos login-komponentti saa onnistuneen vastauksen, se asettaa user-tilan saatuun käyttäjään, ja tyhjentää lomakkeen kentät.
      setErrorMessage('Login successful')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return true
      //Kun käyttäjä on kirjautunut onnistuneesti, handleLogin-metodi navigoi käyttäjän takaisin pääsivulle ("/") käyttämällä useNavigate-hookia.
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const addBlog = async (blogObject) => {
    try {
      console.log('blogObject in addBlog: ', blogObject.url)
      blogFormRef.current.toggleVisibility() //Kun käyttäjä yrittää lisätä uuden blogin, addBlog-metodi kutsuu blogFormRef.current.toggleVisibility()-metodia, joka on määritetty Toggable-komponentissa. Tämä metodi vaihtaa blogin lisäämiseen käytettävän lomakkeen näkyvyyttä, eli piilottaa sen onnistuneen blogin lisäämisen jälkeen.
      const returnedBlog = await blogService.create(blogObject)
      console.log('returnedBlog in addBlog: ', returnedBlog)
      blogs.sort((a, b) => b.likes - a.likes) // Sort the blogs in descending order based on likes
      setBlogs(blogs.concat(returnedBlog)) //Lisätty blogi lisätään blogs-tilaan concat-metodilla, joka luo uuden taulukon, jossa on vanhat blogit ja uusi blogi.
      setErrorMessage(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added and blogs sorted by likes!`,
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch {
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
    } catch {
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
  const padding = {
    padding: 5,
  }

  const blogForm = () => (
    <div>
      Log in to application...
      <button
        type="button"
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
    <Router>
      <div>
        <Link style={padding} to="/blogs">
          blogs
        </Link>
        <Link style={padding} to="/new_blog">
          new blog
        </Link>
        {user ? (
          blogForm()
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>
      <div>
        <Notification message={errorMessage} />
        <Routes>
          <Route
            path="/blogs"
            element={
              <Blogs
                blogs={blogs}
                user={user}
                updateBlog={updateBlog}
                removeBlogId={removeBlogId}
              />
            }
          />
          <Route
            path="/new_blog"
            element={
              <Toggable buttonLabel="create new blog" ref={blogFormRef}>
                <New_Blog addBlog={addBlog} />
              </Toggable>
            }
          />
          <Route
            path="/login"
            element={
              <Toggable buttonLabel="log in" ref={blogFormRef}>
                <Login handleLogin={handleLogin} />
              </Toggable>
            }
          />
          <Route
            path="/"
            element={
              <Blogs
                blogs={blogs}
                user={user}
                updateBlog={updateBlog}
                removeBlogId={removeBlogId}
              />
            }
          />
        </Routes>

        {/* {user && blogForm()}
        {/* {!user && loginForm()} */}
        {/*<Toggable buttonLabel="new blog">{addNewBlogForm()}</Toggable> */}
        {/* <Toggable buttonLabel="log in" ref={blogFormRef}>
          <LoginForm handleLogin={handleLogin} />
        </Toggable>
        <Toggable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm addBlog={addBlog} />
        </Toggable> */}
        {/*user && addNewBlogForm()*/}
        {/* {user && (
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
        )} */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
