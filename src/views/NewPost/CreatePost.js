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
        this.signInSuccessCb = this.signInSuccessCb.bind(this);
        this.signInErrorCb = this.signInErrorCb.bind(this);
    }
    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }
    handlePostBodyChange(e) {
        this.setState({body: e.target.value});
    }
    signInSuccessCb(response) {
        console.log(response);
    }
    signInErrorCb(error) {
        switch (error.code) {
            case "auth/user-not-found": {
                console.log("There is no account associated with that email address.");
                break;
            }
            case "auth/wrong-password": {
                console.log("Invalid password, please try again!");
                break;
            }
            default:
                break;
        }
        console.log(error);
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.hasEmptyFields()) {
            console.log("Empty fields");
            return;
        }

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