import React, { Component } from 'react';
import Header from './components/header/Header';
import Board from './components/board/Board';
import Users from './components/users/Users';
import List from './components/list/List';
//construction of class Signin that 
class Main extends Component {
    constructor(){
        super();
        this.state = {
            route:''
        }
    }
    // this function retorn to the login page
    logOut(){
        this.props.callback('login');
    }
    // this function change the states for route control of the application
    routes(route){
        this.setState({route});
    }
    render() {
        let route= '';
        // this funtion takes the route depending on the value of the
        switch (this.state.route) {
            case 'board':
                route = <Board />
                break;
            case 'users':
                route = <Users />
                break;
            case 'tasks':
                route= <List/>;
                break;
            default:
                route = <Board />
                break;
        }
        return (
            <div>
                <Header routes={this.routes.bind(this)} logOut={this.logOut.bind(this)} />
                <div className="container">
                    {route}
                </div>
            </div>
        )
    }
}

export default Main;