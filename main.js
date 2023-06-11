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
    <h1>My Books 📚</h1>
    <form id="books-form">
      <label for="title">Title</label>
        <input type="text" name="title" id="bookTitle" required>
      <label for="author">Author</label>
        <input type="text" name="author" id="author">
      <label for="format">Format</label>
        <select name="format" id="bookFormat" required>
          <option value="">Please Select</option>
          <option value="hardback">Hardback</option>
          <option value="paperback">Paperback</option>
          <option value="ebook">eBook</option>
        </select>
      <label for="category">Category</label>
        <select name="category" id="category">
          <option value="">Please Select</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
        </select>
      <label for="genre">Genre</label>
        <select name="genre" id="genre">
          <option value="">Please select</option>
          <option value="art-photography">Art & Photography</option>
          <option value="autobiography">Autobiography</option>
          <option value="biography">Biography</option>
          <option value="crime">Crime</option>
          <option value="fantasy">Fantasy</option>
          <option value="food-drink">Food & Drink</option>
          <option value="history">History</option>
          <option value="mystery">Mystery</option>
          <option value="sci-fi">Science Fiction</option>
          <option value="sport">Sport</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </select>
      <label for="isbn">ISBN</label>
        <input type="text" name="isbn" id="isbn">
      <label for="publisher">Publisher</label>
        <input type="text" name="publisher" id="bookPublisher">
      <label for="yearPublished">Year Published</label>
        <input type="number" name="yearPublished" id="bookYearPublished">
      <button id="addBook">Add Book</button>
  </form>
  </div>
`
