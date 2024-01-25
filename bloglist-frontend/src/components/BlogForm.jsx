import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewBlog('')
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

  return (
    <div>
      <h2>create new blog</h2>
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
    </div>
  )
}

export default BlogForm