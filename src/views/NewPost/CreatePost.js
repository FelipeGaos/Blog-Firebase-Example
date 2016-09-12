/**
 * Created by raul on 9/11/16.
 */

import React, { Component } from 'react';
import './create_post.css';

class CreatePost extends Component {
    constructor (props) {
        super(props);

        this.state = {
            title: '',
            body: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handlePostBodyChange = this.handlePostBodyChange.bind(this);
        this.writeNewPost = this.writeNewPost.bind(this);
    }
    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }
    handlePostBodyChange(e) {
        this.setState({body: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.hasEmptyFields()) {
            console.log("Empty fields");
            return;
        }
        this.writeNewPost(this.state.title, this.state.body);
    }
    writeNewPost(uid, username, title, body) {
        // A post entry.
        var postData = {
            username: username,
            title: title,
            body: body,
            datetime: (new Date()).toJSON()
        };

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('posts').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + newPostKey] = postData;
        updates['/user-posts/' + uid + '/' + newPostKey] = postData;

        return firebase.database().ref().update(updates);
    }
    hasEmptyFields() {
        return !this.state.title || !this.state.body;
    }
    render() {
        return (
            <form className="form-newpost" onSubmit={this.handleSubmit}>
                <h2 className="form-signin-heading">Create a new blog post</h2>
                <label className="sr-only">Title</label>
                <input type="text" className="form-control" placeholder="Title" onChange={this.handleTitleChange} />

                <textarea placeholder="Write here your blog post" className="form-control" rows="10" onChange={this.handlePostBodyChange} />

                <button className="btn btn-lg btn-primary" type="submit">Create Post</button>
            </form>
        );
    }
}

export default CreatePost;