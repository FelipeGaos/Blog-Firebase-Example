/**
 * Created by raul on 9/11/16.
 */

import React, { Component } from 'react';
import { Helpers } from '../../Helpers/helpers'
import AlertMessage from '../../components/Alert/AlertMessage'
import './create_post.css';

class CreatePost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            content: "",
            alertMessage: "",
            alertType: "danger",
            visible: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handlePostBodyChange = this.handlePostBodyChange.bind(this);
        this.writeNewPost = this.writeNewPost.bind(this);
        this.writeNewPostSuccessCb = this.writeNewPostSuccessCb.bind(this);
        this.showAlertMessage = this.showAlertMessage.bind(this);
    }

    showAlertMessage = (msg, type, time) => {
        this.setState({ alertMessage: msg });
        this.setState({ alertType: type });
        this.setState({ visible: true });
        setTimeout(() => {
            this.setState({ visible: false });
        }, time);
    };

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }

    handlePostBodyChange(e) {
        this.setState({content: e.target.value});
    }

    writeNewPostSuccessCb() {
        this.showAlertMessage("Your post was created successfully!", "success", 2500);
        this.setState({title: ""});
        this.setState({content: ""});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (Helpers.hasEmptyFields(this.state.title, this.state.content)) {
            this.showAlertMessage("There are empty fields!", "danger", 2500);
            return;
        }
        var user = firebase.auth().currentUser;
        this.writeNewPost(user.uid, user.email, this.state.title, this.state.content).then(this.writeNewPostSuccessCb,
            (error) => {
                this.showAlertMessage(error.message, "danger", 3000);
            });
    }

    writeNewPost(uid, username, title, content) {
        // A post entry.
        var postData = {
            title: title,
            content: content,
            username: username,
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

    render() {
        return (
            <div>
                <AlertMessage type={this.state.alertType} message={this.state.alertMessage} visible={this.state.visible} />

                <form className="form-newpost" onSubmit={this.handleSubmit}>
                    <h2 className="form-signin-heading">Crear Nuevo blog post</h2>
                    <label className="sr-only">Titulo</label>
                    <input type="text" className="form-control" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />

                    <textarea placeholder="Escribe aqui tu blog post" className="form-control" rows="10"
                              value={this.state.content} onChange={this.handlePostBodyChange}/>

                    <button className="btn btn-lg btn-primary" type="submit">Crear Post</button>
                </form>
            </div>
        );
    }
}

export default CreatePost;