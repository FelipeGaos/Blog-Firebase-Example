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

        this.buildListOfPosts = this.buildListOfPosts.bind(this);
        this.openFullPost = this.openFullPost.bind(this);
    }

    componentDidMount = () => {
        var recentPostsRef = firebase.database().ref('/posts/').limitToLast(10);
        recentPostsRef.on('value', (data) => {
            this.buildListOfPosts(data.val());
        });
    };

    openFullPost = (e) => {
        var postId = e.target.getAttribute("value");
        hashHistory.push('/posts/' + postId);
    };

    buildListOfPosts = (posts) => {
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
        tempPosts.reverse();
        this.setState({posts: tempPosts});
    };

    render() {
        return (
            <div className="posts-section">
                {this.state.posts}
            </div>
        );
    }
}

export default Home;