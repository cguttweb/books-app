import "./style.css"
import javascriptLogo from "./javascript.svg"
import viteLogo from "/vite.svg"
import { supabase } from "./supabase.js"

const footer = document.querySelector("footer")

footer.innerHTML = `
<p>Built by <a href="https://github.com/cguttweb">Chloe</a>with 
<a href="https://vite.dev" target="_blank">
<img src="${viteLogo}" class="logo" alt="Vite logo" width="30" />
</a> <span>and</span>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
<img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" width="30" />
</a>
</p>
`

// Login form for auth
const loginForm = document.querySelector('#login-form')
const loginEmail = document.querySelector('#login-email')
const loginPassword = document.querySelector('#login-password')
const logoutBtn = document.querySelector('#logout-btn')
const authStatus = document.querySelector("#auth-status")

// Auth UI

async function updateAuthUI() {
  const { data: session } = await supabase.auth.getSession()

  if (session) {
    if (loginForm) loginForm.style.display = "none"
    if (logoutBtn) logoutBtn.style.display = "inline-block"
    if (authStatus) authStatus.textContent = `Logged in as ${session.user.email}`
  } else {
    if (loginForm) loginForm.style.display = 'block'
    if (logoutBtn) logoutBtn.style.display = 'none'
    if (authStatus) authStatus.textContent = 'Not logged in'
  }
}

// Login form
loginForm.addEventListener('submit', async e => {
  e.preventDefault()

  const email = loginEmail.value;
  const password = loginPassword.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(`Login failed: ${error.message}`);
    return;
  }

  loginPassword.value = ''

  await updateAuthUI()
  await loadBooks()
})

// Logout functionality
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  await updateAuthUI();
  await loadBooks();
})

const form = document.querySelector("#book-form")
const bookList = document.querySelector("#books-table tbody")

async function loadBooks() {
  // look at further filtering to remove those not given a rating or not read...
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .limit(10)
    .order('created_at', { ascending: false })
  if (error) return console.error(error)

  bookList.innerHTML = data
    .map(
      (book) => `
      <tr>
        <td>${book.title}</td>
        <td>${book.author || ""}</td>
        <td>${book.format || ""}</td>
        <td>${book.genre || ""}</td>
        <td>${book.publisher || ""}</td>
        <td>${book.year_published || ""}</td>
        <td>${book.notes || ""}</td>
        <td><button class="edit" data-id=${book.id}>Edit</button></td>
        <td><button class="remove" data-id=${book.id}>X</button></td>
      </tr>
    `
    )
    .join("")

  const modalContainer = document.querySelector('.modal-container')
  const formContainer = document.querySelector('.form-container')
  const editBtns = document.querySelectorAll('.edit')


  function editForm() {
    formContainer.innerHTML = `
    <form id="book-form" method="POST">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" required>
      <label for="author">Author:</label>
      <input type="text" id="author" name="author" required>

      <label for="genre">Genre:</label>
      <select name="genre" id="genre" multiple>
        <option>Autobiography</option>
        <option>Biography</option>
        <option>Fantasy</option>
        <option>Fiction</option>
        <option>History</option>
        <option>Mystery</option>
        <option>Mythology</option>
        <option>Nature/Natural History</option>
        <option>Non-fiction</option>
        <option>Science Fiction</option>
        <option>Other</option>
      </select>

      <label for="format">Format:</label>
      <select name="format" id="format" required>
        <option value="null">Please select</option>
        <option value="hardback">Hardback</option>
        <option value="paperback">Paperback</option>
        <option value="ebook">eBook</option>
      </select>

      <label for="publisher">Publisher:</label>
      <input type="text" name="publisher" id="publisher">

      <label for="year_published">Year Published:</label>
      <input type="number" name="year_published" id="year_published">

      <label for="notes">Notes:</label>
      <textarea name="notes" id="notes"></textarea>

      <button type="submit">Save changes</button>
    </form>
  `;

    modalContainer.classList.remove('hidden');

    return formContainer.querySelector('#book-form');
  }

  editBtns.forEach((btn => {
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr");
      const bookId = e.target.dataset.id;
      const tds = row.querySelectorAll('td');

      const book = {
        title: tds[0].textContent.trim(),
        author: tds[1].textContent.trim(),
        genre: tds[2].textContent.trim(),
        format: tds[3].textContent.trim(),
        publisher: tds[4].textContent.trim(),
        year_published: tds[5].textContent.trim(),
        read: tds[6].textContent.trim() === "✅",
        rating: tds[7].textContent.trim(),
        notes: tds[8].textContent.trim(),
      };

      const form = editForm();

      const titleInput = form.querySelector('#title');
      const authorInput = form.querySelector('#author');
      const genreInput = form.querySelector('#genre');
      const formatInput = form.querySelector('#format');
      const publisherInput = form.querySelector('#publisher');
      const yearInput = form.querySelector('#year_published');
      const isbnInput = form.querySelector('#isbn');
      const readInput = form.querySelector('#read');
      const ratingInput = form.querySelector('#rating');
      const notesInput = form.querySelector('#notes');

      // Pre-fill values
      titleInput.value = book.title;
      authorInput.value = book.author;
      if (book.genre) genreInput.value = book.genre;
      if (book.format) formatInput.value = book.format;
      publisherInput.value = book.publisher;
      yearInput.value = book.year_published;
      readInput.checked = book.read;               // boolean now
      ratingInput.value = book.rating || 'null';
      notesInput.value = book.notes;

      form.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        const payload = {
          title: titleInput.value.trim(),
          author: authorInput.value.trim(),
          genre: genreInput.value,
          format: formatInput.value === 'null' ? null : formatInput.value,
          publisher: publisherInput.value.trim() || null,
          year_published: yearInput.value ? Number(yearInput.value) : null,
          isbn: isbnInput.value.trim() || null,
          read: readInput.checked,
          rating: ratingInput.value === 'null' ? null : Number(ratingInput.value),
          notes: notesInput.value.trim() || null,
        };

        const { error } = await supabase
          .from('books')
          .update(payload)
          .eq('id', bookId);

        if (error) {
          console.error('Error updating book', error);
          return;
        }

        // update table cells
        tds[0].textContent = payload.title;
        tds[1].textContent = payload.author;
        tds[2].textContent = payload.genre;
        tds[3].textContent = payload.format || '';
        tds[4].textContent = payload.publisher || '';
        tds[5].textContent = payload.year_published || '';
        tds[6].textContent = payload.isbn || '';
        tds[7].textContent = payload.read ? "✅" : "X";
        tds[8].textContent = payload.rating || '';
        tds[9].textContent = payload.notes || '';

        modalContainer.classList.add('hidden');
        formContainer.innerHTML = '';
      });
    });
  }));


  const removeButtons = document.querySelectorAll(".remove")

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr")
      const bookId = e.target.dataset.id
      // console.log("Deleting book ID:", bookId)

      // remove book row from UI
      row.remove()
      // remove from supabase db
      const { data, error } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId)
        .select()
    })
  })
}

loadBooks()

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const formData = new FormData(form)

  const book = Object.fromEntries(formData.entries())
  book.read = formData.get("read") ? true : false

  const { data, error } = await supabase.from("books").insert([book])
  // console.log(book)

  if (error) {
    console.error("Insert error:", error)
    // console.log("Error: book not inserted")
  } else {
    form.reset()
    // console.log("Book added:", data)
    loadBooks()
  }
})

