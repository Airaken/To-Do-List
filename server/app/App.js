import React, {Component} from 'react';
import Login from './components/login/Login';
import Loading from './Loading';
import Header from './components/header/Header';
import Board from './components/board/Board';
import Users from './components/users/Users';
import {render} from 'react-dom';

class App extends Component{
    constructor(){
        super();       
        this.state = {
            result:'reload',
            route:'board'
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
    routes(route){
        this.setState({route});
    }
    render(){
        var board = '', login = '', loading='', header = '', userList ='';
        // switch this.state.result for render components
        switch (this.state.result) {
            case true:
                header = <Header routes={this.routes.bind(this)} callback={this.logInOut.bind(this)} />
                switch (this.state.route) {
                    case 'board':
                        board = <Board />
                        break;
                    case 'userList':
                        userList = <Users/>
                        break
                }
                break;
            case false:
                login = <Login callback={this.logInOut.bind(this)} />
                break;
            case 'reload':
                loading = <Loading />
                break
            default:
                //error
                break;
        }
        return (
            <div>
                {login}
                {loading}
                {header}
                {board}
                {userList}
            </div>
        )
    }
}

render(<App/>,document.getElementById('root'));