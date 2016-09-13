/**
 * Created by raul on 9/12/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import './post_details.css';

class PostDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            post: {},
            numComments: 0,
            comments: [],
            newComment: "",
            hasComments: false,
            editCommentMode: false,
            commentToEdit: {id: null, content: ""}
        };

        this.getPostDataCb = this.getPostDataCb.bind(this);
        this.handleClickEditPost = this.handleClickEditPost.bind(this);
        this.handleClickDeletePost = this.handleClickDeletePost.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.buildListOfComments = this.buildListOfComments.bind(this);
        this.getCommentsDataCb = this.getCommentsDataCb.bind(this);
        this.createNewComment = this.createNewComment.bind(this);
        this.handleSubmitNewComment = this.handleSubmitNewComment.bind(this);
        this.handleClickEditComment = this.handleClickEditComment.bind(this);
        this.handleClickDeleteComment = this.handleClickDeleteComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.handleCancelEditComment = this.handleCancelEditComment.bind(this);
        this.handleSubmitEditComment = this.handleSubmitEditComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.handleEditCommentChange = this.handleEditCommentChange.bind(this);
    }

    componentDidMount = () => {
        var postId = this.props.params.postId;
        firebase.database().ref('/posts/' + postId).once('value').then(this.getPostDataCb);
    };

    /* Post functions */

    getPostDataCb(data) {
        this.setState({post: data.val()});
        var postId = this.props.params.postId;
        var commentsRef = firebase.database().ref('post-comments/' + postId);
        commentsRef.on('value', this.getCommentsDataCb);
    }

    handleClickEditPost() {

    }

    handleClickDeletePost() {
        var ans = confirm("Are you sure you want to delete this post?");
        if (ans) {
            this.removePost().then(() => {
                hashHistory.push('/');
            }, (error) => {
                console.log(error);
            });
        }
    }

    removePost() {
        var user = firebase.auth().currentUser;

        // Remove the current post from both the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + this.props.params.postId] = null;
        updates['/user-posts/' + user.uid + '/' + this.props.params.postId] = null;

        return firebase.database().ref().update(updates);
    }

    /* Comments functions */

    getCommentsDataCb(data) {
        this.buildListOfComments(data.val());
    }

    handleSubmitEditComment() {
        var user = firebase.auth().currentUser;
        this.updateComment(this.state.commentToEdit.content, user.email, this.state.commentToEdit.id).then(() => {
            this.handleCancelEditComment();
        }, (error) => {
            console.log(error);
        });
    }

    handleCancelEditComment() {
        var commentId = this.state.commentToEdit.id;
        this.setState({commentToEdit: {id: commentId, content: ""}});
        this.setState({editCommentMode: false});
    }

    handleEditCommentChange(e) {
        var commentId = this.state.commentToEdit.id;
        this.setState({commentToEdit: {id: commentId, content: e.target.value}});
    }

    handleCommentChange(e) {
        this.setState({newComment: e.target.value});
    }

    handleSubmitNewComment(e) {
        e.preventDefault();
        if (!this.state.newComment) {
            console.log("Your comment cannot be empty!");
            return;
        }
        var user = firebase.auth().currentUser;
        this.createNewComment(this.state.newComment, user.email).then(() => {
            this.setState({newComment: ""});
        }, (error) => {
            console.log(error);
        });
    }

    handleClickEditComment(e) {
        this.setState({commentToEdit: {id: e.target.getAttribute("name"), content: e.target.getAttribute("value")}});
        this.setState({editCommentMode: true});
    }

    handleClickDeleteComment(e) {
        var ans = confirm("Are you sure you want to delete this comment?");
        var commentId = e.target.getAttribute("value");
        if (ans) {
            this.removeComment(commentId).then(() => {
                console.log("comment deleted");
            }, (error) => {
                console.log(error);
            });
        }
    }

    createNewComment(content, username) {
        var postId = this.props.params.postId;
        // A comment entry.
        var commentData = {
            post_id: postId,
            content: content,
            username: username,
            datetime: (new Date()).toJSON()
        };

        // Get a key for a new Post.
        var newCommentKey = firebase.database().ref().child('comments').push().key;

        // Write the new comment in the comments list and the post's post list.
        var updates = {};
        updates['/comments/' + newCommentKey] = commentData;
        updates['/post-comments/' + postId + '/' + newCommentKey] = commentData;

        return firebase.database().ref().update(updates);
    }

    updateComment(content, username, commentId) {
        var postId = this.props.params.postId;
        // A comment entry.
        var commentData = {
            post_id: postId,
            content: content,
            username: username,
            datetime: (new Date()).toJSON()
        };

        // Write the updated comment in the comments list and the post's post list.
        var updates = {};
        updates['/comments/' + commentId] = commentData;
        updates['/post-comments/' + postId + '/' + commentId] = commentData;

        return firebase.database().ref().update(updates);
    }

    removeComment(commentId) {
        // Remove the current post from both the posts list and the user's post list.
        var updates = {};
        updates['/comments/' + commentId] = null;
        updates['/post-comments/' + this.props.params.postId + '/' + commentId] = null;

        return firebase.database().ref().update(updates);
    }

    buildListOfComments(comments) {
        var tempComments = [];
        if (comments) {
            for (var k in comments) {
                if (comments.hasOwnProperty(k)) {
                    tempComments.push(
                        <div key={k}>
                            <p className="comment-author">
                                <b>{comments[k].username}</b> - <span
                                className="comment-date">{Helpers.convertDateToLongString(comments[k].datetime)}</span>
                            </p>
                            <div>
                                <p className="comment-body">{comments[k].content}</p>
                                <div className="actions-comment-box">
                                    <a value={comments[k].content} name={k}
                                       onClick={this.handleClickEditComment}>Edit</a>
                                    <a value={k} onClick={this.handleClickDeleteComment}>Delete</a>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
            this.setState({hasComments: true});
            this.setState({comments: tempComments});
            this.setState({numComments: tempComments.length});
        }
    }

    render() {
        return (
            <div className="posts-section">
                <div className="actions-container">
                    <a onClick={this.handleClickEditPost}>Edit Post</a>
                    <a onClick={this.handleClickDeletePost}>Delete Post</a>
                </div>
                <h2>{this.state.post.title}</h2>
                <p>{this.state.post.content}</p>
                <p className="post-details-author">
                    <b>{this.state.post.username}</b> wrote this
                    on {Helpers.convertDateToString(this.state.post.datetime)}
                </p>

                <div className="comments-section">
                    <div>
                        {this.state.hasComments ?
                            this.state.editCommentMode ?
                                <div>
                                    <p className="edit-comment-title">Edit comment</p>
                                    <form className="form-newcomment" onSubmit={this.handleSubmitEditComment}>
                                        <textarea className="form-control" rows="4"
                                                  value={this.state.commentToEdit.content}
                                                  onChange={this.handleEditCommentChange}/>

                                        <button className="edit-comment-btn" type="submit">Save</button>
                                        <button className="edit-comment-btn" onClick={this.handleCancelEditComment}>
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                                :
                                <div>
                                    <p className="num-comments-title">{this.state.numComments} Comments</p>

                                    <form className="form-newcomment" onSubmit={this.handleSubmitNewComment}>
                                        <textarea placeholder="Write your comment here" className="form-control"
                                                  rows="2" value={this.state.newComment}
                                                  onChange={this.handleCommentChange}/>

                                        <button className="btn btn-lg btn-primary add-comment-btn" type="submit">Publish
                                            Comment
                                        </button>
                                    </form>

                                    {this.state.comments}
                                </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default PostDetails;