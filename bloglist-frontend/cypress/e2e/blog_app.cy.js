describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'mattimeikalainen',
      name: 'matti',
      password: 'testi'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mattimeikalainen')
      cy.get('#password').type('testi')
      cy.get('#login-button').click()
      cy.contains('matti is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mattimeikalainen')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('mattimeikalainen')
      cy.get('#password').type('testi')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a note created by cypress')
      cy.get('#author').type('matti')
      cy.get('#url').type('www.blog.com')
      cy.get('#create-button').click()
      cy.contains('a note created by cypress')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a note created by cypress')
      cy.get('#author').type('matti')
      cy.get('#url').type('www.blog.com')
      cy.get('#create-button').click()

      cy.contains('view').click()
      cy.get('#like').click()
      cy.visit('http://localhost:5173')
      cy.contains('view').click()
      cy.contains('likes 1')
    })

    it('A blog can be removed', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a note created by cypress')
      cy.get('#author').type('matti')
      cy.get('#url').type('www.blog.com')
      cy.get('#create-button').click()
      cy.contains('a note created by cypress')

      cy.contains('remove').click()
      cy.visit('http://localhost:5173')
      cy.get('html').should('not.contain', 'a note created by cypress')
    })
  })
})