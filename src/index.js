import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from './views/App';
import Home from './views/Home/Home';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import CreatePost from './views/NewPost/CreatePost';
import './index.css';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="register" component={Register} />
            <Route path="login" component={Login} />
            <Route path="new_post" component={CreatePost} />
        </Route>
    </Router>,
  document.getElementById('root')
);
