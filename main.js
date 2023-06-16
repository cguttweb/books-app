import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
  </div>
`

class Book {
  constructor(
    title,
    author,
    format,
    category,
    genre,
    isbn,
    published,
    yearPublished
  ) {
    this._title = title
    this._author = author
    this._format = format
    this._category = category
    this._genre = genre
    this._isbn = isbn
    this._published = published
    this._yearPublished = yearPublished
  }

  static clearBookFields() {
    document.querySelector('#bookTitle').value
    document.querySelector('#bookAuthor').value
    document.querySelector('#bookFormat').value
    document.querySelector('#bookCategory').value
    document.querySelector('#bookGenre').value
    document.querySelector('#bookYearPublished').value
    document.querySelector('#bookIsbn').value
    document.querySelector('#bookPublisher').value
  }
}

const addBookBtn = document.getElementById('addBook')
let myBooks = []

addBookBtn.addEventListener('click', e => {
  e.preventDefault()
  const title = document.getElementById('bookTitle').value
  const author = document.getElementById('bookAuthor').value
  const format = document.getElementById('bookFormat').value
  const category = document.getElementById('bookCategory').value
  const genre = document.getElementById('bookGenre').value
  const isbn = document.getElementById('bookIsbn').value
  const publisher = document.getElementById('bookPublisher').value
  const yearPublished = document.getElementById('bookYearPublished').value

  const book = new Book(
    title,
    author,
    format,
    category,
    genre,
    isbn,
    publisher,
    yearPublished
  )

  myBooks.push(book)

  console.log(myBooks)
  Book.clearBookFields()
})
