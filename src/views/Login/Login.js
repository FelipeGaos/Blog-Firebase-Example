/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import './login.css';

class Login extends Component {
    constructor (props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
        this.isValidEmail = this.isValidEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.signInSuccessCb = this.signInSuccessCb.bind(this);
        this.signInErrorCb = this.signInErrorCb.bind(this);
        this.callBackAuthState = this.callBackAuthState.bind(this);
    }

    callBackAuthState(user) {
        if (user) {
            hashHistory.push('/');
        }
    }

    componentDidMount = function() {
        firebase.auth().onAuthStateChanged(this.callBackAuthState);
    };

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
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
        if (!this.isValidEmail()) {
            console.log("Invalid email");
            return;
        }
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(this.signInSuccessCb, this.signInErrorCb);
    }
    isValidEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.state.email);
    }
    render() {
        return (
            <form className="form-signin" onSubmit={this.handleSubmit}>
                <h2 className="form-signin-heading">Please sign in</h2>
                <label className="sr-only">Email</label>
                <input type="email" className="form-control" placeholder="Email" onChange={this.handleEmailChange} />
                <label className="sr-only">Password</label>
                <input type="password" className="form-control" placeholder="Password" onChange={this.handlePasswordChange} />

                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign In</button>
            </form>
        );
    }
}

export default Login;