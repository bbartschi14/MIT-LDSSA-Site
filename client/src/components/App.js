import React, { Component } from "react";
import NavBar from "./modules/NavBar.js";
import { Router } from "@reach/router";
import Home from "./pages/Home.js";
import ScriptureForm from "./pages/ScriptureForm.js";

import NotFound from "./pages/NotFound.js";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

// to use styles, import the necessary CSS files
import "../utilities.css";
import "./App.css";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      userName: undefined,
      userStatus: undefined
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id,
                        userName: user.name,
                        userStatus: user.status });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      console.log(user.name)

      this.setState({ userId: user._id,
                     userName: user.name,
                      userStatus: user.status});
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  // required method: whatever is returned defines what
  // shows up on screen
  render() {
    return (
      // <> is like a <div>, but won't show
      // up in the DOM tree
      <>
        <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
          userName={this.state.userName} 
          userStatus={this.state.userStatus}
        />
        <div className="App-container">
          <Router>
            <Home path="/" 
                  userId={this.state.userId} 
                  userStatus={this.state.userStatus}
            />
            <ScriptureForm path="/scripture-form" userId={this.state.userId} 
            
            />
            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
