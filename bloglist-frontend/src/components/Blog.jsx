import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [blogs, setBlogs] = useState([])
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(null)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    const updatedBlog = ({
      ...blog,
      likes: blog.likes+1
    })
    updateBlog(updatedBlog)
  }

  const updateBlog = async (blogUpdate) => {
    const updatedBlog = await blogService
      .update(blogUpdate.id, blogUpdate)
    setBlogs(blogs.map(blog => blog.id !== blogUpdate.id ? blog : updatedBlog))
  }

  const removeBlog = async (blogToRemove) => {
    if (window.confirm(`Delete ${blogToRemove.title} ?`)) {
      try {
        await blogService
          .remove(blogToRemove.id)
        setMessage('blog deleted')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
      } catch(exception) {
        setMessage('cannot delete blog')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button id="view" onClick={() => setVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>hide</button>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button id="like" onClick={addLike}>like</button></div>
      </div>
      <div><button onClick={() => removeBlog(blog)}>remove</button></div>
    </div>
  )
}

export default Blog