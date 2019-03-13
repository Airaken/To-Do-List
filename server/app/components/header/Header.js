import React, { Component } from 'react';
import UserList from '../userList/userList';
class Header extends Component{
    constructor(){
        super();
    }
    handleClick(e){
        e.preventDefault();
        fetch('/user')
        .then(res => res.json())
        .then(data => {
            let user = data.users;
            user.forEach(element => {
                <UserList value={element.name}/>
            });
        })
        .catch(err => console.log(err));
    }
    render(){
        return(
            // code 
            <header className="">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="#">To-Do List</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="#">New Task</a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Users</a>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;