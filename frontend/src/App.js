import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import Home from "./containers/Home";
import Dash from "./containers/Dash";
import Books from "./containers/Books";
import Student from "./containers/Student";
import Issue from "./containers/Issue";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: createBrowserHistory(),
      isLoading: false,
      loggedIn: false
    };
  }

  render() {
    return (
      <Router history={this.state.history}>
        <AppBar id="appbar">
          <Toolbar>
            <Typography
              variant="h6"
              onClick={() => this.state.history.push("/dash")}
              style={{ cursor: "pointer" }}
            >
              Apollo
            </Typography>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route
            exact
            path="/"
            render={props => <Home {...props} height={this.state.height} />}
          />
          <Route path="/dash" render={props => <Dash {...props} />} />
          <Route
            path="/books"
            render={props => <Books {...props} height={this.state.height} />}
          />
          <Route
            path="/students"
            render={props => <Student {...props} height={this.state.height} />}
          />
          <Route
            path="/issue-books"
            render={props => <Issue {...props} height={this.state.height} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
