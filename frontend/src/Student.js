import React from 'react';
import {Paper, Table, TableBody, TableCell, TableRow, TableHead, TextField, 
    Button, Dialog, DialogActions, DialogTitle, DialogContent, Snackbar, IconButton,
    DialogContentText} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
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

class Students extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            students: [],
            searchName: '',
            searchRollNumber: '',
            searchNoOfBooks: '',
            nameErr: false,
            rollNumberErr: false,
            dialogOpen: false,
            hover: 'hidden',
            rollNoToDelete: '',
            deleteDialog: false,
            hiddenElem: null,
            snackbarMessage: '',
            snackbarOpen: false
        }
    }

    componentDidMount(){
        //fetching students
        fetch('http://localhost:1337/students',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            },
        })
        .then(response => response.json())
        .then(data => {
            var final = []
            var i
            for(i in data){
                let c = data[i].books.length
                final.push({...data[i], noOfBooks: c})
            }
            this.setState({students: final})
        })
    }

    onNameSearchChange = (e) => {
        this.setState({searchName: e.target.value.toLowerCase()})
    }

    onRollNumberSearchChange = (e) => {
        this.setState({searchRollNumber: e.target.value.toLowerCase()})
    }

    onNoOfBooksSearchChange = (e) => {
        this.setState({searchNoOfBooks: e.target.value.toLowerCase()})
    }    

    handleDialogClose = () => {
        this.setState({
            nameErr: false,
            rollNumberErr: false,
            dialogOpen: false
        })
    }

    addStudent = () => {
        let name = document.getElementById("add-name").value
        let rollNumber = document.getElementById("add-roll-number").value.toUpperCase()
        var c = 0

        if(name === ''){
            this.setState({nameErr: true})
        }
        else {
            this.setState({nameErr: false})
            c++
        }
        if(rollNumber === ''){
            this.setState({rollNumberErr: true})
        }
        else {
            this.setState({rollNumberErr: false})
            c++
        }
         
        if(c===2){
            //adding student to database
            fetch('http://localhost:1337/students',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name,
                    rollNumber,
                    books: []
                })
            })
            .then(response => response.json())
            .then(data => {
                let students = this.state.students
                students.push(data)
                this.setState({...students, snackbarOpen: true, snackbarMessage: "Student added successfully!"})
                this.handleDialogClose()
            })
            .catch(() => {
                this.setState({snackbarOpen: true, snackbarMessage: "Student cannot be added!"})
                this.handleDialogClose()
            })
        }
    }

    deleteStudent = () => {
        let rollNumber = this.state.rollNoToDelete
        let students =  this.state.students
        var studentToDelete
        let studentsToKeep = students.filter((a)=>{
            if(a.rollNumber === rollNumber){
                studentToDelete = a
            }
            return a.rollNumber !== rollNumber
        })

        console.log(studentToDelete)

        //deleting book from database
        fetch(`http://localhost:1337/students/${studentToDelete.id}`,{
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({students: studentsToKeep, deleteDialog: false, snackbarOpen: true, snackbarMessage: "Book deleted successfully!"})
        })
        .catch(() => {
            this.setState({snackbarOpen: true, deleteDialog: false, snackbarMessage: "Book cannot be deleted!"})
        })
    }

    onHoverStart = (e) => {
        let hiddenElem = e.target.parentElement.getElementsByTagName("button")[0]
        hiddenElem.style.visibility = "visible"
        this.setState({hiddenElem})
    }

    onHoverOver = (e) => {
        let hiddenElem = this.state.hiddenElem
        hiddenElem.style.visibility = "hidden"
    }

    render(){
        let filteredStudents = this.state.students.filter((val) => {
            return val.name.toLowerCase().indexOf(this.state.searchName) !== -1 &&
                val.rollNumber.toLowerCase().indexOf(this.state.searchRollNumber) !== -1 &&
                val.noOfBooks.toString().indexOf(this.state.searchNoOfBooks) !== -1
        })

        return(
            <div style={{backgroundColor: "#bbdefb", padding: "24px", }}>
                <Button 
                    variant="contained"
                    startIcon={<AddIcon/>}
                    style={{backgroundColor: "#4caf50", position: "absolute", right: "24px"}}
                    onClick={() => {this.setState({dialogOpen: true})}}
                >
                    add student
                </Button> 
                <Paper style={{marginTop: "48px"}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className={css(style.tableHeading)}>Name</TableCell>
                                <TableCell align="right" className={css(style.tableHeading)}>Roll Number</TableCell>
                                <TableCell align="right" className={css(style.tableHeading)}>No. of books</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow style={{outline: "none", borderStyle: 'hidden'}}>
                                <TableCell className={css(style.tableSearchFieldHead)}>
                                    <TextField 
                                        variant="outlined" 
                                        style={{width: "100%"}} 
                                        onChange={this.onNameSearchChange} 
                                    />
                                </TableCell>
                                <TableCell align="right" className={css(style.tableSearchFieldHead)}>
                                    <TextField variant="outlined" onChange={this.onRollNumberSearchChange}/>
                                </TableCell>
                                <TableCell align="right" className={css(style.tableSearchFieldHead)}>
                                    <TextField variant="outlined" onChange={this.onNoOfBooksSearchChange} />
                                </TableCell>
                            </TableRow>
                            {filteredStudents.map((row,i) => (
                                <TableRow 
                                    id={row.rollNumber}
                                    key={i} 
                                    onMouseEnter={this.onHoverStart}
                                    onMouseLeave={this.onHoverOver}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                        <IconButton 
                                            style={{float: "right", visibility: "hidden", cursor: "pointer", padding: "0px"}}
                                            onClick={(e) => this.setState({deleteDialog: true, rollNoToDelete: e.target.closest('tr').id})}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="right">{row.rollNumber}</TableCell>
                                    <TableCell align="right">
                                        <IconButton>
                                            <VisibilityIcon/>
                                        </IconButton>
                                        {row.noOfBooks}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                {/* dialog to add students */}
                <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose} >
                    <DialogTitle>Add a Student</DialogTitle>
                    <DialogContent>
                        <TextField 
                            id="add-name"
                            error={this.state.nameErr} 
                            className={css(style.dialogFields)} 
                            variant="outlined" 
                            label="Name"
                        />
                        <TextField 
                            id="add-roll-number"
                            error={this.state.rollNumberErr} 
                            className={css(style.dialogFields)} 
                            variant="outlined" 
                            label="Roll Number"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addStudent} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* snackbar */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => {this.setState({snackbarOpen: false})}}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackbarMessage}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={() => {this.setState({snackbarOpen: false})}}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />

                {/* Dialog to confirn student deletion */}
                <Dialog
                    open={this.state.deleteDialog}
                    onClose={() => this.setState({deleteDialog: false})}
                >
                    <DialogTitle>Delete Student</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently delete this student?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.setState({deleteDialog: false})} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.deleteStudent} color="primary" autoFocus>
                        Yes
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Students