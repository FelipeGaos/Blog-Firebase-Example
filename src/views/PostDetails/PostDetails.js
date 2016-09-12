/**
 * Created by raul on 9/12/16.
 */

import React, { Component } from 'react';
import './post_details.css';

class PostDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    componentDidMount = function() {
        var postId = this.props.params.postId;
        return firebase.database().ref('/posts/' + postId).once('value').then(function(data) {
            console.log(data.val());
        });
    };

    render() {
        return (
            <div>This is a the full post</div>
        );
    }
}

export default PostDetails;