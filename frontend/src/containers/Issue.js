import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Snackbar,
  IconButton,
  DialogContentText
} from "@material-ui/core";
import MenuComponent from "../components/MenuComponent";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloseIcon from "@material-ui/icons/Close";
import { StyleSheet, css } from "aphrodite";

const style = StyleSheet.create({
  tableHeading: {
    fontWeight: "bold",
    fontSize: "16px"
  },
  tableSearchFieldHead: {
    padding: "8px",
    outline: "none"
  },
  dialogFields: {
    margin: "8px"
  },
  menuButton: {
    visibility: "hidden",
    padding: "0px"
  },
  hover: {
    ":hover .menu-button": {
      visibility: "visible"
    }
  },
  innerDiv: {
    flexGrow: 1,
    backgroundColor: "#bbdefb",
    marginTop: "64px",
    padding: "24px"
  }
});

class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      students: [],
      searchTitle: "",
      searchIsbn: "",
      searchName: "",
      searchRollNumber: "",
      openMenu: null,
      ////////////////
      titleErr: false,
      authorErr: false,
      isbnErr: false,
      copiesErr: false,
      deleteDialog: false,
      isbnToDelete: "",
      snackbarMessage: "",
      snackbarOpen: false
    };
  }

  componentDidMount() {
    //fetching books
    fetch("http://localhost:1337/books", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ books: data }));

    //fetching student
    fetch("http://localhost:1337/students", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ students: data });
      });
  }

  onIsbnSearchChange = e => {
    this.setState({ searchIsbn: e.target.value });
  };

  onTitleSearchChange = e => {
    this.setState({ searchTitle: e.target.value.toLowerCase() });
  };

  onNameSearchChange = e => {
    this.setState({ searchName: e.target.value.toLowerCase() });
  };

  onRollNoSearchChange = e => {
    this.setState({ searchRollNumber: e.target.value.toLowerCase() });
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      titleErr: false,
      authorErr: false,
      isbnErr: false,
      copiesErr: false
    });
  };

  addBook = () => {
    let title = document.getElementById("add-title").value;
    let author = document.getElementById("add-author").value;
    let isbn = document.getElementById("add-isbn").value;
    let copies = document.getElementById("add-copies").value;
    var c = 0;

    if (title === "") {
      this.setState({ titleErr: true });
    } else {
      this.setState({ titleErr: false });
      c++;
    }
    if (author === "") {
      this.setState({ authorErr: true });
    } else {
      this.setState({ authorErr: false });
      c++;
    }
    if (isNaN(parseInt(isbn))) {
      this.setState({ isbnErr: true });
    } else {
      this.setState({ isbnErr: false });
      c++;
    }
    if (isNaN(parseInt(copies))) {
      this.setState({ copiesErr: true });
    } else {
      this.setState({ copiesErr: false });
      c++;
    }

    if (c === 4) {
      //adding books to strapi
      fetch("http://localhost:1337/books", {
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
      })
        .then(response => response.json())
        .then(data => {
          let books = this.state.books;
          books.push(data);
          this.setState({
            ...books,
            snackbarOpen: true,
            snackbarMessage: "Book added successfully!"
          });
          this.handleDialogClose();
        })
        .catch(() => {
          this.setState({
            snackbarOpen: true,
            snackbarMessage: "Book cannot be added!"
          });
          this.handleDialogClose();
        });
    }
  };

  deleteBook = () => {
    let isbn = this.state.isbnToDelete;
    let books = this.state.books;
    var bookToDelete;
    let booksToKeep = books.filter(a => {
      if (a.isbn === isbn) {
        bookToDelete = a;
      }
      return a.isbn !== isbn;
    });

    //deleting book from database
    fetch(`http://localhost:1337/books/${bookToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          books: booksToKeep,
          deleteDialog: false,
          snackbarOpen: true,
          snackbarMessage: "Book deleted successfully!"
        });
      })
      .catch(() => {
        this.setState({
          snackbarOpen: true,
          deleteDialog: false,
          snackbarMessage: "Book cannot be deleted!"
        });
      });
  };

  onMenuClose = () => {
    this.setState({ openMenu: null });
  };

  render() {
    var filteredStudents = [];
    let students = JSON.parse(JSON.stringify(this.state.students));

    students.forEach(student => {
      let finalStudent = student;
      if (student.books.length > 0) {
        var filteredBooks = [];
        student.books.forEach(book => {
          if (
            book.isbn.toString().indexOf(this.state.searchIsbn) !== -1 &&
            book.title.indexOf(this.state.searchTitle) !== -1
          ) {
            filteredBooks.push(book);
          }
        });

        if (
          student.name.toLowerCase().indexOf(this.state.searchName) !== -1 &&
          student.rollNumber
            .toLowerCase()
            .indexOf(this.state.searchRollNumber) !== -1
        ) {
          finalStudent.books = filteredBooks;
          filteredStudents.push(finalStudent);
        }
      }
    });

    return (
      <div className={css(style.innerDiv)}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={css(style.tableHeading)}>ISBN</TableCell>
                <TableCell align="right" className={css(style.tableHeading)}>
                  Title
                </TableCell>
                <TableCell align="right" className={css(style.tableHeading)}>
                  Student Name
                </TableCell>
                <TableCell align="right" className={css(style.tableHeading)}>
                  Roll Number
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{ outline: "none", borderStyle: "hidden" }}>
                <TableCell className={css(style.tableSearchFieldHead)}>
                  <TextField
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.onIsbnSearchChange}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className={css(style.tableSearchFieldHead)}
                >
                  <TextField
                    variant="outlined"
                    onChange={this.onTitleSearchChange}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className={css(style.tableSearchFieldHead)}
                >
                  <TextField
                    variant="outlined"
                    onChange={this.onNameSearchChange}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className={css(style.tableSearchFieldHead)}
                >
                  <TextField
                    variant="outlined"
                    onChange={this.onRollNoSearchChange}
                  />
                </TableCell>
              </TableRow>
              {filteredStudents.map(student => {
                return student.books.map((book, i) => {
                  return (
                    <TableRow
                      id={book.isbn}
                      key={i}
                      className={css(style.hover)}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          paddingRight: "0",
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        {book.isbn}
                        <MenuComponent
                          data={book.isbn}
                          menuItems={["ReturnBook", "Re-Issue Book"]}
                          icon={MoreVertIcon}
                          selected={this.selectedFn}
                          className={`menu-button ${css(style.menuButton)}`}
                        />
                      </TableCell>
                      <TableCell align="right">{book.title}</TableCell>
                      <TableCell align="right">{student.name}</TableCell>
                      <TableCell align="right">{student.rollNumber}</TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </Paper>

        {/* dialog to add books */}
        <Dialog
          open={this.state.issueBookDialogOpen}
          onClose={this.handleDialogClose}
        >
          <DialogTitle>Issue a Book</DialogTitle>
          <DialogContent>
            <TextField
              id="add-title"
              error={this.state.titleErr}
              className={css(style.dialogFields)}
              variant="outlined"
              label="Title"
            />
            <TextField
              id="add-author"
              error={this.state.authorErr}
              className={css(style.dialogFields)}
              variant="outlined"
              label="Author"
            />
            <TextField
              id="add-isbn"
              error={this.state.isbnErr}
              className={css(style.dialogFields)}
              variant="outlined"
              label="ISBN"
            />
            <TextField
              id="add-copies"
              error={this.state.copiesErr}
              className={css(style.dialogFields)}
              variant="outlined"
              label="Number of Copies"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.addBook} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* snackbar for add book success */}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={3000}
          onClose={() => {
            this.setState({ snackbarOpen: false });
          }}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.snackbarMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() => {
                this.setState({ snackbarOpen: false });
              }}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />

        {/* Dialog to confirn book deletion */}
        <Dialog
          open={this.state.deleteDialog}
          onClose={() => this.setState({ deleteDialog: false })}
        >
          <DialogTitle>Delete Book</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to permanently delete this book?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ deleteDialog: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={this.deleteBook} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Issue;
