import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import Home from "./Home";
import Dash from "./Dash";
import Books from "./Books";
import Student from "./Student";
import Issue from "./Issue";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: createBrowserHistory(),
      isLoading: false,
      loggedIn: false,
      height: "100vh"
    };
  }

  componentDidMount() {
    let height =
      document.documentElement.clientHeight -
      document.getElementById("appbar").offsetHeight;
    this.setState({ height });
  }

  render() {
    return (
      <Router history={this.state.history}>
        <AppBar position="static" id="appbar">
          <Toolbar>
            <Typography
              variant="h6"
              onClick={() => this.state.history.push("/dash")}
              style={{ cursor: "pointer" }}
            >
              IIIT Trichy Library
            </Typography>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route
            exact
            path="/"
            render={props => <Home {...props} height={this.state.height} />}
          />
          <Route
            path="/dash"
            render={props => <Dash {...props} height={this.state.height} />}
          />
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
