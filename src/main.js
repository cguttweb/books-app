import "./style.css"
import javascriptLogo from "./javascript.svg"
import viteLogo from "/vite.svg"
import { supabase } from "./supabase.js"

const footer = document.querySelector("footer")

footer.innerHTML = `
<p>Built by <a href="https://github.com/cguttweb">Chloe</a> with 
<a href="https://vite.dev" target="_blank">
<img src="${viteLogo}" class="logo" alt="Vite logo" width="30" />
</a> <span>and</span>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
<img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" width="30" />
</a>
</p>
`

const GENRE_OPTIONS = `
  <option value="autobiography">Autobiography</option>
  <option value="biography">Biography</option>
  <option value="fantasy">Fantasy</option>
  <option value="fiction">Fiction</option>
  <option value="history">History</option>
  <option value="mystery">Mystery</option>
  <option value="mythology">Mythology</option>
  <option value="nature">Nature/Natural History</option>
  <option value="non-fiction">Non-fiction</option>
  <option value="sci-fi">Science Fiction</option>
  <option value="other">Other</option>
`

const loginForm = document.querySelector("#login-form")
const loginEmail = document.querySelector("#login-email")
const loginPassword = document.querySelector("#login-password")
const logoutBtn = document.querySelector("#logout-btn")
const authStatus = document.querySelector("#auth-status")
const authError = document.querySelector("#auth-error")
const authGateMessage = document.querySelector("#auth-gate-message")
const bookSection = document.querySelector("#book-section")
const form = document.querySelector("#book-form")
const bookList = document.querySelector("#books-table tbody")
const booksCards = document.querySelector("#books-cards")
const librarySummary = document.querySelector("#library-summary")
const appMessage = document.querySelector("#app-message")
const modalContainer = document.querySelector(".modal-container")
const formContainer = document.querySelector(".form-container")
const modalCloseBtn = document.querySelector("#modal-close")

let booksCache = []
let isLoggedIn = false

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatRead(read) {
  return read
    ? '<span class="read-badge read-yes">Read</span>'
    : '<span class="read-badge read-no">Unread</span>'
}

function formatRating(rating) {
  if (!rating || rating === "null") return "—"
  return `${rating}/5`
}

function showAppMessage(text, type = "success") {
  appMessage.textContent = text
  appMessage.className = `app-message ${type}`
  appMessage.classList.remove("hidden")
}

function hideAppMessage() {
  appMessage.classList.add("hidden")
}

function showAuthError(text) {
  authError.textContent = text
  authError.classList.remove("hidden")
}

function hideAuthError() {
  authError.textContent = ""
  authError.classList.add("hidden")
}

function closeModal() {
  modalContainer.classList.add("hidden")
  formContainer.innerHTML = ""
}

function openEditModal(book) {
  formContainer.innerHTML = `
    <form id="edit-book-form">
      <label for="edit-title">Title:</label>
      <input type="text" id="edit-title" name="title" required>

      <label for="edit-author">Author:</label>
      <input type="text" id="edit-author" name="author" required>

      <label for="edit-format">Format:</label>
      <select name="format" id="edit-format" required>
        <option value="null">Please select</option>
        <option value="hardback">Hardback</option>
        <option value="paperback">Paperback</option>
        <option value="ebook">eBook</option>
      </select>

      <label for="edit-genre">Genre:</label>
      <select name="genre" id="edit-genre">
        ${GENRE_OPTIONS}
      </select>

      <label for="edit-purchase_date">Date of purchase:</label>
      <input type="date" name="purchase_date" id="edit-purchase_date">

      <label for="edit-publisher">Publisher:</label>
      <input type="text" name="publisher" id="edit-publisher">

      <label for="edit-year_published">Year Published:</label>
      <input type="number" name="year_published" id="edit-year_published">

      <label for="edit-read">Read:</label>
      <input type="checkbox" name="read" id="edit-read">

      <label for="edit-rating">Rating:</label>
      <select name="rating" id="edit-rating">
        <option value="null">Please select</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <label for="edit-notes">Notes:</label>
      <textarea name="notes" id="edit-notes"></textarea>

      <div class="form-actions">
        <button type="button" class="btn-secondary" id="edit-cancel">Cancel</button>
        <button type="submit">Save changes</button>
      </div>
    </form>
  `

  const editForm = formContainer.querySelector("#edit-book-form")
  editForm.querySelector("#edit-title").value = book.title || ""
  editForm.querySelector("#edit-author").value = book.author || ""
  if (book.format) editForm.querySelector("#edit-format").value = book.format
  if (book.genre) editForm.querySelector("#edit-genre").value = book.genre
  editForm.querySelector("#edit-purchase_date").value = book.purchase_date || ""
  editForm.querySelector("#edit-publisher").value = book.publisher || ""
  editForm.querySelector("#edit-year_published").value = book.year_published || ""
  editForm.querySelector("#edit-read").checked = Boolean(book.read)
  if (book.rating) editForm.querySelector("#edit-rating").value = String(book.rating)
  editForm.querySelector("#edit-notes").value = book.notes || ""

  editForm.querySelector("#edit-cancel").addEventListener("click", closeModal)

  editForm.addEventListener("submit", async (evt) => {
    evt.preventDefault()
    hideAppMessage()

    const submitBtn = editForm.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    submitBtn.textContent = "Saving..."

    const payload = {
      title: editForm.querySelector("#edit-title").value.trim(),
      author: editForm.querySelector("#edit-author").value.trim(),
      format: editForm.querySelector("#edit-format").value === "null"
        ? null
        : editForm.querySelector("#edit-format").value,
      genre: editForm.querySelector("#edit-genre").value || null,
      purchase_date: editForm.querySelector("#edit-purchase_date").value || null,
      publisher: editForm.querySelector("#edit-publisher").value.trim() || null,
      year_published: editForm.querySelector("#edit-year_published").value
        ? Number(editForm.querySelector("#edit-year_published").value)
        : null,
      read: editForm.querySelector("#edit-read").checked,
      rating: editForm.querySelector("#edit-rating").value === "null"
        ? null
        : editForm.querySelector("#edit-rating").value,
      notes: editForm.querySelector("#edit-notes").value.trim() || null,
    }

    const { error } = await supabase
      .from("books")
      .update(payload)
      .eq("id", book.id)

    submitBtn.disabled = false
    submitBtn.textContent = "Save changes"

    if (error) {
      showAppMessage(`Could not update book: ${error.message}`, "error")
      return
    }

    closeModal()
    showAppMessage("Book updated.")
    await loadBooks()
  })

  modalContainer.classList.remove("hidden")
}

async function updateAuthUI() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting session:", error)
    return
  }

  const session = data?.session
  isLoggedIn = Boolean(session)

  if (session) {
    loginForm.style.display = "none"
    logoutBtn.classList.remove("hidden")
    authStatus.textContent = `Logged in as ${session.user?.email || "user"}`
    bookSection.classList.remove("disabled")
    authGateMessage.classList.add("hidden")
    hideAuthError()
  } else {
    loginForm.style.display = "flex"
    logoutBtn.classList.add("hidden")
    authStatus.textContent = "Not logged in"
    bookSection.classList.add("disabled")
    authGateMessage.classList.remove("hidden")
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  hideAuthError()
  hideAppMessage()

  const email = loginEmail.value
  const password = loginPassword.value
  const submitBtn = loginForm.querySelector('button[type="submit"]')

  submitBtn.disabled = true
  submitBtn.textContent = "Logging in..."

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  submitBtn.disabled = false
  submitBtn.textContent = "Log in"

  if (error) {
    showAuthError(`Login failed: ${error.message}`)
    return
  }

  loginPassword.value = ""
  await updateAuthUI()
  await loadBooks()
})

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut()
  await updateAuthUI()
  await loadBooks()
})

supabase.auth.onAuthStateChange((_event, session) => {
  updateAuthUI()
  if (session) loadBooks()
})

modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) closeModal()
})

modalCloseBtn.addEventListener("click", closeModal)

function renderBookActions(bookId) {
  if (!isLoggedIn) return ""

  return `
    <button class="edit" data-id="${bookId}">Edit</button>
    <button class="remove" data-id="${bookId}">Delete</button>
  `
}

function attachBookActionHandlers() {
  document.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const book = booksCache.find((item) => String(item.id) === btn.dataset.id)
      if (book) openEditModal(book)
    })
  })

  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const book = booksCache.find((item) => String(item.id) === btn.dataset.id)
      const title = book?.title || "this book"

      if (!confirm(`Remove "${title}" from your library?`)) return

      hideAppMessage()
      btn.disabled = true

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", btn.dataset.id)

      if (error) {
        btn.disabled = false
        showAppMessage(`Could not delete book: ${error.message}`, "error")
        return
      }

      showAppMessage("Book removed.")
      await loadBooks()
    })
  })
}

async function loadBooks() {
  hideAppMessage()

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    showAppMessage(`Could not load books: ${error.message}`, "error")
    return
  }

  booksCache = data || []

  const unreadCount = booksCache.filter((book) => !book.read).length
  librarySummary.textContent = `${unreadCount} unread book${unreadCount === 1 ? "" : "s"}`

  bookList.innerHTML = booksCache
    .map(
      (book) => `
      <tr>
        <td>${escapeHtml(book.title)}</td>
        <td>${escapeHtml(book.author)}</td>
        <td>${escapeHtml(book.format)}</td>
        <td>${escapeHtml(book.genre)}</td>
        <td class="col-read">${formatRead(book.read)}</td>
        <td class="col-rating">${formatRating(book.rating)}</td>
        <td class="col-publisher">${escapeHtml(book.publisher)}</td>
        <td>${escapeHtml(book.year_published)}</td>
        <td>${escapeHtml(book.purchase_date)}</td>
        <td class="col-notes">${escapeHtml(book.notes)}</td>
        <td>${renderBookActions(book.id)}</td>
      </tr>
    `
    )
    .join("")

  booksCards.innerHTML = booksCache
    .map(
      (book) => `
      <article class="book-card">
        <h3>${escapeHtml(book.title)}</h3>
        <p>${escapeHtml(book.author)}</p>
        <div class="book-card-meta">
          ${formatRead(book.read)}
          <span>Rating: ${formatRating(book.rating)}</span>
          ${book.format ? `<span>${escapeHtml(book.format)}</span>` : ""}
          ${book.genre ? `<span>${escapeHtml(book.genre)}</span>` : ""}
        </div>
        ${book.notes ? `<p>${escapeHtml(book.notes)}</p>` : ""}
        <div class="book-card-actions">
          ${renderBookActions(book.id)}
        </div>
      </article>
    `
    )
    .join("")

  attachBookActionHandlers()
}

updateAuthUI()
loadBooks()

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  hideAppMessage()

  const submitBtn = form.querySelector('button[type="submit"]')
  submitBtn.disabled = true
  submitBtn.textContent = "Adding..."

  const formData = new FormData(form)
  const book = Object.fromEntries(formData.entries())
  book.read = formData.get("read") ? true : false
  book.purchase_date = formData.get("purchase_date") || null
  book.rating = formData.get("rating") === "null" ? null : formData.get("rating")

  const { error } = await supabase.from("books").insert([book])

  submitBtn.disabled = false
  submitBtn.textContent = "Add Book"

  if (error) {
    showAppMessage(`Could not add book: ${error.message}`, "error")
    return
  }

  form.reset()
  showAppMessage("Book added.")
  await loadBooks()
})
