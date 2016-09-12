/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import './home.css';

class Home extends Component {

    constructor (props) {
        super(props);

        this.callBackAuthState = this.callBackAuthState.bind(this);
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

    componentDidMount = function() {
        firebase.auth().onAuthStateChanged(this.callBackAuthState);
    };

    render() {
        return (
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
            </p>
        );
    }
}

export default Home;