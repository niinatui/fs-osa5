import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders title and author', async () => {
  const blog = {
    title: 'this is title',
    author: 'niina',
    url: '123',
    likes: 2
  }

  const component = render(<Blog blog={blog} />)
  expect(component.container).toHaveTextContent('this is title')
})

test('after clicking view, other information is displayed', async () => {
  const blog = {
    title: 'this is title',
    author: 'niina',
    url: '123',
    likes: 2
  }

  const user = userEvent.setup()
  const component = render(<Blog blog={blog} />)
  const button = component.getByText('view')
  await user.click(button)
  expect(component.container).toHaveTextContent('123')
})

test('if like is clicked twice, eventhandler is called twice', async () => {
  const blog = {
    title: 'this is title',
    author: 'niina',
    url: '123',
    likes: 2
  }

  const mockHandler = jest.fn()
  const component = render(<Blog blog={blog} addLike={mockHandler}/>)
  const user = userEvent.setup()
  const viewButton = component.getByText('view')
  await user.click(viewButton)
  const likeButton = component.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('new blog is added correctly', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm addBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('title here')
  const inputAuthor = screen.getByPlaceholderText('author here')
  const inputUrl = screen.getByPlaceholderText('url here')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'testing a form...')
  await user.type(inputAuthor, 'niina')
  await user.type(inputUrl, 'www.blog.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
})
