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

const form = document.querySelector("#book-form")
const bookList = document.querySelector("#books-table tbody")

async function loadBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("title")
  if (error) return console.error(error)

  bookList.innerHTML = data
    .map(
      (book) => `
      <tr>
        <td>${book.title}</td>
        <td>${book.author || ""}</td>
        <td>${book.genre || ""}</td>
        <td>${book.format || ""}</td>
        <td>${book.publisher || ""}</td>
        <td>${book.year_published || ""}</td>
        <td>${book.isbn || ""}</td>
        <td>${book.read ? "✅" : "X"}</td>
        <td>${book.rating || ""}</td>
        <td>${book.notes || ""}</td>
        <td><button class="edit">Edit</button></td>
        <td><button class="remove" data-id=${book.id}>X</button></td>
      </tr>
    `
    )
    .join("")

  const removeButtons = document.querySelectorAll(".remove")

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr")
      const bookId = e.target.dataset.id
      console.log("Deleting book ID:", bookId)

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

// async function addBooks() {
//   const { data, error } = await supabase.from("books").insert()
//   console.log(data)
// }

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const formData = new FormData(form)

  const book = Object.fromEntries(formData.entries())
  book.read = formData.get("read") ? true : false

  const { data, error } = await supabase.from("books").insert([book])
  console.log(book)

  if (error) {
    console.error("Insert error:", error)
    console.log("Error: book not inserted")
  } else {
    form.reset()
    console.log("Book added:", data)
    loadBooks()
  }
})
