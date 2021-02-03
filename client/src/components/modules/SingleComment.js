import React, { Component } from "react";
import "./CommentsArea.css";

/**
 * Component to render a single comment
 *
 * Proptypes
 * @param {string} _id of comment
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the comment
 */
class SingleComment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="CommentsArea-comment">
        <div className="Comment-name">{this.props.creator_name}</div>
        <div className="Comment-content">{this.props.content}</div>

      </div>
    );
  }
}

export default SingleComment;

