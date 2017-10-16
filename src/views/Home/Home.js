/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import PaginationAdvanced from '../../components/Pagination/Pagination'
import './home.css';

class Home extends Component {

    constructor (props) {
        super(props);

        this.state = {
            posts: [],
            postsAsJSON: {},
            activePage: 1,
            numPages: 1
        };

        this.buildListOfPosts = this.buildListOfPosts.bind(this);
        this.openFullPost = this.openFullPost.bind(this);
        this.handleOnSelectPage = this.handleOnSelectPage.bind(this);
    }

    componentDidMount = () => {
        var recentPostsRef = firebase.database().ref('/posts/');
        recentPostsRef.on('value', (data) => {
            this.setState({postsAsJSON: data.val()});
            this.buildListOfPosts(data.val(), 0, 10);
        });
    };

    openFullPost = (e) => {
        var postId = e.target.getAttribute("value");
        hashHistory.push('/posts/' + postId);
    };

    buildListOfPosts = (posts, from, to) => {
        var tempPosts = [], totalPosts = 0;
        for (var k in posts) {
            if (posts.hasOwnProperty(k)) {
                tempPosts.push(
                    <div key={k}>
                        <h2>{posts[k].title}</h2>
                        <p>{Helpers.createPostSummary(posts[k].content)}</p>
                        <p className="post-author">
                            <b>{posts[k].username}</b> wrote this on {Helpers.convertDateToString(posts[k].datetime)}
                            <a className="read-more" value={k} onClick={this.openFullPost}>Leer Mas</a>
                        </p>
                    </div>
                );
                totalPosts++;
            }
        }
        // Reverse array to display most recent ones first, then take only the portion of data that we need to display
        // (depending on page number)
        tempPosts = tempPosts.reverse().slice(from, to);
        this.setState({numPages: Math.round(totalPosts / 10)});
        this.setState({posts: tempPosts});
    };

    handleOnSelectPage = (eventKey) => {
        this.setState({ activePage: eventKey });
        // NOTE: there's a way to optimize pagination to load from Firebase only the amount of data we want to display (10 posts per page)
        // instead of getting the whole list of posts, by creating a better data structure where we could use startAt() and endAt() methods.
        this.buildListOfPosts(this.state.postsAsJSON, eventKey * 10 - 10, eventKey * 10);
    };

    render() {
        return (
            <div className="posts-section">
                {this.state.posts}
                <PaginationAdvanced items={this.state.numPages} activePage={this.state.activePage} onSelect={this.handleOnSelectPage} />
            </div>
        );
    }
}

export default Home;