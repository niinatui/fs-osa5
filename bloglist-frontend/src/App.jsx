import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newBlog, setNewBlog] = useState('')

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

  
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }


  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    console.log(blogObject)
  
    try {
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
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
  }

  return (
    <div>
    <h2>blogs</h2>
    <p>{user.name} is logged in</p>
    <Notification message={message} />
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
    <h2>create new</h2>
    <form onSubmit={addBlog}>
      <div>
        title:
        <input value={newTitle} onChange={handleTitleChange}/>
      </div>
      <div>
        author:
          <input value={newAuthor} onChange={handleAuthorChange}/>
      </div>
      <div>
        url:
          <input value={newUrl} onChange={handleUrlChange}/>
      </div>
      <button type="submit">create</button>
    </form>

    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
  )
}

export default App