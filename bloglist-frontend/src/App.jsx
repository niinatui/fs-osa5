import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setMessage('logged out')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
  }

  const addBlog = (blogObject) => {
    console.log(blogObject)
  
    try {
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      } catch(exception) {
          setMessage(`problem with adding a blog: ${exception}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
         username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
      <button type="submit">login</button>
    </form>
    </div>      
  )

  const blogForm = () => {
    return (
      <Togglable buttonLabel= "new blog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  function compareLikes(a, b) {
    return b.likes - a.likes
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} is logged in</p>
        <form onSubmit={handleLogout}>
        <button type="submit">logout</button>
      </form>
      {blogForm()}
    </div>
}
    {blogs.sort(compareLikes).map(blog =>
      <Blog key={blog.id} blog={blog} user={user} />
    )}
  </div>
  )
}

export default App