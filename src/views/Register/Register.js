/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import './register.css';

class Register extends Component {
    render() {
        return (
            <form className="form-signup">
                <h2 className="form-signin-heading">Please sign up</h2>
                <label className="sr-only">Email</label>
                <input type="email" className="form-control" placeholder="Email" />
                <label className="sr-only">Password</label>
                <input type="password" className="form-control" placeholder="Password" />
                <label className="sr-only">Repeat Password</label>
                <input type="password" className="form-control" placeholder="Repeat Password" />

                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
            </form>
        );
    }
}

export default Register;