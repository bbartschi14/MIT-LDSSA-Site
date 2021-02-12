import React, { Component } from "react";
import "./Activities.css";
import "./CommentsArea.js";
import Calendar from "./Calendar"
import { get, post } from "../../utilities";
const mongoose = require("mongoose");

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities:[],
      active_selection:undefined,
      clicked_selection:undefined,
      modalActive:false,
      newName:"",
      newDescription:"",
      newTime:"",
      newRecurring:"None",
      newColor:"#000000",
      newStartDate:"",
      newEndDate:"",
      newDates:[],
      newDate:""

    };
    this.openCreateModal = this.openCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.onChangeRecurring = this.onChangeRecurring.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.addDate = this.addDate.bind(this);

    this.submitActivity = this.submitActivity.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  openCreateModal() {
    this.setState({modalActive : true})
  }

  closeCreateModal() {
    this.setState({modalActive : false})
  }

  submitActivity() {
    const activ = {
      title:this.state.newName,
      description:this.state.newDescription,
      time:this.state.newTime,
      dayOfWeek:this.state.newRecurring,
      style:{backgroundColor:this.state.newColor},
      startDate: this.state.newStartDate,
      endDate: this.state.newEndDate,
      days:this.state.newDates
    };

    post("/api/activity", activ).then((activity) => {
      this.setState({
        activities: this.state.activities.concat([activity]),
      });
    });

    this.closeCreateModal();
  }

  handleDelete(id) {
    const ObjectId = mongoose.Types.ObjectId;
    get("/api/activity/delete",{_id:  ObjectId(id)}).then((activities) => {
      var newArray = this.state.activities.filter(function (el) {
        return el._id.toString() !== id;
      });
      this.setState({activities:newArray});
    });
    
  }

  onChangeName(event) {
    this.setState({newName: event.target.value});
  }

  onChangeDescription(event) {
    this.setState({newDescription: event.target.value});
  }

  onChangeTime(event) {
    this.setState({newTime: event.target.value});
  }

  onChangeRecurring(event) {
    this.setState({newRecurring: event.target.value});
  }

  onChangeColor(event) {
    this.setState({newColor: event.target.value});
  }

  onChangeStartDate(event) {
    console.log(event.target.value)
    this.setState({newStartDate: event.target.value});
  }

  onChangeEndDate(event) {
    this.setState({newEndDate: event.target.value});
  }

  onChangeDate(event) {
    this.setState({newDate: event.target.value});
  }
  
  addDate() {
    console.log("Adding"+this.state.newDate)
    this.setState({
      newDates: this.state.newDates.concat([this.state.newDate]),
    });
  }



 componentDidMount() {
    get("/api/activities").then((activs) => {
      this.setState({
        activities: activs,
      });
    });
 }

 onHover = (event) => {
  this.setState({active_selection:event.currentTarget.getAttribute("name")})
 }

 onActivityClick = (event) => {
  this.setState({clicked_selection:event.currentTarget.getAttribute("name")})
 }

 endHover = () => {
 this.setState({active_selection:undefined})
}

activeSelection = (title) => {
  return this.state.active_selection
  
}


  render() {
    let activitiesPanels;
    activitiesPanels = this.state.activities.map((activ) => {
      let style;
      if (this.activeSelection() == activ.title) style = activ.style
      let mod = this.props.userStatus == "Moderator";
      return (
      <div className="Activities-indivContainer"  key={`${activ.title}`}>
          {mod ? 
          <div className="Icon-wrapper" onClick={() => this.handleDelete(activ._id)}>    
            <span className="Icon-tooltip">Delete</span>
            <i className="fa fa-trash"></i>
          </div>
          : null}
          <div className="Activities-indivPanel" 
          name={activ.title}
          style={style}
          onMouseOver={this.onHover} 
          onMouseOut={this.endHover}
          onClick={this.onActivityClick}>
            <div className="Activities-indivTitle">{activ.title}</div>
            <div className="Activities-indivDescription">{activ.description}</div>
            <div className="Activities-indivDay">{activ.dayOfWeek=="None" ? undefined : activ.dayOfWeek} {activ.time}</div>
          </div>
        </div>)
      
       
    })

  let createActivity;
  if (this.props.userStatus == "Moderator") {
    createActivity = <div className="Activities-createActivity" onClick={this.openCreateModal}>Create Activity</div>
  }
  var buttonClass = "Activities-submitButton"

  var recurringDates;
  if (this.state.newRecurring != "None") {
    recurringDates=<><div className="Activities-modalRow"> 
                      <label>
                      Recurring From:
                      </label>
                      <input className="Activities-inputBox"type="date" value={this.state.newStartDate} onChange={this.onChangeStartDate}/>
                    </div><div className="Activities-modalRow"> 
                  <label>
                  Recurring Until:
                  </label>
                  <input className="Activities-inputBox"type="date" value={this.state.newEndDate} onChange={this.onChangeEndDate}/>
                </div>
                </>
  }

  var newDateList = this.state.newDates.map((date) => (<div>{date}</div>))

    return (
      <>
      <div className={this.state.modalActive ? "Activities-modal" : "Activities-modalHidden"}>
            <div className="Activities-modalContent">
                <div className="Activities-closeButton" onClick={this.closeCreateModal}>X</div>
                <form className="Activities-modalForm">
                <div className="Activities-modalRow"> 
                  <label>
                  Name:
                  </label>
                  <input className="Activities-inputBox" type="text" value={this.state.newName} onChange={this.onChangeName}/>
                </div>
                <div className="Activities-modalRow"> 
                  <label>
                  Description:
                  </label>
                  <input className="Activities-inputBox"type="text" value={this.state.newDescription} onChange={this.onChangeDescription}/>
                </div>
                <div className="Activities-modalRow"> 
                  <label>
                  Time:
                  </label>
                  <input className="Activities-inputBox"type="text" value={this.state.newTime} onChange={this.onChangeTime}/>
                </div>
                <div className="Activities-modalRow"> 
                  <label>
                  Date:
                  </label>
                  <input className="Activities-inputBox"type="date" value={this.state.newDate} onChange={this.onChangeDate}/>
                  <span className="Activities-addDateButton" onClick={this.addDate}>Add</span>
                </div>
               {newDateList}
                
                <div className="Activities-modalRow">
                  <label>
                    Recurring day:
                    <select className="Activities-selectBox" value={this.state.newRecurring} onChange={this.onChangeRecurring}>
                      <option value="None">None</option>
                      <option value="Mon">Mon</option>
                      <option value="Tue">Tue</option>
                      <option value="Wed">Wed</option>
                      <option value="Thu">Thu</option>
                      <option value="Fri">Fri</option>
                      <option value="Sat">Sat</option>
                      <option value="Sun">Sun</option>
                    </select>
                  </label>
                </div>
                {recurringDates}
                <div className="Activities-modalRow"> 
                  <label>Color</label>
                  <input type="color" value={this.state.newColor} onChange={this.onChangeColor}/>
                </div>

                    <span className={buttonClass} onClick={this.submitActivity}>Submit</span>
                  </form>
                
            </div>
      </div>

      <div className="Activities-mainContainer">
        {createActivity}
        <div className="Activities-title">Activities</div>
        <div className="Activities-horizontalContainer">
          <div className="Activities-list">
            {activitiesPanels}


          </div>
          <Calendar filters={this.state.activities} active_selection={this.activeSelection()}/>
        </div>
      </div>

      
      </>
    );
  }
}

export default Activities;
