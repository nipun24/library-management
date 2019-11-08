import React from 'react'
import {Paper, Typography, Grid} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'

const style = StyleSheet.create({
    cardStyle: {
        margin: "16px", 
        padding: "36px", 
        height: "200px", 
        width: "200px",     
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "column",
        ':hover': {
            transform: 'scale(1.05)',
            cursor: 'pointer'
        }
    }
});

class Dash extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            students: [],
            books: []
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
        .then(data => this.setState({students: data}))
        
        //fetching books
        fetch('http://localhost:1337/books',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            },
        })
        .then(response => response.json())
        .then(data => this.setState({books: data}))
    }

    showBooks = () => {
        this.props.history.push('/books', {books: this.state.books})
    }

    render(){
        return(
            <div style={{height: `${this.props.height}px`,backgroundColor: "#bbdefb"}}>
                <Grid container justify="center" alignItems="center" style={{padding: "24px"}}>
                    <Paper className={css(style.cardStyle)}>
                        <Typography variant="h1">
                            20
                        </Typography>
                        <Typography variant="subtitle1">
                            books issued
                        </Typography>
                    </Paper>
                    <Paper className={css(style.cardStyle)} onClick={this.showBooks}>
                        <Typography variant="h1">
                            {this.state.books.length}
                        </Typography>
                        <Typography variant="subtitle1">
                            books remaining
                        </Typography>
                    </Paper>
                    <Paper className={css(style.cardStyle)}>
                        <Typography variant="h1">
                            {this.state.students.length}
                        </Typography>
                        <Typography variant="subtitle1">
                            students
                        </Typography>
                    </Paper>
                    <Paper className={css(style.cardStyle)}>
                        <Typography variant="h1">
                            5
                        </Typography>
                        <Typography variant="subtitle1">
                            overdue
                        </Typography>
                    </Paper>
                </Grid>
            </div>
        );
    }
}

export default Dash