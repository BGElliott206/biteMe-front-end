

import React from 'react';
import jwt from 'jsonwebtoken';
import cookie from 'react-cookies';

export const LoginContext = React.createContext();

const API = process.env.REACT_APP_API;

class LoginProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        loggedIn: false,
        token: null,
        user: {},
        login: this.login,
        logout: this.logout,
    };

// login
login = (username, password, type) => {
    let option = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: new Headers({
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        }),
    };

    if (type === 'signup') {
        options.body = JSON.stringify({ username, password });
        options.headers = new Headers({
            'Content-Type': 'application/json',
        });
    }

    fetch(`${API}/${type}`, options)
        .then((response) => response.text())
        .then((token) => this.validateToken(token))
        .catch(console.error);   
}
//logout
logout = () => {
    this.setLoginState(false,null, {});
};

// validate Token
validateToken = (token) => {
    try {
        let user = jwt.verify(token, process.env.REACT_APP_SECRET);
        console.log(user);
        this.setLoginState(true, user, token);
    } catch (e) {
        this.setLoginState(false, null, {});
    }
}

//state handling
setLoginState = (loggedIn, user, token) => {
    cookie.save('auth', token);
    this.setState({ token, loggedIn, user });
}

componentDidMount() {
    const cookieToken = cookie.load('auth');
}

render() {
    return (
        <LoginContext.Provider>
            {this.props.children}
        <LoginContext.Provider>
        );
    }
}

export default LoginProvider;