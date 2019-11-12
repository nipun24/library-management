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
  Menu,
  MenuItem
} from "@material-ui/core";
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
    float: "right",
    cursor: "pointer",
    padding: "0px"
  },
  hover: {
    ":hover #menu-button": {
      visibility: "visible"
    }
  }
});

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      searchTitle: "",
      searchAuthor: "",
      searchIsbn: "",
      searchCopies: "",
      searchIssuedCopies: "",
      dialogOpen: false,
      titleErr: false,
      authorErr: false,
      isbnErr: false,
      copiesErr: false,
      deleteDialog: false,
      isbnToDelete: "",
      snackbarMessage: "",
      snackbarOpen: false,
      openMenu: null
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
    console.log(this.state.books);
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
      <div style={{ backgroundColor: "#bbdefb", padding: "24px" }}>
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
                <TableRow id={row.isbn} key={i} className={css(style.hover)}>
                  <TableCell component="th" scope="row">
                    {row.title}
                    <IconButton
                      className={css(style.menuButton)}
                      id="menu-button"
                      onClick={e =>
                        this.setState({ openMenu: e.currentTarget })
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={this.state.openMenu}
                      keepMounted
                      open={Boolean(this.state.openMenu)}
                      onClose={this.onMenuClose}
                    >
                      <MenuItem onClick={this.onMenuClose}>
                        Delete Book
                      </MenuItem>
                      <MenuItem onClick={this.onMenuClose}>Edit Book</MenuItem>
                      <MenuItem onClick={this.onMenuClose}>Issue Book</MenuItem>
                    </Menu>
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

export default Books;
