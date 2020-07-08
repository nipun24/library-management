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
  DialogContentText,
  Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getBooks,
  addBook,
  editBook,
  getStudents,
  deleteBook
} from "../utils/strapiUtils";
import MenuComponent from "../components/MenuComponent";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
  },
  focus: {
    position: "relative",
    ":focus-within ~ .autocomplete": {
      display: "block",
      
    }
  },
  autocomplete: {
    display: "none",
    margin: "-8px 8px 0 8px",
    padding: "8px",
    position: "absolute",
    zIndex: "1000000",
    width: "300px"
  },
  items: {
    padding: "10px"
  }
});

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      students: [],
      //search box values for table
      searchTitle: "",
      searchAuthor: "",
      searchIsbn: "",
      searchCopies: "",
      searchIssuedCopies: "",
      //add book dialog
      dialogOpen: false,
      //error for input fields in add books
      titleErr: false,
      authorErr: false,
      isbnErr: false,
      copiesErr: false,
      //issue book dialog
      issueDialog: false,
      bookToIssue: "",
      //edit book dialog
      editDialog: false,
      bookToEdit: "",
      //confirm delete dilog
      deleteDialog: false,
      //isbn of the book to delete
      bookToDelete: "",
      //snackbar states
      snackbarMessage: "",
      snackbarOpen: false,
      //vertical menu open state
      openMenu: null
    };
  }

  componentDidMount() {
    getBooks().then(data => this.setState({ books: data }));
    getStudents().then(data => this.setState({ students: data }));
  }

  onTitleSearchChange = e => {
    this.setState({ searchTitle: e.target.value.toLowerCase() });
  };

  onAuthorSearchChange = e => {
    this.setState({ searchAuthor: e.target.value.toLowerCase() });
  };

  onIsbnSearchChange = e => {
    this.setState({ searchIsbn: e.target.value });
  };

  onCopiesSearchChange = e => {
    this.setState({ searchCopies: e.target.value });
  };

  onIssuedCopiesSearchChange = e => {
    this.setState({ searchIssuedCopies: e.target.value });
  };

  selectedFn = data => {
    console.log(data);
    if (data.selected.toLowerCase() === "delete book") {
      this.setState({ deleteDialog: true, bookToDelete: data.data });
    } else if (data.selected.toLowerCase() === "edit book") {
      this.setState({ editDialog: true, bookToEdit: data.data });
    } else if (data.selected.toLowerCase() === "issue book") {
      this.setState({ issueDialog: true, bookToIssue: data.data });
    } else {
      return Error;
    }
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
      addBook({ title, author, isbn, copies })
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

  issueBook = () => {};

  editBook = id => {
    let title = document.getElementById("edit-title").value;
    let author = document.getElementById("edit-author").value;
    let isbn = document.getElementById("edit-isbn").value;
    let copies = document.getElementById("edit-copies").value;

    //editing book in database
    editBook({ id, title, author, isbn, copies })
      .then(data => {
        //fetching updated book list
        getBooks().then(data => this.setState({ books: data }));
        this.setState({
          editDialog: false,
          snackbarOpen: true,
          snackbarMessage: "Book edited succesfully!"
        });
      })
      .catch(() => {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: "Book cannot be edited!"
        });
      });
  };

  deleteBook = () => {
    var isbn = this.state.bookToDelete;
    let books = this.state.books;
    var bookToDelete;
    let booksToKeep = books.filter(a => {
      if (a.isbn === isbn) {
        bookToDelete = a;
      }
      return a.isbn !== isbn;
    });

    //deleting book from database
    deleteBook(bookToDelete.id)
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

  onMenuClose = row => {
    console.log(row);
    this.setState({ openMenu: null });
  };

  render() {
    let filteredBooks = this.state.books.filter(val => {
      return (
        val.title.toLowerCase().indexOf(this.state.searchTitle) !== -1 &&
        val.author.toLowerCase().indexOf(this.state.searchAuthor) !== -1 &&
        val.isbn.toString().indexOf(this.state.searchIsbn) !== -1 &&
        val.copies.toString().indexOf(this.state.searchCopies) !== -1 &&
        val.issued.toString().indexOf(this.state.searchIssuedCopies) !== -1
      );
    });

    return (
      <div className={css(style.innerDiv)}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          style={{
            backgroundColor: "#4caf50",
            position: "absolute",
            right: "24px"
          }}
          onClick={() => {
            this.setState({ dialogOpen: true });
          }}
        >
          add book
        </Button>
        <Paper style={{ marginTop: "48px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={css(style.tableHeading)}>Title</TableCell>
                <TableCell align="right" className={css(style.tableHeading)}>
                  Author
                </TableCell>
                <TableCell align="right" className={css(style.tableHeading)}>
                  ISBN
                </TableCell>
                <TableCell align="right" className={css(style.tableHeading)}>
                  Copies
                </TableCell>
                <TableCell align="right" className={css(style.tableHeading)}>
                  Issued Copies
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{ outline: "none", borderStyle: "hidden" }}>
                <TableCell className={css(style.tableSearchFieldHead)}>
                  <TextField
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.onTitleSearchChange}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className={css(style.tableSearchFieldHead)}
                >
                  <TextField
                    variant="outlined"
                    onChange={this.onAuthorSearchChange}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className={css(style.tableSearchFieldHead)}
                >
                  <TextField
                    variant="outlined"
                    onChange={this.onIsbnSearchChange}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className={css(style.tableSearchFieldHead)}
                >
                  <TextField
                    variant="outlined"
                    onChange={this.onCopiesSearchChange}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className={css(style.tableSearchFieldHead)}
                >
                  <TextField
                    variant="outlined"
                    onChange={this.onIssuedCopiesSearchChange}
                  />
                </TableCell>
              </TableRow>
              {filteredBooks.map((row, i) => (
                <TableRow key={i} className={css(style.hover)}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      paddingRight: "0",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    {row.title}
                    <MenuComponent
                      data={row.isbn}
                      menuItems={["Issue Book", "Edit Book", "Delete Book"]}
                      icon={MoreVertIcon}
                      selected={this.selectedFn}
                      className={`menu-button ${css(style.menuButton)}`}
                    />
                  </TableCell>
                  <TableCell align="right">{row.author}</TableCell>
                  <TableCell align="right">{row.isbn}</TableCell>
                  <TableCell align="right">{row.copies}</TableCell>
                  <TableCell align="right">{row.issued}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* dialog to add books */}
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>Add a Book</DialogTitle>
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

        {/* dialog to issue books */}
        <Dialog
          open={this.state.issueDialog}
          onClose={() => this.setState({ issueDialog: false })}
        >
          <DialogTitle>Issue Book</DialogTitle>
          <DialogContent>
            <TextField
              id="issue-roll-number"
              // error={this.state.copiesErr}
              className={css(style.dialogFields, style.focus)}
              style={{ width: "300px" }}
              variant="outlined"
              label="Name/Roll Number"
            />
            <Paper className={`autocomplete ${css(style.autocomplete)}`}>
              {this.state.students.map(student => {
                return (
                  <Typography className={css(style.items)}>
                    {student.rollNumber} - {student.name}
                  </Typography>
                );
              })}
            </Paper>
            {/* <Autocomplete
              id="combo-box-demo"
              options={this.state.students}
              getOptionLabel={option => option.name}
              style={{ width: 300 }}
              defaultValue="1"
              value="1"
              renderInput={params => (
                <TextField
                  {...params}
                  label="Combo box"
                  variant="outlined"
                  fullWidth
                />
              )}
            /> */}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ issueDialog: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={this.issueBook} color="primary">
              Issue
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog to edit books */}
        <Dialog
          open={this.state.editDialog}
          onClose={() => this.setState({ editDialog: false })}
        >
          <DialogTitle>Edit Book</DialogTitle>
          {this.state.books.map((book, i) => {
            if (book.isbn === this.state.bookToEdit) {
              return (
                <React.Fragment key={i}>
                  <DialogContent>
                    <TextField
                      id="edit-title"
                      variant="outlined"
                      label="Title"
                      className={css(style.dialogFields)}
                      defaultValue={book.title}
                    />
                    <TextField
                      id="edit-author"
                      variant="outlined"
                      label="Author"
                      className={css(style.dialogFields)}
                      defaultValue={book.author}
                    />
                    <TextField
                      id="edit-isbn"
                      variant="outlined"
                      label="ISBN"
                      className={css(style.dialogFields)}
                      defaultValue={book.isbn}
                    />
                    <TextField
                      id="edit-copies"
                      variant="outlined"
                      label="Number of Copies"
                      className={css(style.dialogFields)}
                      defaultValue={book.copies}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => this.setState({ editDialog: false })}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => this.editBook(book.id)}
                      color="primary"
                    >
                      save changes
                    </Button>
                  </DialogActions>
                </React.Fragment>
              );
            } else {
              return null;
            }
          })}
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
              onClick={() =>
                this.setState({ deleteDialog: false, bookToDelete: "" })
              }
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

export default Books;
