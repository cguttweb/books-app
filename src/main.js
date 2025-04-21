import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

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
      <input type="number" id="year" name="year" required />
      <label for="publisher">Publisher:</label>
      <input type="text" id="publisher" name="publisher" required />

      <label for="published_date">Published Date:</label>
      <input type="date" id="published_date" name="published_date" required />

      <label for="isbn">ISBN (if known):</label>
      <input type="text" id="isbn" name="isbn" />
      
      <label for="format">Format:</label>
      <input type="text" id="format" name="format" required />

      <button type="submit">Add Book</button>
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

