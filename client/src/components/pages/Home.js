import React, { Component } from "react";
import Hero from "../modules/Hero.js";
import ScripturePanel from "../modules/ScripturePanel.js";
import Activities from "../modules/Activities.js";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  componentDidMount() {
    document.title = "MIT LDSSA";
  }


  render() {
    
    return (
      <>
        <Hero/>
        <ScripturePanel userId={this.props.userId}/>
        <Activities/>
      </>
    );
  }
}

export default Home;
