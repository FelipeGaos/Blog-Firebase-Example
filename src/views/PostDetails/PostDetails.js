/**
 * Created by raul on 9/12/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import './post_details.css';

class PostDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            post: {},
            numComments: 0,
            comments: [],
            newComment: "",
            hasComments: false
        };

        this.getPostDataCb = this.getPostDataCb.bind(this);
        this.parsePostDate = this.parsePostDate.bind(this);
        this.handleClickEditPost = this.handleClickEditPost.bind(this);
        this.handleClickDeletePost = this.handleClickDeletePost.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.buildListOfComments = this.buildListOfComments.bind(this);
        this.getCommentsDataCb = this.getCommentsDataCb.bind(this);
        this.createNewComment = this.createNewComment.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addCommentElement = this.addCommentElement.bind(this);
        this.comment_addedCb = this.comment_addedCb.bind(this);
    }

    componentDidMount = function() {
        var postId = this.props.params.postId;
        firebase.database().ref('/posts/' + postId).once('value').then(this.getPostDataCb);
    };

    getPostDataCb(data) {
        this.setState({post: data.val()});
        var postId = this.props.params.postId;
        //firebase.database().ref('/post-comments/' + postId).once('value').then(this.getCommentsDataCb);

        var commentsRef = firebase.database().ref('post-comments/' + postId);

        commentsRef.on('child_added', this.comment_addedCb);

        commentsRef.on('child_changed', function(data) {
            //setCommentValues(postElement, data.key, data.val().text, data.val().author);
        });

        commentsRef.on('child_removed', function(data) {
            //deleteComment(postElement, data.key);
        });
    }

    comment_addedCb(data) {
        this.addCommentElement(data);
    }

    addCommentElement(data) {
        var c = this.state.comments;
        c[data.key] = data.val();
        this.buildListOfComments(c);
    }

    getCommentsDataCb(data) {
        this.buildListOfComments(data.val());
    }

    parsePostDate() {
        var dateObj = new Date(this.state.post.datetime);
        var convertedDate = dateObj.toDateString().split(" ");
        return convertedDate[1] + " " + convertedDate[2] + ", " + convertedDate[3];
    }

    handleCommentChange(e) {
        this.setState({newComment: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.newComment) {
            console.log("Your comment cannot be empty!");
            return;
        }
        var user = firebase.auth().currentUser;
        this.createNewComment(this.state.newComment, user.email).then(function() {
            console.log("success");
            //todo: clear form fields
        }, function(error) {
            console.log(error);
        });
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

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/comments/' + newCommentKey] = commentData;
        updates['/post-comments/' + postId + '/' + newCommentKey] = commentData;

        return firebase.database().ref().update(updates);
    }

    removePost() {
        var user = firebase.auth().currentUser;

        // Remove the current post from both the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + this.props.params.postId] = null;
        updates['/user-posts/' + user.uid + '/' + this.props.params.postId] = null;

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
                                <b>{comments[k].username}</b> - <span className="comment-date">{this.parsePostDate(comments[k].datetime)}</span>
                            </p>
                            <p className="comment-body">{comments[k].content}</p>
                        </div>
                    );
                }
            }
            this.setState({hasComments: true});
            this.setState({comments: tempComments});
        }
    }

    render() {
        return (
            <div className="posts-section">
                <div className="actions-container">
                    <a onClick={this.handleClickEditPost}>Edit</a>
                    <a onClick={this.handleClickDeletePost}>Delete</a>
                </div>
                <h2>{this.state.post.title}</h2>
                <p>{this.state.post.content}</p>
                <p className="post-author">
                    <b>{this.state.post.username}</b> wrote this on {this.parsePostDate()}
                </p>

                <div className="comments-section">
                    <p className="num-comments-title">{this.state.numComments} Comments</p>

                    <form className="form-newcomment" onSubmit={this.handleSubmit}>
                        <textarea placeholder="Write your comment here" className="form-control" rows="2" onChange={this.handleCommentChange} />

                        <button className="btn btn-lg btn-primary add-comment-btn" type="submit">Publish Comment</button>
                    </form>

                    <div>
                        {this.state.hasComments ?
                            this.state.comments : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default PostDetails;