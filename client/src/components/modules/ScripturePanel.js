import React, { Component } from "react";
import "./ScripturePanel.css";
import "./CommentsArea.js";

import scriptures from "../../public/lds-scriptures-json.json"
import CommentsArea from "./CommentsArea.js";
/*
 * Hero image component for the main page of the website
*/
class ScripturePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScripture:null,
      modalActive:false,
      scriptureName:"",
      validScripture:false,
      scriptureText:null,
      date:"01/01/2021"
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.setScripture = this.setScripture.bind(this);
    this.scriptureInputChanged = this.scriptureInputChanged.bind(this);
    this.getScripture = this.getScripture.bind(this);
    this.formatScriptureName = this.formatScriptureName.bind(this);
    this.submitScripture = this.submitScripture.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }

  toggleModal() {
    this.setState({modalActive : !this.state.modalActive})
  }

  submitScripture() {
    if (this.state.validScripture) {
      this.setScripture(this.state.scriptureName)
      this.toggleModal()
    }
  }

  scriptureInputChanged(event) {
    var scrip = this.getScripture(event.target.value)
    this.setState({scriptureName:event.target.value})
    if (scrip) {
      this.setState({validScripture:true,
                    scriptureText:scrip.scripture_text})
    } else {
      this.setState({validScripture:false,
        scriptureText:null})
    }
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if(code === 13) { 
        event.preventDefault();
        this.submitScripture();
    } 
  }

  setScripture(scriptureName) {
    this.setState({currentScripture : this.getScripture(scriptureName)})
  }

  getScripture(scriptureName) {
    for (var i = 0; i < scriptures.length; i++) {
      if (scriptures[i].verse_title == scriptureName) {
        return scriptures[i]
        //console.log(`seconds elapsed = ${((Date.now()-start) / 1000)}`);
      }
    }
    return null
  }

  formatScriptureName(book, chapter, verse) {
    return book + " " + chapter + ":" + verse
  }

  setDate = () => {
    var date = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    var dateArray = date.split("/");
    var year = dateArray[2].substring(0,4);
    var day = "10".padStart(2, "0");
    var month = dateArray[0].padStart(2, "0");

    this.setState({
      date:month+"/"+day+"/"+year
    });
  };

  componentDidMount() {
    let verse = "1 Nephi 3:7"
    //const start = Date.now();
    this.setScripture(verse);
    this.setDate();
  }

  render() {
    var scriptureBox = null
    if (!this.state.currentScripture) {
      scriptureBox = <div className="ScripturePanel-scripture">No Scripture found</div>
    } else {
      scriptureBox = 
        <div className="ScripturePanel-scripture">
          <div className="ScripturePanel-scriptureContainer">
          <div className="ScripturePanel-verse-text">{"\""+this.state.currentScripture.scripture_text+"\""}</div>
          <div className="ScripturePanel-verse-title"> {this.state.currentScripture.verse_title}</div>
          </div>
         
        </div>
    }

   var displayText = this.state.scriptureText
   var headingText = null

   var buttonClass = "SetScripture-submitButton"
   if (!displayText) {
    headingText = "No scripture match"
    buttonClass = "SetScripture-submitButtonInactive"
   } else {
    headingText = "Scripture found:"
   }

    return (
      <>
      <div className="ScripturePanel-mainContainer">

          <div className={this.state.modalActive ? "SetScripture-modal" : "SetScripture-modalHidden"} ref={modal => this.modal = modal}>
              <div className="SetScripture-modalContent">
                  <div className="SetScripture-closeButton" onClick={this.toggleModal}>X</div>
                  <form className="SetScripture-modalForm">
                    <div className="SetScripture-modalRow"> 
                      <label className='Label'>
                      Search for a scripture:
                      </label>
                      <input className="SetScripture-inputBox" maxLength="30" type="text" value={this.state.scriptureName} onKeyPress={this.enterPressed} onChange={this.scriptureInputChanged} />
                    </div>
                    <div className="SetScripture-heading">{headingText}</div>

                    <div className="SetScripture-sampleText">{displayText}</div>
                    <span className={buttonClass} onClick={this.submitScripture}>Submit</span>
                  </form>
                  
              </div>
          </div>

          <div className="ScripturePanel-dateCardContainer">
            <div className="ScripturePanel-dateCard">{this.state.date.substring(0,1)}</div>
            <div className="ScripturePanel-dateCard">{this.state.date.substring(1,2)}</div>
            <div className="ScripturePanel-dateCardSeparator">/</div>

            <div className="ScripturePanel-dateCard">{this.state.date.substring(3,4)}</div>
            <div className="ScripturePanel-dateCard">{this.state.date.substring(4,5)}</div>
            <div className="ScripturePanel-dateCardSeparator">/</div>

            <div className="ScripturePanel-dateCard">{this.state.date.substring(6,7)}</div>
            <div className="ScripturePanel-dateCard">{this.state.date.substring(7,8)}</div>
            <div className="ScripturePanel-dateCard">{this.state.date.substring(8,9)}</div>
            <div className="ScripturePanel-dateCard">{this.state.date.substring(9,10)}</div>


          </div>
          <div className="ScripturePanel-title">Scripture of the Day</div>
          <div className="ScripturePanel-horizontalContainer">
          <div className="ScripturePanel-verticalContainer">
          {scriptureBox}
          <div className="ScripturePanel-setScriptureButton"onClick={this.toggleModal}>Set Scripture</div>
          </div>
          <CommentsArea date={this.state.date} userId={this.props.userId}/>
          </div>
      </div>
      
      </>
    );
  }
}

export default ScripturePanel;
