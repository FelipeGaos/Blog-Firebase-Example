/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import { Helpers } from '../../Helpers/helpers'
import AlertMessage from '../../components/Alert/AlertMessage'
import './register.css';

class Register extends Component {
    constructor (props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            repeatPass: "",
            alertMessage: "",
            alertType: "danger",
            visible: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
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

    handleRepeatPasswordChange = (e) => {
        this.setState({repeatPass: e.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (Helpers.hasEmptyFields(this.state.email, this.state.password, this.state.repeatPass)) {
            this.showAlertMessage("There are empty fields!", 2500);
            return;
        }
        if (!Helpers.isValidEmail(this.state.email)) {
            this.showAlertMessage("Invalid email address!", 2500);
            return;
        }
        if (!Helpers.passwordsMatch(this.state.password, this.state.repeatPass)) {
            this.showAlertMessage("Passwords don't match!", 2500);
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            hashHistory.push('/');
        }, (error) => {
            this.showAlertMessage(error.message, 3000);
        });
    };

    render() {
        return (
            <div>
                <AlertMessage type={this.state.alertType} message={this.state.alertMessage} visible={this.state.visible} />

                <form className="form-signup" onSubmit={this.handleSubmit}>
                    <h2 className="form-signin-heading">Registro de Usuario</h2>
                    <label className="sr-only">Email</label>
                    <input type="email" className="form-control" placeholder="Email" onChange={this.handleEmailChange} />
                    <label className="sr-only">Contraseña</label>
                    <input type="password" className="form-control" placeholder="Contraseña" onChange={this.handlePasswordChange} />
                    <label className="sr-only">Repetir Contraseña</label>
                    <input type="password" className="form-control" placeholder="Repetir Contraseña" onChange={this.handleRepeatPasswordChange} />

                    <button className="btn btn-lg btn-primary btn-block" type="submit">Registrar</button>
                </form>
            </div>
        );
    }
}

export default Register;