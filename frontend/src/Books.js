import React from 'react';
import {Paper, Table, TableBody, TableCell, TableRow, TableHead, TextField, 
    Button, Dialog, DialogActions, DialogTitle, DialogContent} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {StyleSheet,css} from 'aphrodite';

const style = StyleSheet.create({
    tableHeading: {
        fontWeight: 'bold',
        fontSize: '16px'
    },
    tableSearchFieldHead: {
        padding: '8px',
        outline: 'none'
    },
    dialogFields: {
        margin: '8px'
    }
});

class Books extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            books: [],
            searchTitle: '',
            searchAuthor: '',
            searchIsbn: '',
            searchCopies: '',
            searchIssuedCopies: '',
            dialogOpen: true,
            titleErr: false,
            authorErr: false,
            isbnErr: false,
            copiesErr: false
        }
    }

    componentDidMount(){
        this.setState({books: this.props.location.state.books})
    }

    onTitleSearchChange = (e) => {
        this.setState({searchTitle: e.target.value.toLowerCase()})
    }

    onAuthorSearchChange = (e) => {
        this.setState({searchAuthor: e.target.value.toLowerCase()})
    }

    onIsbnSearchChange = (e) => {
        this.setState({searchIsbn: e.target.value})
    }

    onCopiesSearchChange = (e) => {
        this.setState({searchCopies: e.target.value})
    }

    onIssuedCopiesSearchChange = (e) => {
        this.setState({searchIssuedCopies: e.target.value})
    }

    addBookDialog = () => {
        this.setState({dialogOpen: true})
    }

    handleDialogClose = () => {
        this.setState({
            dialogOpen: false,
            titleErr: false,
            authorErr: false,
            isbnErr: false,
            copiesErr: false
        })
    }

    addBook = () => {
        let title = document.getElementById("add-title").value
        let author = document.getElementById("add-author").value
        let isbn = document.getElementById("add-isbn").value
        let copies = document.getElementById("add-copies").value
        if(title === ''){
            this.setState({titleErr: true})
        }
        if(author === ''){
            this.setState({authorErr: true})
        }
        if(isNaN(parseInt(isbn))){
            this.setState({isbnErr: true})
        }
        if(isNaN(parseInt(copies))){
            this.setState({copiesErr: true})
        }
        
        // this.handleDialogClose()
    }

    render(){
        let filteredBooks = this.state.books.filter((val) => {
            return val.name.toLowerCase().indexOf(this.state.searchTitle) !== -1 &&
                val.author.toLowerCase().indexOf(this.state.searchAuthor) !== -1 &&
                val.isbn.toString().indexOf(this.state.searchIsbn) !== -1 &&
                val.copies.toString().indexOf(this.state.searchCopies) !== -1 &&
                val.issued.toString().indexOf(this.state.searchIssuedCopies) !== -1
        })

        return(
            <div style={{backgroundColor: "#bbdefb", padding: "24px", }}>
                <Button 
                    variant="contained"
                    startIcon={<AddIcon/>}
                    style={{backgroundColor: "#4caf50", position: "absolute", right: "24px"}}
                    onClick={this.addBookDialog}
                >
                    add book
                </Button> 
                <Paper style={{marginTop: "48px"}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className={css(style.tableHeading)}>Title</TableCell>
                                <TableCell align="right" className={css(style.tableHeading)}>Author</TableCell>
                                <TableCell align="right" className={css(style.tableHeading)}>ISBN</TableCell>
                                <TableCell align="right" className={css(style.tableHeading)}>Copies</TableCell>
                                <TableCell align="right" className={css(style.tableHeading)}>Issued Copies</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow style={{outline: "none", borderStyle: 'hidden'}}>
                                <TableCell className={css(style.tableSearchFieldHead)}>
                                    <TextField 
                                        variant="outlined" 
                                        style={{width: "100%"}} 
                                        onChange={this.onTitleSearchChange} 
                                    />
                                </TableCell>
                                <TableCell align="right" className={css(style.tableSearchFieldHead)}>
                                    <TextField variant="outlined" onChange={this.onAuthorSearchChange}/>
                                </TableCell>
                                <TableCell align="right" className={css(style.tableSearchFieldHead)}>
                                    <TextField variant="outlined" onChange={this.onIsbnSearchChange} />
                                </TableCell>
                                <TableCell align="right" className={css(style.tableSearchFieldHead)}>
                                    <TextField variant="outlined" onChange={this.onCopiesSearchChange} />
                                </TableCell>
                                <TableCell align="right" className={css(style.tableSearchFieldHead)}>
                                    <TextField variant="outlined" onChange={this.onIssuedCopiesSearchChange} />
                                </TableCell>
                            </TableRow>
                            {filteredBooks.map(row => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
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
                <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose} >
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
            </div>
        );
    }
}

export default Books