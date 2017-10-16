/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import AlertMessage from '../../components/Alert/AlertMessage'
import './login.css';

class Login extends Component {
    constructor (props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            alertMessage: "",
            alertType: "danger",
            visible: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.signInErrorCb = this.signInErrorCb.bind(this);
        this.showAlertMessage = this.showAlertMessage.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                hashHistory.push('/');
            }
        });
    };

    showAlertMessage = (msg, time) => {
        this.setState({ alertMessage: msg });
        this.setState({ visible: true });
        setTimeout(() => {
            this.setState({ visible: false });
        }, time);
    };

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    };

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
    };

    signInErrorCb = (error) => {
        switch (error.code) {
            case "auth/user-not-found": {
                this.showAlertMessage("There is no account associated with that email address.", 2500);
                break;
            }
            case "auth/wrong-password": {
                this.showAlertMessage("Invalid password, please try again!", 2500);
                break;
            }
            default:
                this.showAlertMessage(error.message, 2500);
                break;
        }
    };

    handleSubmit(e) {
        e.preventDefault();
        if (Helpers.hasEmptyFields(this.state.email, this.state.password)) {
            this.showAlertMessage("There are empty fields!", 2500);
            return;
        }
        if (!Helpers.isValidEmail(this.state.email)) {
            this.showAlertMessage("Invalid email address!", 2500);
            return;
        }
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            hashHistory.push('/');
        }, this.signInErrorCb);
    }

    render() {
        return (
            <div>
                <AlertMessage type={this.state.alertType} message={this.state.alertMessage} visible={this.state.visible} />

                <form className="form-signin" onSubmit={this.handleSubmit}>
                    <h2 className="form-signin-heading">Inicia Sesion</h2>
                    <label className="sr-only">Email</label>
                    <input type="email" className="form-control" placeholder="Email" onChange={this.handleEmailChange} />
                    <label className="sr-only">Contraseña</label>
                    <input type="password" className="form-control" placeholder="Password" onChange={this.handlePasswordChange} />

                    <button className="btn btn-lg btn-primary btn-block" type="submit">Iniciar Sesion</button>
                </form>
            </div>
        );
    }
}

export default Login;