import React, { Component } from 'react';
class Header extends Component{
    constructor(){
        super();
        // whit router, have control to the diferents views in the page
        this.state ={
            route:'board'
        }
        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    // this function sends the route depending on where press
    handleClick(e){
        this.props.routes(e.target.id)     
    }
    // function to logout, meke a get and change Token on server
    handleClickLogout(){
        fetch('/logout')
        .then(res => res.json())
        .then(data => {
            let result = data.ok
            this.props.logInOut(!result)
        })
        .catch(err => console.log(err));
    }
    render(){
        return (
            <header className="">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a id="board" onClick={this.handleClick} className="navbar-brand" href="#">To-Do List</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <button id="newTask" type="button" onClick={this.handleClick} className="btn btn-dark">New Task</button>
                            </li>
                            <li className="nav-item active">
                                <button id="users" type="button" onClick={this.handleClick} className="btn btn-dark">Users</button>
                            </li>
                            <li className="nav-item danger">
                                <button id="logout" type="button" onClick={this.handleClickLogout} className="btn btn-danger">Logout</button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;