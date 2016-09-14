/**
 * Created by raul on 9/13/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import './edit_post.css';

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            content: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handlePostBodyChange = this.handlePostBodyChange.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.getPostDataCb = this.getPostDataCb.bind(this);
        this.updatePostSuccessCb = this.updatePostSuccessCb.bind(this);
    }

    componentDidMount = () => {
        var postId = this.props.params.postId;
        firebase.database().ref('/posts/' + postId).once('value').then(this.getPostDataCb);
    };

    getPostDataCb(data) {
        var post = data.val();
        this.setState({title: post.title});
        this.setState({content: post.content});
    }

    updatePostSuccessCb() {
        hashHistory.push('/posts/' + this.props.params.postId);
    }

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }

    handlePostBodyChange(e) {
        this.setState({content: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (Helpers.hasEmptyFields(this.state.title, this.state.content)) {
            console.log("Empty fields");
            return;
        }
        var user = firebase.auth().currentUser;
        this.updatePost(user.uid, user.email, this.state.title, this.state.content).then(this.updatePostSuccessCb, (error) => {
            console.log(error);
        });
    }

    updatePost(uid, username, title, content) {
        var postData = {
            title: title,
            content: content,
            username: username,
            datetime: (new Date()).toJSON()
        };
        var postKey = this.props.params.postId;
        var updates = {};
        updates['/posts/' + postKey] = postData;
        updates['/user-posts/' + uid + '/' + postKey] = postData;

        return firebase.database().ref().update(updates);
    }

    render() {
        return (
            <form className="form-newpost" onSubmit={this.handleSubmit}>
                <h2 className="form-signin-heading">Edit blog post</h2>
                <label className="sr-only">Title</label>
                <input type="text" className="form-control" value={this.state.title} onChange={this.handleTitleChange} />
                <textarea className="form-control" rows="10" value={this.state.content} onChange={this.handlePostBodyChange} />
                <button className="btn btn-lg btn-primary" type="submit">Update Post</button>
            </form>
        );
    }
}

export default EditPost;