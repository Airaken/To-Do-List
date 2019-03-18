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
            result:'reload'
        }
        this.isLogin = this.isLogin.bind(this);   
        this.isLogin();
    }
    isLogin() {
        fetch('/login/user')
            .then(res => res.json().then(data =>{
                if(data.ok){
                    this.setState({ result: 'main' })
                }else{
                    this.setState({ result: 'login' })
                }
        }))
            .catch(res => res.json().then(this.setState({ result: 'login' })))
    }
    callback(result){
        this.setState({result});
    }
    render(){
        let render=<Login callback={this.callback.bind(this)} />;
        // switch this.state.result for render components
        switch (this.state.result) {
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