import './style.css'
import Book from './books.js'

let books = []

let title = document.querySelector('#title').value
let author = document.querySelector('#author').value
let genre = document.querySelector('#genre').value
let publisher = document.querySelector('#publisher').value
let published_date = document.querySelector('#published_date').value
let format = document.querySelector('#format').value
let isbn = document.querySelector('#isbn').value
let year = document.querySelector('#year').value

function storeBook(event) {
  event.preventDefault()
  if (year > new Date().getFullYear()) {
    alert('Please enter a valid year up to the current year.')
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
}

const submitButton = document.querySelector('#addBook')
submitButton.addEventListener('click', storeBook)
submitButton.addEventListener('click', addToBooksTable)

function addToBooksTable() {
  const booksTable = document.querySelector('#book-table')
  const row = document.createElement('tr')
  row.innerHTML = `
  <tr>
    <td>${title}</td>
    <td>${author}</td>
    <td>${genre}</td>
    <td>${year}</td>
    <td>${publisher}</td>
    <td>${published_date}</td>
    <td>${isbn}</td>
    <td>${format}</td>
  </tr>
  `
  booksTable.appendChild(row)
}

function clearForm(){
  document.querySelector('#title').value = ''
  document.querySelector('#author').value = ''
  document.querySelector('#genre').value = ''
  document.querySelector('#publisher').value = ''
  document.querySelector('#published_date').value= ''
  document.querySelector('#format').value = ''
  document.querySelector('#isbn').value = ''
  document.querySelector('#year').value = ''
}