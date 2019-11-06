import React from 'react'

class Books extends React.Component {
    
    constructor(props){
        super(props)
    }

    render(){
        console.log(this.props.location.state.books)
        return(
            <div>
                books
            </div>
        );
    }
}

export default Books