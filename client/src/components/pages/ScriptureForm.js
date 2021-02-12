import React, { Component } from "react";
import FormCalendar from "../modules/FormCalendar.js";
import scriptures from "../../public/lds-scriptures-json.json"
import "../modules/ScriptureForm.css";
import { get, post } from "../../utilities";
import { Link } from "@reach/router";

class ScriptureForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scriptureName:"",
      validScripture:false,
      scriptureText:null,
      reflectionText:"",
      selected_day:"",
      datesTaken:undefined,
      modalActive:false,
      failed:false
    };
    this.scriptureInputChanged = this.scriptureInputChanged.bind(this);
    this.getScripture = this.getScripture.bind(this);    
    this.enterPressed = this.enterPressed.bind(this);
    this.reflectionInputChanged = this.reflectionInputChanged.bind(this);
    this.setDay = this.setDay.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.postFailed = this.postFailed.bind(this);
    this.pickNew = this.pickNew.bind(this);

  }

  componentDidMount() {
    get("/api/sotds").then((sotds) => {
      console.log(sotds)
      var newArray = sotds.map((sotd) => sotd.date)
      console.log(newArray)
      this.setState({datesTaken:newArray});
    });
  }

  getScripture(scriptureName) {
    for (var i = 0; i < scriptures.length; i++) {
      if (scriptures[i].verse_title == scriptureName) {
        return scriptures[i]
      }
    }
    return null
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if(code === 13) { 
        event.preventDefault();
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

  reflectionInputChanged(event) {
    this.setState({reflectionText:event.target.value})
  }

  setDay(day) {
    this.setState({selected_day:day})
  }

  postFailed() {
    this.setState({failed:true, selected_day:""})
    get("/api/sotds").then((sotds) => {
      var newArray = sotds.map((sotd) => sotd.date)
      this.setState({datesTaken:newArray});
    });
  }

  pickNew() {
    this.setState({modalActive:false,
                  failed:false})
  }

  submitPost() {
    if (!this.state.validScripture 
      || !this.state.reflectionText.length > 0 
      || !this.state.selected_day.length > 0) return;
    this.setState({modalActive:true})
    const body = {
      verse: this.state.scriptureName,
      reflection: this.state.reflectionText,
      date: this.state.selected_day
    };
    get("/api/sotd", { date: body.date }).then((s) => {
      console.log("Checking if date exists" + s)
      if (s.length == 0) {
        console.log("Posting")
        post("/api/sotd", body).then((sotd) => {
          this.setState({
            selected_day:"",
            datesTaken: this.state.datesTaken.concat([sotd.date]),
            scriptureSubmitted:true
          });
        });
      } else {
        this.postFailed()
      }
    });
   

  }

  render() {

    var displayText = this.state.scriptureText
    var headingText = null
 
    if (!displayText) {
     headingText = "No scripture match"
    } else {
     headingText = "Scripture found:"
    }

    var submitClass = "Form-submitPostButton-inactive"
    let click;
    if (this.state.validScripture && this.state.reflectionText.length > 0 && this.state.selected_day.length > 0) {
      submitClass = "Form-submitPostButton"
      click = this.submitPost;
    } 

    if (!this.props.userId) {
      return ( <> <div className="Form-mainContainer"><p style={{marginLeft:"32px"}}>You must be logged in to post</p></div></>)
    }

    let modalText = "Submitting..."
    if (this.state.scriptureSubmitted) {
      modalText = "Scripture submitted!"
    }
    if (this.state.failed) {
      modalText = "Post failed, day already taken"
    }

    return (
      <>

        <div className={this.state.modalActive ? "SetScripture-modal" : "SetScripture-modalHidden"} ref={modal => this.modal = modal}>
            <div className="SetScripture-modalContent">
                <div style={{marginBottom:"24px"}}>{modalText}</div>
                {this.state.failed ? <span className="SetScripture-submitButton" onClick={this.pickNew}>Pick New Day</span> : 
                <Link to="/" className="SetScripture-submitButton" >Return Home</Link>}
            </div>
        </div>

        <div className="Form-mainContainer">
          <div className="Form-help">
            Currently, scripture search queries must match official names and formatting. For example:
            <ul className="bullets">
              <li>1 Nephi 3:7</li>
              <li>Doctrine and Covenants 4:1</li>
              <li>John 3:5</li>
              <li>Joseph Smith--History 1:17</li>
            </ul>

          </div>
          <div className="Form-pickScripture">
            <h1>1. Choose a Scripture</h1>
              <form style={{marginLeft:"24px"}}>
                <div> 
                  <label className='Label'>
                  Search:
                  </label>
                  <input className="SetScripture-inputBox" maxLength="30" type="text" value={this.state.scriptureName} onKeyPress={this.enterPressed} onChange={this.scriptureInputChanged} />
                </div>
                <div className="SetScripture-heading">{headingText}</div>
                <div>
                <div className="SetScripture-sampleText">{displayText}</div>
                </div>
              </form>
            <h1>2. Add a Reflection</h1>
              <form style={{marginLeft:"24px"}}>
                <textarea className="SetScripture-inputBox" placeholder="Write your thoughts here..." style={{width:"600px", height:"200px",fontSize:"16px"}} maxLength="1000" type="text" value={this.state.reflectionText} onKeyPress={this.enterPressed} onChange={this.reflectionInputChanged} />
                
              </form>

            <h1>3. Pick a Day</h1>
              <div style={{marginLeft:"24px"}}>
                <p>Selected day: {this.state.selected_day}</p>
                <FormCalendar selectedDay={this.state.selected_day} onDaySelect={this.setDay} datesTaken={this.state.datesTaken} />
              </div>
            <h1 style={{marginTop:"36px"}}>4. <span className={submitClass} onClick={click}>Submit Post!</span></h1>
              
          </div>
        </div>
      </>
    );
  }
}

export default ScriptureForm;
