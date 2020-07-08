import React from "react";
import {
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  CircularProgress
} from "@material-ui/core";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loggedIn: false
    };
  }

  login = () => {
    this.setState({ isLoading: true });
    fetch("http://localhost:1337/auth/local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identifier: document.getElementById("username").value,
        password: document.getElementById("password").value
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("invalid username/password");
        }
      })
      .then(data => {
        sessionStorage.setItem("token", data.jwt);
        this.setState({ isLoading: false, loggedIn: true });
        this.props.history.push("/dash");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div
          style={{
            height: "100%",
            backgroundColor: "#bbdefb"
          }}
        >
          <Grid
            style={{ paddingTop: "24px" }}
            container
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid>
        </div>
      );
    } else {
      return (
        <div
          style={{
            backgroundColor: "#bbdefb"
          }}
        >
          <Grid container justify="center" alignItems="center">
            <Paper style={{ padding: "15px" }}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Typography variant="h4">Login</Typography>
                <TextField
                  id="username"
                  label="Username"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="password"
                  label="Password"
                  margin="normal"
                  variant="outlined"
                  type="password"
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "18px" }}
                  onClick={this.login}
                >
                  Login
                </Button>
                <Typography variant="caption" style={{ marginTop: "24px" }}>
                  Forgot Password? Contact Admin
                </Typography>
              </Grid>
            </Paper>
          </Grid>
        </div>
      );
    }
  }
}

export default App;
