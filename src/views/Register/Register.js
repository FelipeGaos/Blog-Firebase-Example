/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import './register.css';

class Register extends Component {
    constructor (props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            repeatPass: ''
        };
        this.isValidEmail = this.isValidEmail.bind(this);
        this.passwordsMatch = this.passwordsMatch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.callBackAuthState = this.callBackAuthState.bind(this);
        this.signUpSuccessCb = this.signUpSuccessCb.bind(this);
        this.signUpErrorCb = this.signUpErrorCb.bind(this);
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

    handleRepeatPasswordChange(e) {
        this.setState({repeatPass: e.target.value});
    }

    signUpSuccessCb(response) {
        hashHistory.push('/');
    }

    signUpErrorCb(error) {
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
        if (!this.passwordsMatch()) {
            console.log("Passwords don't match!");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(this.signUpSuccessCb, this.signUpErrorCb);
    }
    passwordsMatch() {
        return this.state.password === this.state.repeatPass;
    }
    isValidEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.state.email);
    }
    render() {
        return (
            <form className="form-signup" onSubmit={this.handleSubmit}>
                <h2 className="form-signin-heading">Please sign up</h2>
                <label className="sr-only">Email</label>
                <input type="email" className="form-control" placeholder="Email" onChange={this.handleEmailChange} />
                <label className="sr-only">Password</label>
                <input type="password" className="form-control" placeholder="Password" onChange={this.handlePasswordChange} />
                <label className="sr-only">Repeat Password</label>
                <input type="password" className="form-control" placeholder="Repeat Password" onChange={this.handleRepeatPasswordChange} />

                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
            </form>
        );
    }
}

export default Register;