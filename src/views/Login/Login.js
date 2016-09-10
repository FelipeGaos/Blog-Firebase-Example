/**
 * Created by raul on 9/10/16.
 */

import React, { Component } from 'react';
import './login.css';

class Login extends Component {
    render() {
        return (
            <form className="form-signin">
                <h2 className="form-signin-heading">Please sign in</h2>
                <label className="sr-only">Email</label>
                <input type="email" className="form-control" placeholder="Email" />
                <label className="sr-only">Password</label>
                <input type="password" className="form-control" placeholder="Password" />

                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign In</button>
            </form>
        );
    }
}

export default Login;