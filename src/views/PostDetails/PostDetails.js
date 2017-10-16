/**
 * Created by raul on 9/12/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import AlertMessage from '../../components/Alert/AlertMessage'
import { Comment } from '../../components/Comment/Comment'
import './post_details.css';

class PostDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userEmail: "",
            post: {},
            numComments: 0,
            comments: [],
            newComment: "",
            hasComments: false,
            editCommentMode: false,
            commentToEdit: {id: null, content: ""},
            alertMessage: "",
            alertType: "danger",
            visible: false
        };

        this.getPostDataCb = this.getPostDataCb.bind(this);
        this.handleClickEditPost = this.handleClickEditPost.bind(this);
        this.handleClickDeletePost = this.handleClickDeletePost.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.buildListOfComments = this.buildListOfComments.bind(this);
        this.createNewComment = this.createNewComment.bind(this);
        this.handleSubmitNewComment = this.handleSubmitNewComment.bind(this);
        this.handleClickEditComment = this.handleClickEditComment.bind(this);
        this.handleClickDeleteComment = this.handleClickDeleteComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.handleCancelEditComment = this.handleCancelEditComment.bind(this);
        this.handleSubmitEditComment = this.handleSubmitEditComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.handleEditCommentChange = this.handleEditCommentChange.bind(this);
        this.commentsSection = this.commentsSection.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({isAuthenticated: user ? true : false});
        });

        var postId = this.props.params.postId;
        firebase.database().ref('/posts/' + postId).once('value').then(this.getPostDataCb);
    };

    showAlertMessage = (msg, type, time) => {
        this.setState({ alertMessage: msg });
        this.setState({ alertType: type });
        this.setState({ visible: true });
        setTimeout(() => {
            this.setState({ visible: false });
        }, time);
    };

    /* Post functions */

    getPostDataCb(data) {
        var user = firebase.auth().currentUser;
        var postId = this.props.params.postId;

        this.setState({post: data.val()});
        this.setState({userEmail: user ? user.email : ""});

        var commentsRef = firebase.database().ref('post-comments/' + postId);
        commentsRef.on('value', (data) => {
            this.buildListOfComments(data.val());
        });
    }

    handleClickEditPost() {
        hashHistory.push('/posts/edit/' + this.props.params.postId);
    }

    handleClickDeletePost() {
        var ans = confirm("Are you sure you want to delete this post?");
        if (ans) {
            this.removePost().then(() => {
                hashHistory.push('/');
            }, (error) => {
                this.showAlertMessage(error.message, "danger", 2500);
            });
        }
    }

    removePost() {
        var user = firebase.auth().currentUser;

        // Remove the current post from both the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + this.props.params.postId] = null;
        updates['/user-posts/' + user.uid + '/' + this.props.params.postId] = null;
        updates['/post-comments/' + this.props.params.postId] = null;

        return firebase.database().ref().update(updates);
    }

    /* Comments functions */

    handleSubmitEditComment() {
        this.updateComment(this.state.commentToEdit.content, this.state.userEmail, this.state.commentToEdit.id).then(() => {
            this.showAlertMessage("Comment updated successfully", "success", 2500);
            this.handleCancelEditComment();
        }, (error) => {
            this.showAlertMessage(error.message, "danger", 2500);
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
            this.showAlertMessage("Your comment cannot be empty!", "danger", 2500);
            return;
        }
        var user = firebase.auth().currentUser;
        if (user) {
            this.createNewComment(this.state.newComment, user.email).then(() => {
                this.setState({newComment: ""});
            }, (error) => {
                this.showAlertMessage(error.message, "danger", 2500);
            });
        }
        else {
            this.showAlertMessage("You have to sign up first", "danger", 2500);
        }
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
                this.showAlertMessage("Comment deleted successfully", "success", 2500);
            }, (error) => {
                this.showAlertMessage(error.message, "danger", 2500);
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
                        <Comment
                            key={k}
                            k={k}
                            content={comments[k].content}
                            username={comments[k].username}
                            userEmail={this.state.userEmail}
                            datetime={comments[k].datetime}
                            onClickEdit={this.handleClickEditComment}
                            onClickDelete={this.handleClickDeleteComment}
                        />
                    );
                }
            }
            this.setState({hasComments: true});
            this.setState({comments: tempComments});
            this.setState({numComments: tempComments.length});
        }
        else {
            this.setState({hasComments: false});
            this.setState({comments: tempComments});
            this.setState({numComments: tempComments.length});
        }
    }

    commentsSection() {
        return (
            <div>
                {this.state.isAuthenticated ?
                    <div>
                        <p className="num-comments-title">{this.state.numComments} Comments</p>
                        <form className="form-newcomment" onSubmit={this.handleSubmitNewComment}>
                            <textarea placeholder="Escribe un comentario" className="form-control" rows="2" value={this.state.newComment}
                              onChange={this.handleCommentChange}/>
                            <button className="btn btn-lg btn-primary add-comment-btn" type="submit">Publicar Comentario</button>
                        </form>
                    </div> : null
                }
                {this.state.comments}
            </div>
        );
    }

    render() {
        return (
            <div className="posts-section">
                {this.state.post.username === this.state.userEmail ?
                    <div className="actions-container">
                        <a onClick={this.handleClickEditPost}>Editar Post</a>
                        <a onClick={this.handleClickDeletePost}>Borrar Post</a>
                    </div> : null
                }

                <h2>{this.state.post.title}</h2>
                <p>{this.state.post.content}</p>
                <p className="post-details-author">
                    <b>{this.state.post.username}</b> Publicado   
                      en  {Helpers.convertDateToString(this.state.post.datetime)}
                </p>

                <div className="comments-section">
                    <AlertMessage type={this.state.alertType} message={this.state.alertMessage} visible={this.state.visible} />
                    <div>
                        {this.state.hasComments ?
                            this.state.editCommentMode ?
                                <div>
                                    <p className="edit-comment-title">Editar comentario</p>
                                    <form className="form-newcomment" onSubmit={this.handleSubmitEditComment}>
                                        <textarea className="form-control" rows="4"
                                                  value={this.state.commentToEdit.content}
                                                  onChange={this.handleEditCommentChange}/>

                                        <button className="edit-comment-btn" type="submit">Guardar</button>
                                        <button className="edit-comment-btn" onClick={this.handleCancelEditComment}>
                                            Cancelar
                                        </button>
                                    </form>
                                </div>
                                :
                                this.commentsSection()
                            : this.commentsSection()
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default PostDetails;