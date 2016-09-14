/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import './home.css';

class Home extends Component {

    constructor (props) {
        super(props);

        this.state = {
            posts: []
        };

        this.callBackAuthState = this.callBackAuthState.bind(this);
        this.buildListOfPosts = this.buildListOfPosts.bind(this);
        this.onValueChangeListener = this.onValueChangeListener.bind(this);
        this.openFullPost = this.openFullPost.bind(this);
    }

    callBackAuthState(user) {
        if (user) {
            // User is signed in.
            console.log("user is sign in");
        } else {
            // No user is signed in.
            console.log("user is not sign in");
        }
    }

    openFullPost(e) {
        var postId = e.target.getAttribute("value");
        hashHistory.push('/posts/' + postId);
    }

    onValueChangeListener(data) {
        this.buildListOfPosts(data.val());
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.callBackAuthState);

        var recentPostsRef = firebase.database().ref('/posts/').limitToLast(100);
        recentPostsRef.on('value', this.onValueChangeListener);



        // commentsRef.on('child_added', function(data) {
        //     addCommentElement(postElement, data.key, data.val().text, data.val().author);
        // });
        //
        // commentsRef.on('child_changed', function(data) {
        //     setCommentValues(postElement, data.key, data.val().text, data.val().author);
        // });
        //
        // commentsRef.on('child_removed', function(data) {
        //     deleteComment(postElement, data.key);
        // });
    };

    buildListOfPosts(posts) {
        var tempPosts = [];
        for (var k in posts) {
            if (posts.hasOwnProperty(k)) {
                tempPosts.push(
                    <div key={k}>
                        <h2>{posts[k].title}</h2>
                        <p>{Helpers.createPostSummary(posts[k].content)}</p>
                        <p className="post-author">
                            <b>{posts[k].username}</b> wrote this on {Helpers.convertDateToString(posts[k].datetime)}
                            <a className="read-more" value={k} onClick={this.openFullPost}>Read more</a>
                        </p>
                    </div>
                );
            }
        }
        this.setState({posts: tempPosts});
    }

    render() {
        return (
            <div className="posts-section">
                {this.state.posts}
            </div>
        );
    }
}

export default Home;