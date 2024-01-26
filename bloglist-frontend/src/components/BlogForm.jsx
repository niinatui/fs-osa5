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
          <input id='title' value={newTitle} onChange={handleTitleChange} placeholder='title here'/>
        </div>
        <div>
        author:
          <input id= 'author' value={newAuthor} onChange={handleAuthorChange} placeholder='author here'/>
        </div>
        <div>
        url:
          <input id='url' value={newUrl} onChange={handleUrlChange} placeholder='url here'/>
        </div>
        <button id='create-button' type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm