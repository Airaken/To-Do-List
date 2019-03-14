import React, { Component } from 'react';
import './Task.css'
class Task extends Component{
    constructor(){
        super();
         // usersSelect validates if the list of users of task cards is selected
        this.state = {  
            usersSelect:false,
            users:[]
        }
        this.renderBodyCard = this.renderBodyCard.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }  
    componentDidMount(){
        this.fetchUsers();
    }
    // a fetch to get a list of users 
    fetchUsers() {
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                let dataUsers = data.users;
                let taskUsers = this.props.task.users;
                let users = []
                taskUsers.map(taskUser => {
                    dataUsers.map(user => {
                        if (JSON.stringify(user._id) === JSON.stringify(taskUser)) {
                            users.push(user);
                        }
                    })
                });
                this.setState({ users });
            })
            .catch(err => console.log(err));
    }
    renderUser(user) {
        return (
            <div key={user._id} className=" list-group-item list-group-item-action list-group-item-light" >
                <div className="row">
                    <div className="col-9">
                        <span>{user.name}</span>
                    </div>
                    <div className="col-3">
                        <span className="badge badge-danger" type="button"> Delete</span>
                    </div>
                </div>
            </div>
        )
    }
    renderBodyCard(){
        let users = this.state.users.map(user => this.renderUser(user) );
        switch (this.state.usersSelect) {
            case false:
            return(
                <div className="card-body">
                    <h5 className="card-title">{this.props.task.name}</h5>
                     <p className="card-text mb-3">{this.props.task.description}</p>             
                    <a className="btn btn-primary"
                        id="edit" onClick={this.handleClick}>Edit</a>
                </div>
            );
            case true:
            return(
                <div className="card-body">
                    <div>
                        <span className="badge badge-primary" type="button">Assign User</span>
                    </div>
                    {users}
                </div>
            );
        }
    }
    // this function change usersSelect depending on which link is selected
    handleClick(e) {
        switch (e.target.id) {
            case 'task':
                this.setState({
                    usersSelect: false
                });
                break;
            case 'users':
                this.setState({
                    usersSelect: true
                });
                break;
            case 'edit':
                break;
        }
    }
    render(){
        const bodyCard = this.renderBodyCard();
        let selectTask = 'active',selectUsers='';
        if (!this.state.usersSelect) {
            selectTask = 'active';
        }else{
            selectUsers = 'active';
        }
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mt-3">
                <div className="card" key={this.props.task._id}>
                    <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <a className={`nav-link ${selectTask}`}
                                    id="task" onClick={this.handleClick}>Task</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${selectUsers}`}
                                    id="users" onClick={this.handleClick}>Users</a>
                            </li>
                        </ul>
                    </div>
                    {bodyCard}
                </div>
            </div>
            
        )
    }
}

export default Task;