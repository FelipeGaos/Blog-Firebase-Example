/**
 * Created by raul on 9/13/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import AlertMessage from '../../components/Alert/AlertMessage'
import './edit_post.css';

class EditPost extends Component {
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
        this.updatePost = this.updatePost.bind(this);
        this.getPostDataCb = this.getPostDataCb.bind(this);
        this.showAlertMessage = this.showAlertMessage.bind(this);
    }

    componentDidMount = () => {
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

    getPostDataCb = (data) => {
        var post = data.val();
        this.setState({title: post.title});
        this.setState({content: post.content});
    };

    handleTitleChange = (e) => {
        this.setState({title: e.target.value});
    };

    handlePostBodyChange = (e) => {
        this.setState({content: e.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (Helpers.hasEmptyFields(this.state.title, this.state.content)) {
            this.showAlertMessage("There are empty fields!", "danger", 2500);
            return;
        }
        var user = firebase.auth().currentUser;
        this.updatePost(user.uid, user.email, this.state.title, this.state.content).then(() => {
            hashHistory.push('/posts/' + this.props.params.postId);
        }, (error) => {
            this.showAlertMessage(error.message, "danger", 3000);
        });
    };

    updatePost = (uid, username, title, content) => {
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
    };

    render() {
        return (
            <div>
                <AlertMessage type={this.state.alertType} message={this.state.alertMessage} visible={this.state.visible} />

                <form className="form-newpost" onSubmit={this.handleSubmit}>
                    <h2 className="form-signin-heading">Modificar blog post</h2>
                    <label className="sr-only">Titulo</label>
                    <input type="text" className="form-control" value={this.state.title} onChange={this.handleTitleChange} />
                    <textarea className="form-control" rows="10" value={this.state.content} onChange={this.handlePostBodyChange} />
                    <button className="btn btn-lg btn-primary" type="submit">Actualizar Post</button>
                </form>
            </div>
        );
    }
}

export default EditPost;