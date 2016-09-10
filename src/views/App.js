import React, { Component } from 'react';
import bottomLogo from '../images/leaper-footer.png'
import { Link } from 'react-router'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <div className="page-wrap">
              <div className="App-header">
                  <div className="header-bar">
                      <ul className="nav navbar-nav navbar-right">
                          <li>
                              <Link to="/">Home</Link>
                          </li>
                          <li>
                              <Link to="/login">Sign In</Link>
                          </li>
                          <li>
                              <Link to="/register">Create Account</Link>
                          </li>
                      </ul>
                  </div>
                  <div className="site-heading">
                      <h2>Magic Leap</h2>
                      <hr className="small" />
                      <span className="subheading">Engineering Blog</span>
                  </div>
              </div>

              <div>
                  {this.props.children}
              </div>
          </div>

          <div className="footer">
              <p>Copyright © 2016 Magic Leap, Inc. </p>
              <img src={bottomLogo} alt="bottom-Logo" />
          </div>
      </div>

    );
  }
}

export default App;
