import React, {Component} from 'react';
import Login from './components/login/Login';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import {render} from 'react-dom';
import Board from './components/board/Board';

class App extends Component{
    constructor(){
        super();       
        this.state = {
            result:true,
            route:''
        }
        this.isLogin = this.isLogin.bind(this);   
        this.isLogin();
    }
    isLogin(){
        if(this.state.result){
            fetch('/login/user')
            .then(res => res.json().then(data => this.setState({result:data.ok})))           
            .catch(res => res.json().then(data => this.setState({result:data.ok})))
        }
    }
    logInOut(result){
        this.setState({result});
    }
    routes(route){
        this.setState({route});
    }
    render(){
        var board = '', login = '', header = '', footer = '', newTask='', userList='';
        // switch (this.state.route) {
        //     case 'MAIN':
        //         newTask = '';
        //         userList = '';
        //         break;
        //     case 'TASK':
        //         newTask = '';
        //         userList = '';
        //         break;
        // }
        if(this.state.result){
            login = ''
            header = <Header routes={this.routes.bind(this)} callback={this.logInOut.bind(this)}/>
            board = <Board/> 
            footer = <Footer/>
        }else if(!this.state.result){
            login = <Login callback={this.logInOut.bind(this)}/>
            header = '';
            footer = '';
        }
        return(
            <div>
                {login}
                {header}
                {board}
                {footer}
            </div>
        )
    }
}

render(<App/>,document.getElementById('root'));