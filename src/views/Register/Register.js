/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import './register.css';

class Register extends Component {
    constructor (props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            repeatPass: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.signUpErrorCb = this.signUpErrorCb.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                hashHistory.push('/');
            }
        });
    };

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    };

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
    };

    handleRepeatPasswordChange = (e) => {
        this.setState({repeatPass: e.target.value});
    };

    signUpErrorCb = (error) => {
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
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (Helpers.hasEmptyFields(this.state.email, this.state.password, this.state.repeatPass)) {
            console.log("Empty fields!");
            return;
        }
        if (!Helpers.isValidEmail(this.state.email)) {
            console.log("Invalid email");
            return;
        }
        if (!Helpers.passwordsMatch(this.state.password, this.state.repeatPass)) {
            console.log("Passwords don't match!");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            hashHistory.push('/');
        }, this.signUpErrorCb);
    };

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