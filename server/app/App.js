import React, {Component} from 'react';
import Login from './Login';
import Main from './Main'
import Loading from './Loading';
import {render} from 'react-dom';

class App extends Component{
    constructor(){
        super();       
        this.state = {
            result:'reload'
        }
        this.isLogin = this.isLogin.bind(this);   
        this.isLogin();
    }
    isLogin() {
        fetch('/login/user')
            .then(res => res.json().then(data => this.setState({ result: data.ok })))
            .catch(res => res.json().then(data => this.setState({ result: data.ok })))
    }
    logInOut(result){
        this.setState({result});
    }
    render(){
        let render=<Login logInOut={this.logInOut.bind(this)} />;
        // switch this.state.result for render components
        switch (this.state.result) {
            case true:
                render = <Main logInOut={this.logInOut.bind(this)} />
                break;
            case false:
                render = <Login logInOut={this.logInOut.bind(this)} />
                break;
            case 'reload':
                render = <Loading />
                break
            default:
                render = <Login logInOut={this.logInOut.bind(this)} />
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