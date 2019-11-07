import React from 'react';
import {Paper, Table, TableBody, TableCell, TableRow, TableHead, TextField} from '@material-ui/core';
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
    tableSearchField: {
        
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
            searchIssuedCopies: ''
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
                <Paper>
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
            </div>
        );
    }
}

export default Books