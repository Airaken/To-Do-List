import React, {Component} from 'react';
import Login from './Login';
import Main from './Main'
import Loading from './Loading';
import {render} from 'react-dom';
import Signin from './Signin';

class App extends Component{
    constructor(){
        super();       
        this.state = {
            route:'reload'
        }
        this.isLogin = this.isLogin.bind(this);   
        this.isLogin();
    }
    // this function inquires if a user is already login
    isLogin() {
        fetch('/login/user')
            .then(res => res.json().then(data =>{
                if(data.ok){
                    this.setState({ route: 'main' })
                }else{
                    this.setState({ route: 'login' })
                }
        }))
            .catch(res => res.json().then(this.setState({ route: 'login' })))
    }
    // this fuction change the state of route
    callback(route){
        this.setState({route});
    }
    render(){
        let render=<Login callback={this.callback.bind(this)} />;
        // switch this.state.route for render components
        switch (this.state.route) {
            case 'main':
                render = <Main  callback={this.callback.bind(this)} />
                break;
            case 'login':
                render = <Login callback={this.callback.bind(this)} />
                break;
            case 'signin':
                render = <Signin callback={this.callback.bind(this)} />
                break
            case 'reload':
                render = <Loading />
                break
            default:
                render = <Login callback={this.callback.bind(this)} />
                break;
        }
        return (
            <div>
                {render}
            </div>
        )
    }
}

render(<App/>,document.getElementById('root'));