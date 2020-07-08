export const getBooks = () => {
  return fetch("http://localhost:1337/books", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(response => response.json());
};

export const getStudents = () => {
  return fetch("http://localhost:1337/students", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(response => response.json());
};

export const addBook = ({ title, author, isbn, copies }) => {
  return fetch("http://localhost:1337/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    },
    body: JSON.stringify({
      title,
      author,
      isbn,
      copies,
      issued: 0
    })
  }).then(response => response.json());
};

export const editBook = ({ id, title, author, isbn, copies }) => {
  return fetch(`http://localhost:1337/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    },
    body: JSON.stringify({
      title,
      author,
      isbn,
      copies
    })
  }).then(response => response.json());
};

export const issueBook = (book, id) => {};

export const deleteBook = id => {
  return fetch(`http://localhost:1337/books/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(response => response.json());
};
