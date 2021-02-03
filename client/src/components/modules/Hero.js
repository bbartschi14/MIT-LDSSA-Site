import React, { Component } from "react";
import "./Hero.css";

/*
 * Hero image component for the main page of the website
*/
class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    
  }

 

  render() {
    return (
      <>
      <div className="Hero-mainContainer">
        <div className="Hero-text">
          Welcome! This page is currently under construction. Contact us at ldssa-officers@mit.edu or visit www.churchofjesuschrist.org/
          to learn more about the Church of Jesus Christ of Latter-day Saints.
        </div>
      </div>
      </>
    );
  }
}

export default Hero;
