import React, { Component } from "react";
import "./CommentsArea.css";
import SingleComment from "./SingleComment";
import { get } from "../../utilities";
import { NewComment } from "./NewPostInput.js";


class CommentsArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

  componentDidMount() {
    console.log("Getting comments from " + this.props.date)
    get("/api/comment", { date: this.props.date }).then((comments) => {
      this.setState({
        comments: comments,
      });
    });
  }

  addNewComment = (commentObj) => {
    this.setState({
      comments: this.state.comments.concat([commentObj]),
    });
  };

  render() {
    var commentBlock = null
    if (this.state.comments.length == 0 ) {
      commentBlock = <div className="CommentsArea-comment">
                      <div className="Comment-content">There are no comments to display</div>
                    </div>
    } else {
      commentBlock = this.state.comments.map((comment) => (
                      <SingleComment
                        key={`SingleComment_${comment._id}`}
                        _id={comment._id}
                        creator_name={comment.creator_name}
                        creator_id={comment.creator_id}
                        content={comment.content}
                      />
                    ))
    }
    return (
      <div className="CommentsArea-mainContainer">
        <div className="CommentsArea-allComments">
          {commentBlock}
        </div>
        <div className="CommentsArea-newCommentContainer">
          {this.props.userId && (
            <NewComment date={this.props.date} addNewComment={this.addNewComment} />
            )}
        </div>

        
      </div>
    );
  }
}

export default CommentsArea;
