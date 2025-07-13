export function createBookNoteComponent(title, author, rating, notes) {
  const bookNoteElement = document.createElement("div");
  bookNoteElement.classList.add("book-note");
  const t = document.createElement("h2");
  t.textContent = title;
  const a = document.createElement("p");
  a.textContent = author;
  const r = document.createElement("p");
  r.textContent = rating;
  const n = document.createElement("p");
  n.textContent = notes;

  bookNoteElement.appendChild(t);
  bookNoteElement.appendChild(a);
  bookNoteElement.appendChild(r);
  bookNoteElement.appendChild(n);

  return bookNoteElement;
}
