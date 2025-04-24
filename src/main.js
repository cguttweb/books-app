import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import Book from './books.js'


document.querySelector('#app').innerHTML = `
  <div>
    <h1>Books App</h1>
    <form id="book-form">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" required />

      <label for="author">Author:</label>
      <input type="text" id="author" name="author" required />

      <label for="genre">Genre:</label>
      <input type="text" id="genre" name="genre" required />

      <label for="year">Year:</label>
      <input type="number" id="year" name="year"  />

      <label for="publisher">Publisher:</label>
      <input type="text" id="publisher" name="publisher" />

      <label for="published_date">Published Date:</label>
      <input type="date" id="published_date" name="published_date" />

      <label for="isbn">ISBN (if known):</label>
      <input type="text" id="isbn" name="isbn" />
      
      <label for="format">Format:</label>
      <input type="text" id="format" name="format" />

      <button id="addBook" type="submit">Add Book</button>
    </form>
    <footer>
      <a href="https://vite.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
      </a>
    </footer>
  </div>
`
let books = []

function storeBook(event) {
  event.preventDefault()
  const form = event.target
  const title = document.querySelector('#title').value
  const author = document.querySelector('#author').value  
  const genre = document.querySelector('#genre').value
  const publisher = document.querySelector('#publisher').value
  const published_date = document.querySelector('#published_date').value
  const format = document.querySelector('#format').value
  const isbn = document.querySelector('#isbn').value
  const year = document.querySelector('#year').value
  if (year < 1900 || year > new Date().getFullYear()) {
    alert('Please enter a valid year between 1900 and the current year.')
    return
  }

  const book = new Book(
    title,
    author,
    genre,
    publisher,
    published_date,
    format,
    isbn,
    year
  )
  console.log('Book added:', book)
  books.push(book)
  console.log('Books array:', books)
}

const submitButton = document.querySelector('#addBook')
submitButton.addEventListener('click', storeBook)
