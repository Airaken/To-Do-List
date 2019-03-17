import React, { Component } from 'react';
import './Task.css'
import Modal from './Modal';
class Task extends Component{
    constructor(){
        super();
         // usersSelect validates if the list of users of task cards is selected
        this.state = { 
            usersInTask:[],
            usersOutTask:[]
        }
        this.handleClick = this.handleClick.bind(this);
    }  
    componentDidMount(){
        this.fetchUsers();
    }
    // a fetch to get a list of users 
    fetchUsers() {
        if (this.props.task.users.length !== 0) {
            this.props.task.users.map(userId => {
                fetch('/user/' + userId)
                    .then(res => res.json())
                    .then(data => {
                        //add user to list of users assigned in task
                        let usersInTask = this.state.usersInTask;
                        usersInTask.push(data.user);
                        this.setState({usersInTask});
                    })
                    .catch(err => console.log(err));
            });
        }
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                //add user to list of users not assigned in thask-
                let users = data.user;
                let usersOutTask = data.users;
                this.state.usersInTask.map(userTask => {
                    usersOutTask = usersOutTask.filter(user => user._id !== userTask._id);
                });
                this.setState({users});
                this.setState({ usersOutTask });
            })
            .catch(err => console.log(err));
    }
    // this function change usersSelect depending on which link is selected
    handleClick(e) {
        switch (e.target.name) {
            case 'assign':
                fetch('/task/assignUser/' + e.target.id + '&' + this.props.task._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        //add user to list of users assigned
                        let usersOutTask = this.state.usersOutTask.filter(userId => userId._id !== data.user._id);
                        let usersInTask = this.state.usersInTask;
                        usersInTask.push(data.user)
                        this.setState({usersInTask});
                        this.setState({usersOutTask});
                    })
                    .catch(err => console.log(err));
                break;
            case 'remove':
                fetch('/task/removeUser/' + e.target.id + '&' + this.props.task._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        // remove users to list of users asssigned in task
                        let usersInTask = this.state.usersInTask.filter(userId => userId._id !== data.user._id);
                        let usersOutTask = this.state.usersOutTask;
                        usersOutTask.push(data.user)
                        this.setState({usersOutTask});
                        this.setState({ usersInTask });
                    })
                    .catch(err => console.log(err));
                break;
            case 'edit':

                break;
            default:
                break;
        }
    }
    // function to render each user assigned to the task
    renderUser(user) {
        return (
            <div key={user._id} className=" list-group-item list-group-item-action list-group-item-light" >
                <div className="row">
                    <div className="col-8">
                        <span>{user.name}</span>
                    </div>
                    <div className="col-4">
                        <div>
                            <button name="remove" id={user._id} onClick={this.handleClick} className="badge badge-danger pl-2" type="button"> Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    listUser(user) {
        return (
            <div className="input-group mb-3" key={user._id}>
                <input value={user.name} disabled type="text" className="form-control" aria-label="Text input with checkbox" />
                <div className="input-group-prepend">
                    <div>
                        <button name="assign" id={user._id} onClick={this.handleClick} className="badge badge-primary pl-2" type="button"> Assign</button>
                    </div>
                </div>
            </div>
        )
    }
    // main render task
    render() {
        let usersInTask = this.state.usersInTask.map(user => this.renderUser(user));
        let usersOutTask = this.state.usersOutTask.map(user => this.listUser(user));
        if (users.length === 0) {
            usersOutTask = 'there are no users to show'
        }
        let id = `id-${this.props.task._id}`;
        let task = this.props.task;
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-3">
                <div className="card" key={task._id}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="task-tab" data-toggle="tab" href={`#task-${id}`} role="tab" aria-controls="task" aria-selected="true">Task</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="users-tab" data-toggle="tab" href={`#users-${id}`} role="tab" aria-controls="users" aria-selected="false">Users</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id={`task-${id}`} role="tabpanel" aria-labelledby="task-tab">
                            <div className="card-body">
                                <h5 className="card-title">{task.name}</h5>
                                <p className="card-text mb-3">{task.description}</p>
                                <button name="edit" onClick={this.handleClick} type="button" className="badge badge-primary">Edit</button>

                            </div>
                        </div>
                        <div className="tab-pane fade" id={`users-${id}`} role="tabpanel" aria-labelledby="users-tab">
                            <div className="card-body">
                                <button data-toggle="modal" data-target={"#" + id}
                                    className="badge badge-primary" type="button">Assign User</button>
                                <div key={task._id} className="modal fade" id={`id-${task._id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalScrollableTitle">Assign users to {task.name}</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {usersOutTask}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button onClick={this.handleClick} type="button" className="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {usersInTask}
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}

export default Task;