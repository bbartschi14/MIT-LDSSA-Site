import React, { Component } from "react";
import "./ScripturePanel.css";
import "./CommentsArea.js";
import { Link } from "@reach/router";
import { get, post } from "../../utilities";

import scriptures from "../../public/lds-scriptures-json.json"
import CommentsArea from "./CommentsArea.js";
/*
 * Hero image component for the main page of the website
*/
class ScripturePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sotd:null,

    };
    this.getScripture = this.getScripture.bind(this);
  }

  getScripture(scriptureName) {
    for (var i = 0; i < scriptures.length; i++) {
      if (scriptures[i].verse_title == scriptureName) {
        console.log(scriptures[i])
        return scriptures[i]
        //console.log(`seconds elapsed = ${((Date.now()-start) / 1000)}`);
      }
    }
    return null
  }

  componentDidMount() {
    let verse = "1 Nephi 3:7"
    console.log("getting sotd")
    get("/api/sotd", { date: this.props.yearDate }).then((sotd) => {
      console.log(sotd)
      this.setState({sotd:sotd[0]})
    });
  }

  render() {
    var scriptureBox = null
    var currentScripture = this.getScripture(this.state.sotd?.verse)
    if (!currentScripture) {
      scriptureBox = <div className="ScripturePanel-scripture">No Scripture found</div>
    } else {
      scriptureBox = 
      
        <div className="ScripturePanel-scripture">
          <div className="ScripturePanel-scriptureContainer">
            <div className="ScripturePanel-verse-text">{"\""+currentScripture.scripture_text+"\""}</div>
            <div className="ScripturePanel-verse-title"> {currentScripture.verse_title}</div>
          </div>
          <div className="ScripturePanel-scriptureContainer" style={{marginTop:"12px"}}>
            <div className="ScripturePanel-reflection-text">{this.state.sotd?.reflection}</div>
            <div className="ScripturePanel-reflection-title"> {this.state.sotd?.creator_name}</div>

          </div>
        </div>

        
    }

    return (
      <>
      <div className="ScripturePanel-mainContainer">

          
          <div className="ScripturePanel-title">Scripture of the Day</div>
          <div className="ScripturePanel-dateCardContainer">
            <div className="ScripturePanel-dateCard">{this.props.date.substring(0,1)}</div>
            <div className="ScripturePanel-dateCard">{this.props.date.substring(1,2)}</div>
            <div className="ScripturePanel-dateCardSeparator">/</div>

            <div className="ScripturePanel-dateCard">{this.props.date.substring(3,4)}</div>
            <div className="ScripturePanel-dateCard">{this.props.date.substring(4,5)}</div>
            <div className="ScripturePanel-dateCardSeparator">/</div>

            <div className="ScripturePanel-dateCard">{this.props.date.substring(6,7)}</div>
            <div className="ScripturePanel-dateCard">{this.props.date.substring(7,8)}</div>
            <div className="ScripturePanel-dateCard">{this.props.date.substring(8,9)}</div>
            <div className="ScripturePanel-dateCard">{this.props.date.substring(9,10)}</div>


          </div>
          <div className="ScripturePanel-horizontalContainer">
            <div className="ScripturePanel-verticalContainer">
            {scriptureBox} 
            </div>
            <CommentsArea date={this.props.date} userId={this.props.userId}/>
           
          </div>
          <Link to="/scripture-form" className="ScripturePanel-setScriptureButton">
            Set Scripture
          </Link>
      </div>
      
      
      </>
    );
  }
}

export default ScripturePanel;
