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
const title = document.getElementById('bookTitle').value
const author = document.getElementById('bookAuthor').value
const format = document.getElementById('bookFormat').value
const category = document.getElementById('category').value
const genre = document.getElementById('genre').value
const isbn = document.getElementById('isbn').value
const publisher = document.getElementById('bookPublisher').value
const yearPublished = document.getElementById('bookYearPublished').value

const addBookBtn = document.getElementById('addBook')
let Books = []

addBookBtn.addEventListener('click', e => {
  e.preventDefault()
})
