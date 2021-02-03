import React, { Component } from "react";
import "./Activities.css";
import "./CommentsArea.js";
import Calendar from "./Calendar"

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities:[{title:"Family Home Evening",
                    description:"Weekly gatherings",
                    time:"7:00 PM",
                    dayOfWeek:"Thu",
                    color:"rgb(231, 182, 182)"
                  },{title:"Institute",
                  description:"Scripture study",
                  time:"5:00 PM",
                  dayOfWeek:"Tue",
                  color:"rgb(231, 182, 140)"
                  }
                ],
      active_selection:undefined,
      clicked_selection:undefined
    };
  }

 componentDidMount() {
 
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
      if (this.activeSelection() == activ.title) style = {backgroundColor:activ.color}

      return (<div className="Activities-indivPanel" 
      name={activ.title} key={`${activ.title}`} 
      style={style}
      onMouseOver={this.onHover} 
      onMouseOut={this.endHover}
      onClick={this.onActivityClick}>
                <div className="Activities-indivTitle">{activ.title}</div>
                <div className="Activities-indivDescription">{activ.description}</div>
                <div className="Activities-indivDay">{activ.dayOfWeek} {activ.time}</div>
              </div>)
      
       
    })

    return (
      <>
      <div className="Activities-mainContainer">
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
