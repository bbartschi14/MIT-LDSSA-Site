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

  getDate = () => {
    var date = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    var dateArray = date.split("/");
    var year = dateArray[2].substring(0,4);
    var day = dateArray[1].padStart(2, "0");
    var month = dateArray[0].padStart(2, "0");

    
    return month+"/"+day+"/"+year
    
  };

  getYearDate = () => {
    var date = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    var dateArray = date.split("/");
    var year = dateArray[2].substring(0,4);
    var day = dateArray[1].padStart(2, "0");
    var month = dateArray[0].padStart(2, "0");

    
    return year+"-"+month+"-"+day
    
  };

  render() {
    var date = this.getDate();
    var yearDate = this.getYearDate();
    return (
      <>
        <Hero/>
        <ScripturePanel userId={this.props.userId} date={date} yearDate={yearDate}/>
        <Activities userId={this.props.userId} userStatus={this.props.userStatus}/>
        
      </>
    );
  }
}

export default Home;
