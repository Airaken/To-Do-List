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
        .then(this.props.logOut())
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
                            <li className="p-1 nav-item active">
                                <button id="users" type="button" onClick={this.handleClick} className="btn btn-dark">Users</button>
                            </li>
                            <li className="p-1 nav-item active">
                                <button id="tasks" type="button" onClick={this.handleClick} className="btn btn-dark">Archived tasks</button>
                            </li>
                        </ul>
                        <button id="logout" type="button" onClick={this.handleClickLogout} className="btn btn-danger">Logout</button>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;