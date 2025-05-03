import './style.css'
import Book from './books.js'

let books = []

function storeBook(event) {
  event.preventDefault()
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
  books.push(book)
  localStorage.setItem('bookslist', JSON.stringify(books))
  console.log('Books array:', books)
}

const submitButton = document.querySelector('#addBook')
submitButton.addEventListener('click', storeBook)
submitButton.addEventListener('click', displayBooksTable)

function displayBooksTable() {
  console.log('displayBooksTable called')
  const booksTable = document.querySelector('#booksTable')

}
