import React, { Component } from 'react';
class Header extends Component{
    constructor(){
        super();
        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(route){
        console.log(route);// change this need get a element
    }
    handleClickLogout(){
        fetch('/logout')
        .then(res => res.json())
        .then(data => this.props.callback(!data.ok))
        .catch(err => console.log(err));
    }
    render(){
        return(
            // code 
            <header className="">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" onClick={this.handleClick('board')}>To-Do List</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <button type="button" onClick={this.handleClick('newTask')} className="btn btn-dark">New Task</button>
                            </li>
                            <li className="nav-item active">
                                <button type="button" onClick={this.handleClick('userList')} className="btn btn-dark">Users</button>
                            </li>
                            <li className="nav-item danger">
                                <button type="button" onClick={this.handleClickLogout} className="btn btn-danger">Logout</button>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;